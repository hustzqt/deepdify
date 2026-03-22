'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FORGOT_PASSWORD_COOLDOWN_MS,
  FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY,
  parseForgotPasswordPutResponse,
} from '@/lib/auth/forgot-password-client'

/**
 * Forgot password page: request reset email via PUT /api/auth/reset-password.
 * Shows success/error alerts and enforces a 5-minute client-side cooldown after success or HTTP 429.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: 'success'; text: string } | { type: 'error'; text: string } | null
  >(null)
  /** Timestamp (ms) when cooldown ends; persisted for reload safety */
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  /** Forces re-render every second while cooldown is active */
  const [, setTick] = useState(0)

  const readStoredCooldown = useCallback((): number | null => {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY)
    if (!raw) return null
    const ts = Number.parseInt(raw, 10)
    if (Number.isNaN(ts) || ts <= Date.now()) {
      window.localStorage.removeItem(FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY)
      return null
    }
    return ts
  }, [])

  const startCooldown = useCallback(() => {
    const until = Date.now() + FORGOT_PASSWORD_COOLDOWN_MS
    window.localStorage.setItem(
      FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY,
      String(until)
    )
    setCooldownUntil(until)
  }, [])

  useEffect(() => {
    setCooldownUntil(readStoredCooldown())
  }, [readStoredCooldown])

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return
    const id = window.setInterval(() => {
      setTick((n) => n + 1)
      if (Date.now() >= cooldownUntil) {
        setCooldownUntil(null)
        window.localStorage.removeItem(FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldownUntil])

  const remainingSec =
    cooldownUntil && cooldownUntil > Date.now()
      ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      : 0
  const isCoolingDown = remainingSec > 0

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isCoolingDown) return

    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      let data: unknown
      try {
        data = await res.json()
      } catch {
        setFeedback({
          type: 'error',
          text: '无法解析服务器响应，请稍后重试',
        })
        return
      }

      const parsed = parseForgotPasswordPutResponse(data)

      if (res.status === 429) {
        startCooldown()
        setFeedback({
          type: 'error',
          text:
            parsed.kind === 'error'
              ? parsed.message
              : '请求过于频繁，请稍后再试',
        })
        return
      }

      if (!res.ok || parsed.kind === 'error') {
        setFeedback({
          type: 'error',
          text: parsed.kind === 'error' ? parsed.message : '请求失败',
        })
        return
      }

      startCooldown()
      setFeedback({ type: 'success', text: parsed.message })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '网络错误，请稍后重试'
      setFeedback({ type: 'error', text: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">忘记密码</CardTitle>
          <CardDescription>
            输入您的邮箱，我们将发送重置链接（如该邮箱已注册）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">邮箱</Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={loading || isCoolingDown}
              />
            </div>

            {feedback?.type === 'success' && (
              <div className="text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                {feedback.text}
              </div>
            )}
            {feedback?.type === 'error' && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {feedback.text}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || isCoolingDown}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  发送中...
                </span>
              ) : isCoolingDown ? (
                `请于 ${Math.floor(remainingSec / 60)}:${String(remainingSec % 60).padStart(2, '0')} 后再试`
              ) : (
                '发送重置链接'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                返回登录
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
