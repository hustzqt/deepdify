'use client'

/**
 * Fetches and lists persisted brand analysis results (newest first).
 */
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { History } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BrandAnalysisHistoryCard } from '@/components/brands/BrandAnalysisHistoryCard'

export interface BrandAnalysisHistoryProps {
  brandId: string
  /** Increment to refetch after a new analysis is saved. */
  refreshKey?: number
}

type HistoryItem = {
  id: string
  brandId: string
  result: unknown
  usageLogId: string | null
  createdAt: string
}

const HISTORY_PAGE_SIZE = 10
const HISTORY_MAX_LIMIT = 50

export function BrandAnalysisHistory({
  brandId,
  refreshKey = 0,
}: BrandAnalysisHistoryProps): ReactElement {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(HISTORY_PAGE_SIZE)
  /** Which row is expanded (accordion); default follows newest row when list head changes. */
  const [expandedId, setExpandedId] = useState<string | null>(null)
  /** Tracks latest-first row id so we expand newest on new analysis without resetting on "load more". */
  const prevHeadIdRef = useRef<string | null>(null)

  useEffect(() => {
    setLimit(HISTORY_PAGE_SIZE)
  }, [brandId])

  useEffect(() => {
    prevHeadIdRef.current = null
  }, [brandId])

  useEffect(() => {
    if (!items?.length) {
      setExpandedId(null)
      return
    }
    const first = items[0]
    if (!first) {
      return
    }
    const headId = first.id
    if (prevHeadIdRef.current !== headId) {
      prevHeadIdRef.current = headId
      setExpandedId(headId)
    }
  }, [items])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/brands/${encodeURIComponent(brandId)}/analysis-history?limit=${limit}`,
        { credentials: 'include' }
      )
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok || !json || typeof json !== 'object') {
        setError('无法加载历史记录')
        setItems(null)
        return
      }
      const body = json as {
        success?: boolean
        data?: { items?: HistoryItem[] }
        error?: { message?: string }
      }
      if (!body.success || !body.data?.items) {
        setError(body.error?.message ?? '加载失败')
        setItems(null)
        return
      }
      setItems(body.data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误')
      setItems(null)
    } finally {
      setLoading(false)
    }
  }, [brandId, limit])

  useEffect(() => {
    void load()
  }, [load, refreshKey])

  if (loading && items === null) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-muted-foreground" aria-hidden />
          分析历史
        </CardTitle>
        <CardDescription>已保存的 AI 分析结果（按时间从新到旧）</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
                重试
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {!error && items && items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            暂无分析历史。完成一次分析后将自动保存。
          </p>
        ) : null}

        <div className="space-y-3">
          {items?.map((row) => (
            <BrandAnalysisHistoryCard
              key={row.id}
              item={{
                id: row.id,
                createdAt: row.createdAt,
                result: row.result,
              }}
              expanded={expandedId === row.id}
              onToggle={() => {
                setExpandedId((prev) => (prev === row.id ? null : row.id))
              }}
            />
          ))}
        </div>

        {!error && items && items.length >= limit && limit < HISTORY_MAX_LIMIT ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={loading}
            onClick={() =>
              setLimit((n) => Math.min(n + HISTORY_PAGE_SIZE, HISTORY_MAX_LIMIT))
            }
          >
            {loading ? '加载中…' : '加载更多'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
