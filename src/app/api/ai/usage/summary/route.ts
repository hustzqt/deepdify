// GET /api/ai/usage/summary — aggregated AiUsageLog totals and optional time-bucket trend (UTC).

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import {
  defaultTrendDateRange,
  endOfDayUTC,
  startOfDayUTC,
  trendBucketExpr,
  type UsageTrendRow,
} from '@/lib/ai/usage-summary'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

const querySchema = z
  .object({
    start: isoDate.optional(),
    end: isoDate.optional(),
    groupBy: z.enum(['day', 'week', 'month']).optional(),
  })
  .refine(
    (q) => {
      if (!q.start || !q.end) return true
      return startOfDayUTC(q.start).getTime() <= endOfDayUTC(q.end).getTime()
    },
    { message: 'start must be on or before end' }
  )

type TrendQueryRow = {
  date: string
  calls: number
  tokens: bigint
  costUsd: number | null
}

/**
 * Returns usage summary (and optional trend buckets) for the signed-in user.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const parsed = querySchema.safeParse(
    Object.fromEntries(searchParams.entries())
  )
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query',
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const userId = session.user.id
  const rawStart = parsed.data.start
  const rawEnd = parsed.data.end
  const groupBy = parsed.data.groupBy

  const summaryWhere: Prisma.AiUsageLogWhereInput = { userId }
  if (rawStart || rawEnd) {
    summaryWhere.createdAt = {}
    if (rawStart) summaryWhere.createdAt.gte = startOfDayUTC(rawStart)
    if (rawEnd) summaryWhere.createdAt.lte = endOfDayUTC(rawEnd)
  }

  const aggregate = await prisma.aiUsageLog.aggregate({
    where: summaryWhere,
    _count: { id: true },
    _sum: { totalTokens: true, costUsd: true },
  })

  const summary = {
    totalCalls: aggregate._count.id,
    totalTokens: aggregate._sum.totalTokens ?? 0,
    totalCostUsd: aggregate._sum.costUsd ?? 0,
  }

  let trend: UsageTrendRow[] = []
  let trendStart: string | undefined
  let trendEnd: string | undefined

  if (groupBy) {
    if (rawStart && rawEnd) {
      trendStart = rawStart
      trendEnd = rawEnd
    } else {
      const d = defaultTrendDateRange()
      trendStart = d.start
      trendEnd = d.end
    }

    const bucket = trendBucketExpr(groupBy)
    const rows = await prisma.$queryRaw<TrendQueryRow[]>(Prisma.sql`
      SELECT
        ${bucket} AS date,
        COUNT(*)::int AS calls,
        COALESCE(SUM("totalTokens"), 0)::bigint AS tokens,
        COALESCE(SUM("costUsd"), 0)::double precision AS "costUsd"
      FROM ai_usage_logs
      WHERE "userId" = ${userId}
        AND "createdAt" >= ${startOfDayUTC(trendStart)}
        AND "createdAt" <= ${endOfDayUTC(trendEnd)}
      GROUP BY 1
      ORDER BY 1 ASC
    `)
    trend = rows.map((r) => ({
      date: r.date,
      calls: r.calls,
      tokens: Number(r.tokens),
      costUsd: r.costUsd ?? 0,
    }))
  }

  return NextResponse.json({
    success: true,
    data: {
      summary,
      trend,
      meta: {
        timezone: 'UTC' as const,
        summaryRange:
          rawStart || rawEnd
            ? { start: rawStart ?? null, end: rawEnd ?? null }
            : null,
        trendRange:
          groupBy && trendStart && trendEnd
            ? { start: trendStart, end: trendEnd }
            : null,
        groupBy: groupBy ?? null,
      },
    },
  })
}
