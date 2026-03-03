import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths, addMonths } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCheckIn } from "@/contexts/CheckInContext"
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react"

export function CheckInCard() {
  const { isCheckedInToday, stats, checkIn, checkInRecords } = useCheckIn()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [duration, setDuration] = useState(1)

  const handleCheckIn = () => {
    checkIn(duration)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay()

  const checkedDates = new Set(checkInRecords.map(r => r.date))

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          每日打卡
        </CardTitle>
        <CardDescription>坚持学习，每天进步一点点</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Check-in Button */}
        <div className="flex flex-col items-center gap-4 p-4 bg-muted/50 rounded-lg">
          {isCheckedInToday ? (
            <div className="flex items-center gap-2 text-green-500">
              <Check className="h-6 w-6" />
              <span className="font-medium">今日已打卡</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">学习时长：</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value={0.5}>0.5 小时</option>
                  <option value={1}>1 小时</option>
                  <option value={1.5}>1.5 小时</option>
                  <option value={2}>2 小时</option>
                  <option value={2.5}>2.5 小时</option>
                  <option value={3}>3 小时</option>
                </select>
              </div>
              <Button onClick={handleCheckIn} className="w-full">
                立即打卡
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-primary">{stats.totalDays}</div>
            <div className="text-xs text-muted-foreground">总打卡天数</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-green-500">{stats.consecutiveDays}</div>
            <div className="text-xs text-muted-foreground">连续打卡</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold text-blue-500">{stats.totalHours}</div>
            <div className="text-xs text-muted-foreground">累计学习(小时)</div>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(currentMonth, "yyyy年MM月", { locale: zhCN })}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd")
              const isChecked = checkedDates.has(dateStr)
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={dateStr}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-full
                    ${!isSameMonth(day, currentMonth) ? "text-muted-foreground/30" : ""}
                    ${isCurrentDay ? "ring-2 ring-primary ring-offset-1" : ""}
                    ${isChecked ? "bg-green-500 text-white" : ""}
                    ${!isChecked && isSameMonth(day, currentMonth) ? "hover:bg-muted" : ""}
                  `}
                >
                  {format(day, "d")}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
