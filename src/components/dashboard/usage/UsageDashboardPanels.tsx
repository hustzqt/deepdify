'use client'

import type { ReactElement } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const PAGE_SIZE = 20

export interface UsageLogRow {
  id: string
  createdAt: string
  workflowType: string
  totalTokens: number
  costUsd: number | null
  status: string
  brand: { id: string; name: string } | null
}

export interface UsageDashboardPanelsProps {
  error: string | null
  onRetry: () => void
  summary: {
    totalCalls: number
    totalTokens: number
    totalCostUsd: number
  } | undefined
  trendLast7: Array<{
    date: string
    calls: number
    tokens: number
    costUsd: number
  }>
  trendRange: { start: string; end: string } | null | undefined
  items: UsageLogRow[]
  pagination:
    | {
        page: number
        limit: number
        total: number
        pages: number
      }
    | undefined
  loading: boolean
  onPageChange: (page: number) => void
}

/**
 * Summary cards, trend table, and paginated usage log for the dashboard.
 */
export function UsageDashboardPanels({
  error,
  onRetry,
  summary,
  trendLast7,
  trendRange,
  items,
  pagination,
  loading,
  onPageChange,
}: UsageDashboardPanelsProps): ReactElement {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI 用量统计</h1>
        <p className="text-muted-foreground text-sm">
          汇总卡片为账户<strong>全量</strong>累计（未传日期筛选时）；趋势表为默认
          {trendRange ? ` ${trendRange.start}～${trendRange.end}` : ''}（UTC，按天）。
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              重试
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              总调用次数
            </CardTitle>
            <CardDescription>全量汇总</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {summary?.totalCalls ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              总 Tokens
            </CardTitle>
            <CardDescription>全量汇总</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {(summary?.totalTokens ?? 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              总成本 USD
            </CardTitle>
            <CardDescription>有则累计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              ${(summary?.totalCostUsd ?? 0).toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>趋势（最近 7 个统计日）</CardTitle>
          <CardDescription>
            数据来自全量汇总接口的按天桶；窗口为最近 30 天（UTC）中的最后 7 个有数据日或不足 7 条则全部展示。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium">日期 (UTC)</th>
                  <th className="pb-2 pr-4 font-medium">次数</th>
                  <th className="pb-2 pr-4 font-medium">Tokens</th>
                  <th className="pb-2 font-medium">成本 USD</th>
                </tr>
              </thead>
              <tbody>
                {trendLast7.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-muted-foreground py-6 text-center">
                      暂无趋势数据
                    </td>
                  </tr>
                ) : (
                  trendLast7.map((row) => (
                    <tr key={row.date} className="border-b border-foreground/5">
                      <td className="py-2 pr-4 tabular-nums">{row.date}</td>
                      <td className="py-2 pr-4 tabular-nums">{row.calls}</td>
                      <td className="py-2 pr-4 tabular-nums">
                        {row.tokens.toLocaleString()}
                      </td>
                      <td className="py-2 tabular-nums">${row.costUsd.toFixed(4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>详细记录</CardTitle>
          <CardDescription>
            共 {pagination?.total ?? 0} 条 · 每页 {pagination?.limit ?? PAGE_SIZE} 条
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">时间</th>
                  <th className="px-3 py-2 font-medium">品牌</th>
                  <th className="px-3 py-2 font-medium">类型</th>
                  <th className="px-3 py-2 font-medium">Tokens</th>
                  <th className="px-3 py-2 font-medium">成本 (USD)</th>
                  <th className="px-3 py-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-muted-foreground px-3 py-8 text-center">
                      暂无用量记录
                    </td>
                  </tr>
                ) : (
                  items.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-foreground/5 hover:bg-muted/30"
                    >
                      <td className="text-muted-foreground px-3 py-2 tabular-nums">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">{record.brand?.name ?? '—'}</td>
                      <td className="px-3 py-2">{record.workflowType}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {record.totalTokens.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {record.costUsd != null
                          ? `$${record.costUsd.toFixed(4)}`
                          : '—'}
                      </td>
                      <td className="px-3 py-2">{record.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm">
                第 {pagination.page} / {pagination.pages} 页
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => onPageChange(pagination.page - 1)}
                >
                  上一页
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages || loading}
                  onClick={() => onPageChange(pagination.page + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  )
}
