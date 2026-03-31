// Ref: docs/api/brand-analysis-contract.md
// Backend-for-AI: Dify Workflow proxy with session auth and in-memory rate limit (dev).

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { brandAnalyzeRequestSchema } from '@/lib/validations/brand-analyze'

export const dynamic = 'force-dynamic'

const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

/** In-memory rate limit per user (resets per Node process; use Redis in production). */
const rateLimit = new Map<string, { count: number; resetAt: number }>()

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

function getTokensUsed(difyJson: unknown): number {
  if (typeof difyJson !== 'object' || difyJson === null) return 0
  const root = difyJson as {
    data?: { usage?: { total_tokens?: number }; total_tokens?: number }
    usage?: { total_tokens?: number }
  }
  return (
    root.data?.usage?.total_tokens ??
    root.data?.total_tokens ??
    root.usage?.total_tokens ??
    0
  )
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

  const now = Date.now()
  let entry = rateLimit.get(userId)
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW_MS }
    rateLimit.set(userId, entry)
  }
  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Please wait ${retryAfter} seconds.`,
          retryAfter,
        },
      },
      { status: 429 }
    )
  }
  entry.count += 1

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

    return NextResponse.json({
      success: true,
      data: {
        analysisId: `ana_${Date.now()}`,
        brandId: brandId ?? null,
        result,
        model: 'workflow',
        tokensUsed: getTokensUsed(difyJson),
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
