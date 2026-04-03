/**
 * Builds per-day call counts for the last 7 calendar days (local timezone),
 * using only the provided log rows (typically one API page).
 */
export function buildLast7DayCallCounts(
  items: ReadonlyArray<{ createdAt: string | Date }>
): { dateKey: string; label: string; count: number }[] {
  const today = new Date()
  const keys: string[] = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    keys.push(`${y}-${m}-${day}`)
  }

  const counts = new Map<string, number>()
  for (const k of keys) {
    counts.set(k, 0)
  }
  for (const row of items) {
    const d = new Date(row.createdAt)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return keys.map((dateKey) => ({
    dateKey,
    label: dateKey.slice(5).replace('-', '/'),
    count: counts.get(dateKey) ?? 0,
  }))
}
