'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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

/**
 * Password reset form: reads `token` from query, posts to API.
 */
function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get('token') ?? ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) {
      setError('两次输入的密码不一致')
      return
    }
    if (!token.trim()) {
      setError('缺少重置令牌，请从邮件链接打开或粘贴完整链接')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), password }),
      })
      const data: unknown = await res.json().catch(() => null)
      const parsed =
        data &&
        typeof data === 'object' &&
        'success' in data &&
        typeof (data as { success?: unknown }).success === 'boolean'
          ? (data as { success: boolean; message?: string; error?: { message?: string } })
          : null

      if (!res.ok || !parsed?.success) {
        const msg =
          parsed?.error?.message ??
          (typeof parsed?.message === 'string' ? parsed.message : null) ??
          '重置失败，请重试'
        throw new Error(msg)
      }
      setSuccess(parsed.message ?? '密码已重置')
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置异常')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">重置密码</CardTitle>
        <CardDescription>输入邮件中的令牌或从链接进入</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">重置令牌</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="JWT 或从邮件链接自动带入"
              autoComplete="off"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">新密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">确认新密码</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再次输入"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '提交中…' : '确认重置'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            返回登录
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            加载中…
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
