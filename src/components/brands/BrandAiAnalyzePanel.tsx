'use client'

/**
 * Client panel: calls POST /api/ai/brand-analyze with session cookie.
 */
import { useEffect, useRef, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { BrandAnalysisResultCard } from '@/components/brands/BrandAnalysisResultCard'

const BRAND_ANALYZE_PATH = '/api/ai/brand-analyze'

export interface BrandAiAnalyzePanelProps {
  /** When set, sent as `brandId` and used to reset controlled fields when key changes upstream. */
  initialBrandId?: string
  initialBrandName?: string
  initialIndustry?: string
  initialTargetAudience?: string
  initialBrandDescription?: string
  /** Called after a successful analysis response (HTTP 200 + success payload). */
  onAnalysisSuccess?: () => void
}

type SuccessData = {
  analysisId: string
  brandId: string | null
  result: unknown
  model: string
  tokensUsed: number
  createdAt: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseResponse(json: unknown): { ok: true; data: SuccessData } | { ok: false; message: string } {
  if (!isRecord(json)) return { ok: false, message: 'Invalid response' }
  if (json.success === false && isRecord(json.error)) {
    const msg = json.error.message
    return {
      ok: false,
      message: typeof msg === 'string' ? msg : 'Request failed',
    }
  }
  if (json.success !== true || !isRecord(json.data)) return { ok: false, message: 'Invalid response' }
  const d = json.data
  return {
    ok: true,
    data: {
      analysisId: typeof d.analysisId === 'string' ? d.analysisId : '',
      brandId: typeof d.brandId === 'string' || d.brandId === null ? d.brandId : null,
      result: d.result,
      model: typeof d.model === 'string' ? d.model : '',
      tokensUsed: typeof d.tokensUsed === 'number' ? d.tokensUsed : 0,
      createdAt: typeof d.createdAt === 'string' ? d.createdAt : '',
    },
  }
}

export function BrandAiAnalyzePanel({
  initialBrandId,
  initialBrandName = '',
  initialIndustry = '',
  initialTargetAudience = '',
  initialBrandDescription = '',
  onAnalysisSuccess,
}: BrandAiAnalyzePanelProps) {
  const [brandName, setBrandName] = useState(initialBrandName)
  const [industry, setIndustry] = useState(initialIndustry)
  const [targetAudience, setTargetAudience] = useState(initialTargetAudience)
  const [brandDescription, setBrandDescription] = useState(initialBrandDescription)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SuccessData | null>(null)
  /** Prevents overlapping requests before `loading` state commits (double-click). */
  const analyzeInFlightRef = useRef(false)

  useEffect(() => {
    setBrandName(initialBrandName)
    setIndustry(initialIndustry)
    setTargetAudience(initialTargetAudience)
    setBrandDescription(initialBrandDescription)
  }, [
    initialBrandId,
    initialBrandName,
    initialIndustry,
    initialTargetAudience,
    initialBrandDescription,
  ])

  /**
   * Runs brand analysis; guards against duplicate submission and ensures loading clears on all paths.
   */
  async function handleAnalyze(): Promise<void> {
    if (loading || analyzeInFlightRef.current) return
    if (!brandName.trim() || !industry.trim()) {
      setError('请填写品牌名称和行业')
      return
    }

    setError(null)
    setSuccess(null)
    analyzeInFlightRef.current = true
    setLoading(true)
    try {
      const res = await fetch(BRAND_ANALYZE_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          brandName: brandName.trim(),
          industry: industry.trim(),
          targetAudience: targetAudience.trim() || undefined,
          brandDescription: brandDescription.trim() || undefined,
          brandId: initialBrandId,
          analysisType: 'full',
        }),
      })
      const json: unknown = await res.json().catch(() => null)
      const parsed = parseResponse(json)
      if (!parsed.ok) {
        setError(parsed.message)
        return
      }
      setSuccess(parsed.data)
      onAnalysisSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
    } finally {
      analyzeInFlightRef.current = false
      setLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void handleAnalyze()
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          AI 品牌分析
        </CardTitle>
        <CardDescription>
          基于当前填写信息调用工作流分析；需登录，结果仅供内部参考。
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ba-brandName">品牌名称</Label>
              <Input
                id="ba-brandName"
                name="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                maxLength={100}
                autoComplete="organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ba-industry">行业</Label>
              <Input
                id="ba-industry"
                name="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                maxLength={100}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ba-audience">目标受众（可选）</Label>
            <Input
              id="ba-audience"
              name="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ba-desc">品牌描述（可选）</Label>
            <Textarea
              id="ba-desc"
              name="brandDescription"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              maxLength={2000}
              rows={4}
              className="resize-y min-h-[96px]"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription className="flex flex-col gap-2">
                <span>{error}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit shrink-0"
                  disabled={loading}
                  onClick={() => {
                    void handleAnalyze()
                  }}
                >
                  重试
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 border-t-0 sm:flex-row sm:justify-between">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                分析中…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden />
                开始分析
              </>
            )}
          </Button>
          {success ? (
            <p className="text-xs text-muted-foreground self-center">
              tokens: {success.tokensUsed} · {success.createdAt}
            </p>
          ) : null}
        </CardFooter>
      </form>

      {loading ? (
        <CardContent className="pt-0">
          <p className="text-sm font-medium mb-3">分析结果</p>
          <div className="space-y-4" aria-busy="true" aria-live="polite">
            <Skeleton className="h-8 w-3/4 max-w-md" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      ) : null}
      {!loading && success ? (
        <CardContent className="pt-0">
          <p className="text-sm font-medium mb-3">分析结果</p>
          <BrandAnalysisResultCard result={success.result} />
        </CardContent>
      ) : null}
    </Card>
  )
}
