import { describe, expect, it } from 'vitest'
import { buildLast7DayCallCounts } from '@/lib/ai/usage-dashboard-helpers'

describe('buildLast7DayCallCounts', () => {
  it('returns 7 rows with zero counts when items empty', () => {
    const rows = buildLast7DayCallCounts([])
    expect(rows).toHaveLength(7)
    expect(rows.every((r) => r.count === 0)).toBe(true)
  })

  it('counts items on the same calendar day in local timezone', () => {
    const base = new Date()
    base.setHours(12, 0, 0, 0)
    const sameDay = new Date(base)
    const rows = buildLast7DayCallCounts([
      { createdAt: sameDay.toISOString() },
      { createdAt: sameDay.toISOString() },
    ])
    const todayRow = rows.find((r) => r.dateKey === formatLocalYmd(base))
    expect(todayRow?.count).toBe(2)
  })
})

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
