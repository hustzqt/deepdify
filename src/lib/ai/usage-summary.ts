import { Prisma } from '@prisma/client'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Validates YYYY-MM-DD and returns UTC start-of-day.
 */
export function startOfDayUTC(isoDate: string): Date {
  if (!ISO_DATE.test(isoDate)) {
    throw new Error('Invalid date format')
  }
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0))
}

/**
 * Validates YYYY-MM-DD and returns UTC end-of-day (inclusive).
 */
export function endOfDayUTC(isoDate: string): Date {
  if (!ISO_DATE.test(isoDate)) {
    throw new Error('Invalid date format')
  }
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999))
}

/**
 * Formats a Date as YYYY-MM-DD in UTC.
 */
export function toYmdUTC(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Default trend window: last 30 calendar days (UTC), inclusive.
 */
export function defaultTrendDateRange(): { start: string; end: string } {
  const end = new Date()
  const start = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - 29)
  )
  return { start: toYmdUTC(start), end: toYmdUTC(end) }
}

/** SQL expression for bucket label (UTC). */
export function trendBucketExpr(
  groupBy: 'day' | 'week' | 'month'
): Prisma.Sql {
  if (groupBy === 'day') {
    return Prisma.sql`to_char(date_trunc('day', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD')`
  }
  if (groupBy === 'week') {
    return Prisma.sql`to_char(date_trunc('week', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD')`
  }
  return Prisma.sql`to_char(date_trunc('month', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM')`
}

export type UsageSummaryRow = {
  totalCalls: number
  totalTokens: number
  totalCostUsd: number
}

export type UsageTrendRow = {
  date: string
  calls: number
  tokens: number
  costUsd: number
}
