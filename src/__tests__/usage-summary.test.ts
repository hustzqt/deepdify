import { describe, expect, it } from 'vitest'
import {
  defaultTrendDateRange,
  endOfDayUTC,
  startOfDayUTC,
} from '@/lib/ai/usage-summary'

describe('usage-summary date helpers', () => {
  it('parses UTC day bounds', () => {
    const s = startOfDayUTC('2026-04-01')
    const e = endOfDayUTC('2026-04-01')
    expect(s.toISOString()).toBe('2026-04-01T00:00:00.000Z')
    expect(e.toISOString()).toBe('2026-04-01T23:59:59.999Z')
  })

  it('defaultTrendDateRange spans 30 inclusive calendar days (UTC)', () => {
    const { start, end } = defaultTrendDateRange()
    const ps = start.split('-')
    const pe = end.split('-')
    expect(ps.length).toBe(3)
    expect(pe.length).toBe(3)
    const ys = Number(ps[0])
    const ms = Number(ps[1])
    const ds = Number(ps[2])
    const ye = Number(pe[0])
    const me = Number(pe[1])
    const de = Number(pe[2])
    const d0 = Date.UTC(ys, ms - 1, ds)
    const d1 = Date.UTC(ye, me - 1, de)
    const daysBetween = (d1 - d0) / (24 * 60 * 60 * 1000)
    expect(daysBetween).toBe(29)
  })
})
