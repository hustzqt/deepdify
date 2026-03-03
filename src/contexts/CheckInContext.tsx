import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { format, isToday, parseISO, differenceInCalendarDays, startOfDay } from "date-fns"

interface CheckInRecord {
  date: string // YYYY-MM-DD format
  duration: number // hours
  checkedInAt: string // ISO timestamp
}

interface CheckInStats {
  totalDays: number
  consecutiveDays: number
  totalHours: number
}

interface CheckInContextType {
  checkInRecords: CheckInRecord[]
  isCheckedInToday: boolean
  stats: CheckInStats
  checkIn: (duration: number) => void
  refreshCheckInData: () => void
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined)

const CHECK_IN_STORAGE_PREFIX = "deepdify_checkins_"

function getStorageKey(userId: string): string {
  return `${CHECK_IN_STORAGE_PREFIX}${userId}`
}

function calculateStats(records: CheckInRecord[]): CheckInStats {
  if (records.length === 0) {
    return { totalDays: 0, consecutiveDays: 0, totalHours: 0 }
  }

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Total days
  const totalDays = sortedRecords.length

  // Total hours
  const totalHours = records.reduce((sum, r) => sum + r.duration, 0)

  // Consecutive days
  let consecutiveDays = 0
  const today = startOfDay(new Date())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Check if user checked in today or yesterday to start counting
  const hasToday = records.some(r => isToday(parseISO(r.date)))
  const hasYesterday = records.some(r => {
    const date = parseISO(r.date)
    return differenceInCalendarDays(yesterday, date) === 0
  })

  if (!hasToday && !hasYesterday) {
    consecutiveDays = 0
  } else {
    // Count consecutive days backwards from today/yesterday
    let currentDate = hasToday ? today : yesterday
    const checkedDates = new Set(records.map(r => r.date))

    while (true) {
      const dateStr = format(currentDate, "yyyy-MM-dd")
      if (checkedDates.has(dateStr)) {
        consecutiveDays++
        currentDate = new Date(currentDate)
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  return { totalDays, consecutiveDays, totalHours }
}

export function CheckInProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])
  const [stats, setStats] = useState<CheckInStats>({ totalDays: 0, consecutiveDays: 0, totalHours: 0 })

  const loadCheckInData = useCallback(() => {
    if (!userId) return

    const storageKey = getStorageKey(userId)
    const stored = localStorage.getItem(storageKey)
    const records: CheckInRecord[] = stored ? JSON.parse(stored) : []
    setCheckInRecords(records)
    setStats(calculateStats(records))
  }, [userId])

  useEffect(() => {
    loadCheckInData()
  }, [loadCheckInData])

  const isCheckedInToday = checkInRecords.some(r => isToday(parseISO(r.date)))

  const checkIn = (duration: number) => {
    if (!userId || isCheckedInToday) return

    const today = format(new Date(), "yyyy-MM-dd")
    const newRecord: CheckInRecord = {
      date: today,
      duration,
      checkedInAt: new Date().toISOString()
    }

    const updatedRecords = [...checkInRecords, newRecord]
    const storageKey = getStorageKey(userId)
    localStorage.setItem(storageKey, JSON.stringify(updatedRecords))

    setCheckInRecords(updatedRecords)
    setStats(calculateStats(updatedRecords))
  }

  const refreshCheckInData = () => {
    loadCheckInData()
  }

  return (
    <CheckInContext.Provider value={{ checkInRecords, isCheckedInToday, stats, checkIn, refreshCheckInData }}>
      {children}
    </CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const context = useContext(CheckInContext)
  if (context === undefined) {
    throw new Error("useCheckIn must be used within a CheckInProvider")
  }
  return context
}
