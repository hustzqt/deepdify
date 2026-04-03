// Ref: docs/api/brand-analysis-contract.md
// Backend-for-AI: Dify Workflow proxy with session auth and Redis-backed sliding-window rate limit.

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { extractDifyUsageMetrics } from '@/lib/ai/extract-dify-usage'
import { toPrismaJson } from '@/lib/ai/prisma-json'
import { prisma } from '@/lib/prisma'
import { checkBrandAnalyzeRateLimit } from '@/lib/redis-rate-limit'
import { brandAnalyzeRequestSchema } from '@/lib/validations/brand-analyze'

export const dynamic = 'force-dynamic'

/** Vercel serverless: allow long Dify blocking calls (Hobby plan still caps at ~10s). */
export const maxDuration = 60

/**
 * Extract primary output from Dify workflows/run JSON (blocking).
 * Supports `{ data: { outputs: { result: ... } } }` or a single output key.
 */
function extractWorkflowOutput(difyJson: unknown): unknown {
  if (typeof difyJson !== 'object' || difyJson === null) return null
  const root = difyJson as {
    data?: { outputs?: Record<string, unknown>; usage?: { total_tokens?: number } }
  }
  const outputs = root.data?.outputs
  if (!outputs || typeof outputs !== 'object') return null
  if (typeof outputs.result !== 'undefined') return outputs.result
  const keys = Object.keys(outputs)
  if (keys.length === 1) {
    const key = keys[0]
    if (key !== undefined) return outputs[key]
  }
  return outputs
}

/**
 * Parse JSON string from LLM into object when possible.
 */
function normalizeAnalysisResult(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return raw
  }
}

/**
 * POST /api/ai/brand-analyze — proxy to Dify Workflow (blocking).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Please sign in to use AI features',
        },
      },
      { status: 401 }
    )
  }

  const userId = session.user.id

  const rate = await checkBrandAnalyzeRateLimit(userId)
  if (!rate.success) {
    const now = Date.now()
    const retryAfter = Math.max(
      1,
      Math.ceil((rate.resetAt.getTime() - now) / 1000)
    )
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Please wait ${retryAfter} seconds.`,
          retryAfter,
          resetAt: rate.resetAt.toISOString(),
        },
      },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Invalid JSON body' },
      },
      { status: 400 }
    )
  }

  const parsed = brandAnalyzeRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const { brandName, industry, targetAudience, brandDescription, brandId } =
    parsed.data

  const apiKey = process.env.DIFY_BRAND_ANALYSIS_KEY ?? process.env.DIFY_API_KEY
  const baseUrl =
    (process.env.DIFY_BASE_URL ?? 'https://api.dify.ai/v1').replace(/\/$/, '')

  if (!apiKey) {
    console.error('[brand-analyze] Missing DIFY_BRAND_ANALYSIS_KEY or DIFY_API_KEY')
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CONFIG_ERROR',
          message: 'AI service is not configured',
        },
      },
      { status: 500 }
    )
  }

  const difyPayload = {
    inputs: {
      brand_name: brandName,
      industry,
      target_audience: targetAudience ?? '',
      brand_description: brandDescription ?? '',
    },
    response_mode: 'blocking' as const,
    user: userId,
  }

  try {
    const requestStartedAt = Date.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30_000)

    const response = await fetch(`${baseUrl}/workflows/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(difyPayload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const rawText = await response.text()
    let difyJson: unknown
    try {
      difyJson = rawText ? JSON.parse(rawText) : null
    } catch {
      console.error('[brand-analyze] Dify non-JSON response:', rawText.slice(0, 500))
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_SERVICE_ERROR',
            message: 'AI service returned invalid response',
          },
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      console.error('Dify API error:', response.status, rawText.slice(0, 500))
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_SERVICE_ERROR',
            message: 'Brand analysis service temporarily unavailable',
            retryAfter: 30,
          },
        },
        { status: 502 }
      )
    }

    const analysisRaw = extractWorkflowOutput(difyJson)
    if (analysisRaw === null || typeof analysisRaw === 'undefined') {
      console.error('[brand-analyze] Missing outputs in Dify response:', difyJson)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_SERVICE_ERROR',
            message: 'AI returned data in an unexpected shape',
          },
        },
        { status: 502 }
      )
    }

    const result = normalizeAnalysisResult(analysisRaw)

    const usage = extractDifyUsageMetrics(difyJson)
    const durationMs = Date.now() - requestStartedAt

    let resolvedBrandId: string | null = null
    if (brandId) {
      const owned = await prisma.brand.findFirst({
        where: { id: brandId, userId },
        select: { id: true },
      })
      resolvedBrandId = owned?.id ?? null
    }

    let usageLogId: string | null = null
    try {
      const log = await prisma.aiUsageLog.create({
        data: {
          userId,
          brandId: resolvedBrandId,
          workflowType: 'brand-analyze',
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          costUsd: usage.costUsd,
          status: 'success',
          durationMs,
        },
        select: { id: true },
      })
      usageLogId = log.id
    } catch (logErr) {
      console.error('[brand-analyze] AiUsageLog create failed:', logErr)
    }

    if (resolvedBrandId && usageLogId) {
      try {
        await prisma.brandAnalysisResult.create({
          data: {
            brandId: resolvedBrandId,
            userId,
            result: toPrismaJson(result),
            usageLogId,
          },
        })
      } catch (persistErr) {
        console.error('[brand-analyze] BrandAnalysisResult create failed:', persistErr)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        analysisId: `ana_${Date.now()}`,
        brandId: brandId ?? null,
        result,
        model: 'workflow',
        tokensUsed: usage.totalTokens,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TIMEOUT',
            message: 'AI analysis timed out. Please try again.',
          },
        },
        { status: 504 }
      )
    }
    console.error('[brand-analyze] Dify fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      },
      { status: 500 }
    )
  }
}
