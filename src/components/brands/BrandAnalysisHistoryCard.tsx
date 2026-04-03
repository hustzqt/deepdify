'use client'

/**
 * Single history row: summary header + expand/collapse for full BrandAnalysisResultCard.
 */
import { useState, type ReactElement } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BrandAnalysisResultCard } from '@/components/brands/BrandAnalysisResultCard'
import { normalizeBrandAnalysis } from '@/lib/brand-analysis-normalize'

export interface BrandAnalysisHistoryRow {
  id: string
  createdAt: string
  result: unknown
}

export interface BrandAnalysisHistoryCardProps {
  item: BrandAnalysisHistoryRow
}

/**
 * Renders one persisted analysis entry with collapsible detail view.
 */
export function BrandAnalysisHistoryCard({
  item,
}: BrandAnalysisHistoryCardProps): ReactElement {
  const [expanded, setExpanded] = useState(false)
  const normalized = normalizeBrandAnalysis(item.result)
  const confidencePct =
    normalized.confidence_score > 0
      ? Math.round(normalized.confidence_score * 100)
      : null

  return (
    <Card className="border-muted-foreground/15">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 py-3">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm font-medium leading-snug">
            {new Date(item.createdAt).toLocaleString()}
          </CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            {confidencePct !== null ? (
              <>置信度：{confidencePct}%</>
            ) : (
              <>置信度：—</>
            )}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-expanded={expanded}
          aria-controls={`history-detail-${item.id}`}
          id={`history-toggle-${item.id}`}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
          <span className="sr-only">{expanded ? '收起详情' : '展开详情'}</span>
        </Button>
      </CardHeader>
      {expanded ? (
        <CardContent className="pt-0 pb-4" id={`history-detail-${item.id}`} role="region">
          <BrandAnalysisResultCard result={item.result} />
        </CardContent>
      ) : null}
    </Card>
  )
}
