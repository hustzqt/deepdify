'use client'

/**
 * Client panel: calls POST /api/ai/brand-analyze with session cookie.
 */
import { useEffect, useState } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'

const BRAND_ANALYZE_PATH = '/api/ai/brand-analyze'

export interface BrandAiAnalyzePanelProps {
  /** When set, sent as `brandId` and used to reset controlled fields when key changes upstream. */
  initialBrandId?: string
  initialBrandName?: string
  initialIndustry?: string
  initialTargetAudience?: string
  initialBrandDescription?: string
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
}: BrandAiAnalyzePanelProps) {
  const [brandName, setBrandName] = useState(initialBrandName)
  const [industry, setIndustry] = useState(initialIndustry)
  const [targetAudience, setTargetAudience] = useState(initialTargetAudience)
  const [brandDescription, setBrandDescription] = useState(initialBrandDescription)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SuccessData | null>(null)

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setError(message)
    } finally {
      setLoading(false)
    }
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
              <AlertDescription>{error}</AlertDescription>
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

      {success ? (
        <CardContent className="pt-0">
          <p className="text-sm font-medium mb-2">分析结果</p>
          <ScrollArea className="h-[min(420px,50vh)] rounded-md border bg-muted/30 p-3">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(success.result, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      ) : null}
    </Card>
  )
}
