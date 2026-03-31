import { describe, expect, it } from 'vitest'
import { brandAnalyzeRequestSchema } from '@/lib/validations/brand-analyze'

describe('brandAnalyzeRequestSchema', () => {
  it('accepts minimal valid payload', () => {
    const r = brandAnalyzeRequestSchema.safeParse({
      brandName: 'Test',
      industry: 'Retail',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.analysisType).toBe('full')
    }
  })

  it('rejects empty brandName', () => {
    const r = brandAnalyzeRequestSchema.safeParse({
      brandName: '',
      industry: 'Retail',
    })
    expect(r.success).toBe(false)
  })

  it('accepts optional fields', () => {
    const r = brandAnalyzeRequestSchema.safeParse({
      brandId: 'clid123',
      brandName: '山海咖啡',
      industry: '精品咖啡零售',
      targetAudience: '白领',
      brandDescription: 'desc',
      analysisType: 'positioning',
    })
    expect(r.success).toBe(true)
  })
})
