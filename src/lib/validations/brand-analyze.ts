import { z } from 'zod'

/**
 * Request body for POST /api/ai/brand-analyze (aligned with Dify Workflow start inputs).
 */
export const brandAnalyzeRequestSchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().min(1).max(100),
  industry: z.string().min(1).max(100),
  targetAudience: z.string().max(500).optional(),
  brandDescription: z.string().max(2000).optional(),
  analysisType: z.enum(['full', 'positioning', 'visual']).default('full'),
})

export type BrandAnalyzeRequest = z.infer<typeof brandAnalyzeRequestSchema>
