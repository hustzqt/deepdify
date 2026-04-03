import { describe, expect, it } from 'vitest'
import { extractDifyUsageMetrics } from '@/lib/ai/extract-dify-usage'

describe('extractDifyUsageMetrics', () => {
  it('returns zeros for non-object', () => {
    expect(extractDifyUsageMetrics(null)).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      costUsd: null,
    })
  })

  it('reads data.usage from Dify-like payload', () => {
    const json = {
      data: {
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
          total_price: 0.001,
        },
      },
    }
    expect(extractDifyUsageMetrics(json)).toEqual({
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
      costUsd: 0.001,
    })
  })
})
