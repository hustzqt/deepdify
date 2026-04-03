import { randomUUID } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BRAND_ANALYZE_RATE_LIMIT,
  checkBrandAnalyzeRateLimit,
} from '@/lib/redis-rate-limit'

describe('checkBrandAnalyzeRateLimit (memory fallback)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('blocks after BRAND_ANALYZE_RATE_LIMIT successes when no Redis env', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubEnv('REDIS_URL', '')

    const userId = `u-${randomUUID()}`
    for (let i = 0; i < BRAND_ANALYZE_RATE_LIMIT; i++) {
      const r = await checkBrandAnalyzeRateLimit(userId)
      expect(r.success).toBe(true)
      expect(r.backend).toBe('memory')
    }
    const denied = await checkBrandAnalyzeRateLimit(userId)
    expect(denied.success).toBe(false)
    expect(denied.backend).toBe('memory')
  })
})
