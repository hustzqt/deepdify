'use client'

import { useCallback, useEffect, useState, type ReactElement } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  UsageDashboardPanels,
  type UsageLogRow,
} from '@/components/dashboard/usage/UsageDashboardPanels'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface UsageApiBody {
  success: boolean
  data?: {
    items: UsageLogRow[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
  error?: { message?: string }
}

interface SummaryApiBody {
  success: boolean
  data?: {
    summary: {
      totalCalls: number
      totalTokens: number
      totalCostUsd: number
    }
    trend: Array<{
      date: string
      calls: number
      tokens: number
      costUsd: number
    }>
    meta: {
      timezone: string
      summaryRange: { start: string | null; end: string | null } | null
      trendRange: { start: string; end: string } | null
      groupBy: string | null
    }
  }
  error?: { message?: string }
}

const PAGE_SIZE = 20

/**
 * AI usage dashboard: full summary + trend from GET /api/ai/usage/summary, list from GET /api/ai/usage.
 */
export default function UsageDashboardPage(): ReactElement {
  const [page, setPage] = useState(1)
  const [summaryPayload, setSummaryPayload] = useState<SummaryApiBody['data'] | null>(
    null
  )
  const [listPayload, setListPayload] = useState<UsageApiBody['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (targetPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams({
        page: String(targetPage),
        limit: String(PAGE_SIZE),
      })
      const [sumRes, listRes] = await Promise.all([
        fetch('/api/ai/usage/summary?groupBy=day', { credentials: 'include' }),
        fetch(`/api/ai/usage?${qs.toString()}`, { credentials: 'include' }),
      ])
      const sumJson = (await sumRes.json()) as SummaryApiBody
      const listJson = (await listRes.json()) as UsageApiBody
      if (!sumRes.ok || !sumJson.success || !sumJson.data) {
        const msg =
          sumJson.error?.message ??
          (sumRes.status === 401 ? '请先登录' : `汇总请求失败 (${sumRes.status})`)
        throw new Error(msg)
      }
      if (!listRes.ok || !listJson.success || !listJson.data) {
        const msg =
          listJson.error?.message ??
          (listRes.status === 401 ? '请先登录' : `列表请求失败 (${listRes.status})`)
        throw new Error(msg)
      }
      setSummaryPayload(sumJson.data)
      setListPayload(listJson.data)
      setPage(targetPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSummaryPayload(null)
      setListPayload(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(1)
  }, [load])

  if (loading && (!summaryPayload || !listPayload)) {
    return (
      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-10">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (error && (!summaryPayload || !listPayload)) {
    return (
      <div className="container mx-auto max-w-6xl space-y-4 px-4 py-10">
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void load(page)}>
              重试
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const items = listPayload?.items ?? []
  const pagination = listPayload?.pagination
  const summary = summaryPayload?.summary
  const trend = summaryPayload?.trend ?? []
  const trendMeta = summaryPayload?.meta?.trendRange
  const trendLast7 = trend.slice(-7)

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
      <UsageDashboardPanels
        error={error}
        onRetry={() => void load(page)}
        summary={summary}
        trendLast7={trendLast7}
        trendRange={trendMeta}
        items={items}
        pagination={pagination}
        loading={loading}
        onPageChange={(p) => void load(p)}
      />
    </div>
  )
}
