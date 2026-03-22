'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    console.log('[LOGIN] 表单提交开始', { email })
    
    setLoading(true)
    setError('')

    try {
      console.log('[LOGIN] 正在获取 CSRF Token...')
      const csrfRes = await fetch('/api/auth/csrf', {
        credentials: 'include'
      })
      
      if (!csrfRes.ok) {
        console.error('[LOGIN] CSRF 获取失败:', csrfRes.status)
        throw new Error('获取安全令牌失败，请刷新页面重试')
      }
      
      const { csrfToken } = await csrfRes.json()
      console.log('[LOGIN] CSRF Token 获取成功')

      const formData = new URLSearchParams()
      formData.append('csrfToken', csrfToken)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('callbackUrl', '/dashboard')
      formData.append('json', 'true')

      console.log('[LOGIN] 正在发送登录请求...')
      const callbackRes = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
        redirect: 'manual'
      })

      console.log('[LOGIN] 收到响应状态:', callbackRes.status, callbackRes.type)

      // ✅ 关键修复：处理 status 0（opaque-redirect）或 302/307 都表示成功
      const isSuccess = callbackRes.status === 0 || callbackRes.status === 302 || callbackRes.status === 307
      
      if (isSuccess) {
        console.log('[LOGIN] 登录成功，准备跳转...')
        window.location.href = '/dashboard'
        return
      }

      let data: any = null
      try {
        data = await callbackRes.json()
        console.log('[LOGIN] 响应数据:', data)
      } catch (parseError) {
        console.log('[LOGIN] 响应不是 JSON 格式')
      }

      if (data?.error) {
        const errorMsg = data.error === 'CredentialsSignin' 
          ? '邮箱或密码错误' 
          : data.error
        throw new Error(errorMsg)
      }

      if (callbackRes.status >= 400) {
        throw new Error(`登录失败 (HTTP ${callbackRes.status})`)
      }

      console.log('[LOGIN] 兜底跳转处理')
      window.location.href = '/dashboard'
      
    } catch (err: any) {
      console.error('[LOGIN_ERROR]', err)
      setError(err.message || '登录异常，请重试')
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Deepdify Studio</CardTitle>
          <CardDescription>AI驱动的跨境电商工作台</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>邮箱</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your@email.com'
                required
                disabled={loading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>密码</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='输入密码'
                required
                disabled={loading}
              />
            </div>
            
            {/* ✅ 错误显示优化：确保错误可见 */}
            {error && (
              <div className='text-sm text-red-500 bg-red-50 p-3 rounded border border-red-200'>
                ⚠️ {error}
              </div>
            )}
            
            <Button 
              type='submit' 
              className='w-full' 
              disabled={loading}
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  登录中...
                </span>
              ) : '登录'}
            </Button>
          </form>
          
          <div className='mt-4 text-center text-sm text-gray-600'>
            还没有账号?{' '}
            <Link href='/register' className='text-blue-600 hover:underline font-medium'>
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}