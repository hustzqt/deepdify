'use client'

/**
 * Fetches and lists persisted brand analysis results (newest first).
 */
import { useCallback, useEffect, useState, type ReactElement } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

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

export function BrandAnalysisHistory({
  brandId,
  refreshKey = 0,
}: BrandAnalysisHistoryProps): ReactElement {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/brands/${encodeURIComponent(brandId)}/analysis-history?limit=20`,
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
  }, [brandId])

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
          <p className="text-muted-foreground text-sm">暂无历史记录。完成一次分析后将自动保存。</p>
        ) : null}

        {items?.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border border-foreground/10 bg-muted/20 p-3"
          >
            <p className="text-muted-foreground mb-2 text-xs">
              {new Date(row.createdAt).toLocaleString()}
            </p>
            <ScrollArea className="max-h-[min(280px,40vh)] rounded-md border bg-background/50 p-2">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(row.result, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
