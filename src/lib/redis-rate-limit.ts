import { randomUUID } from 'node:crypto'
import { Redis as UpstashRedis } from '@upstash/redis'
import IORedis from 'ioredis'

/** Matches previous in-app limit: 10 requests per rolling hour (sliding window in Redis). */
export const BRAND_ANALYZE_RATE_LIMIT = 10
export const BRAND_ANALYZE_RATE_WINDOW_MS = 60 * 60 * 1000

const KEY_PREFIX = 'rl:brand-analyze:'

/**
 * Atomic sliding window: ZSET score = request time (ms), member = unique id.
 * Returns [allowed (1|0), countAfterOrCurrent, oldestScoreOrZero].
 */
const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local minScore = now - windowMs

redis.call('ZREMRANGEBYSCORE', key, '-inf', minScore)
local count = redis.call('ZCARD', key)
if count < limit then
  redis.call('ZADD', key, now, member)
  redis.call('PEXPIRE', key, windowMs + 60000)
  return {1, count + 1, 0}
end
local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
local oldestScore = 0
if oldest[2] ~= nil then
  oldestScore = tonumber(oldest[2])
end
return {0, count, oldestScore}
`

export type BrandAnalyzeRateLimitResult = {
  success: boolean
  remaining: number
  resetAt: Date
  /** Where the decision came from (observability). */
  backend: 'upstash' | 'ioredis' | 'memory'
}

type LuaTriple = [unknown, unknown, unknown]

function parseLuaTriple(raw: unknown): LuaTriple {
  if (!Array.isArray(raw) || raw.length < 3) {
    throw new Error('Invalid Lua eval result')
  }
  return [raw[0], raw[1], raw[2]]
}

function toNum(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return Number(v)
  return Number(v)
}

const globalIoRedis = globalThis as unknown as {
  __deepdifyIoRedis?: IORedis
}

function getIoRedis(): IORedis {
  const url = process.env.REDIS_URL
  if (!url) {
    throw new Error('REDIS_URL is not set')
  }
  if (!globalIoRedis.__deepdifyIoRedis) {
    globalIoRedis.__deepdifyIoRedis = new IORedis(url, {
      maxRetriesPerRequest: 2,
      lazyConnect: false,
    })
  }
  return globalIoRedis.__deepdifyIoRedis
}

const globalUpstash = globalThis as unknown as {
  __deepdifyUpstash?: UpstashRedis
}

function getUpstashRedis(): UpstashRedis {
  if (!globalUpstash.__deepdifyUpstash) {
    globalUpstash.__deepdifyUpstash = UpstashRedis.fromEnv()
  }
  return globalUpstash.__deepdifyUpstash
}

function detectRedisBackend(): 'upstash' | 'ioredis' | null {
  const hasUpstash =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN)
  if (hasUpstash) return 'upstash'
  if (process.env.REDIS_URL) return 'ioredis'
  return null
}

/** In-memory fallback (fixed window reset), same behavior as pre-Redis Map. */
const memoryBuckets = new Map<string, { count: number; resetAt: number }>()

function checkMemoryRateLimit(userId: string): BrandAnalyzeRateLimitResult {
  const now = Date.now()
  let entry = memoryBuckets.get(userId)
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + BRAND_ANALYZE_RATE_WINDOW_MS }
    memoryBuckets.set(userId, entry)
  }
  if (entry.count >= BRAND_ANALYZE_RATE_LIMIT) {
    return {
      success: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt),
      backend: 'memory',
    }
  }
  entry.count += 1
  return {
    success: true,
    remaining: BRAND_ANALYZE_RATE_LIMIT - entry.count,
    resetAt: new Date(entry.resetAt),
    backend: 'memory',
  }
}

async function checkRedisSlidingWindow(
  backend: 'upstash' | 'ioredis',
  userId: string
): Promise<BrandAnalyzeRateLimitResult> {
  const key = `${KEY_PREFIX}${userId}`
  const now = Date.now()
  const windowMs = BRAND_ANALYZE_RATE_WINDOW_MS
  const limit = BRAND_ANALYZE_RATE_LIMIT
  const member = `${now}:${randomUUID()}`

  let raw: unknown
  if (backend === 'upstash') {
    const redis = getUpstashRedis()
    raw = await redis.eval(SLIDING_WINDOW_LUA, [key], [
      String(now),
      String(windowMs),
      String(limit),
      member,
    ])
  } else {
    const redis = getIoRedis()
    raw = await redis.eval(
      SLIDING_WINDOW_LUA,
      1,
      key,
      String(now),
      String(windowMs),
      String(limit),
      member
    )
  }

  const [a, b, c] = parseLuaTriple(raw)
  const allowed = toNum(a) === 1
  const countAfter = toNum(b)
  const oldestScore = toNum(c)

  if (allowed) {
    return {
      success: true,
      remaining: Math.max(0, limit - countAfter),
      resetAt: new Date(now + windowMs),
      backend,
    }
  }

  const resetMs = oldestScore > 0 ? oldestScore + windowMs : now + windowMs
  return {
    success: false,
    remaining: 0,
    resetAt: new Date(resetMs),
    backend,
  }
}

/**
 * Enforces brand-analyze rate limit: Upstash REST, or TCP Redis (ioredis), or in-memory fallback.
 */
export async function checkBrandAnalyzeRateLimit(
  userId: string
): Promise<BrandAnalyzeRateLimitResult> {
  const backend = detectRedisBackend()
  if (!backend) {
    return checkMemoryRateLimit(userId)
  }
  try {
    return await checkRedisSlidingWindow(backend, userId)
  } catch (err) {
    console.error('[rate-limit] Redis error, using in-memory fallback:', err)
    return checkMemoryRateLimit(userId)
  }
}
