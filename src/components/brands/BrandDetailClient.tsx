'use client'

/**
 * Brand detail interactive sections: AI panel + persisted history (refreshes after analyze).
 */
import { useState, type ReactElement } from 'react'
import { BrandAiAnalyzePanel } from '@/components/brands/BrandAiAnalyzePanel'
import { BrandAnalysisHistory } from '@/components/brands/BrandAnalysisHistory'

export interface BrandDetailClientProps {
  brand: {
    id: string
    name: string
    industry: string
    description: string | null
    targetAudience: string | null
  }
}

export function BrandDetailClient({ brand }: BrandDetailClientProps): ReactElement {
  const [historyRefresh, setHistoryRefresh] = useState(0)

  return (
    <div className="space-y-8">
      <BrandAiAnalyzePanel
        key={brand.id}
        initialBrandId={brand.id}
        initialBrandName={brand.name}
        initialIndustry={brand.industry}
        initialTargetAudience={brand.targetAudience ?? ''}
        initialBrandDescription={brand.description ?? ''}
        onAnalysisSuccess={() => setHistoryRefresh((n) => n + 1)}
      />
      <BrandAnalysisHistory brandId={brand.id} refreshKey={historyRefresh} />
    </div>
  )
}
