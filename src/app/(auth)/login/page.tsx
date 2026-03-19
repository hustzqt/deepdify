'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema as any),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error?.message || '登录失败')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('登录过程中发生错误，请重试')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className='w-full max-w-md'>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Deepdify Studio</CardTitle>
          <CardDescription className="text-center">AI驱动的跨境电商工作台</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {error && (
              <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200'>
                {error}
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email'>邮箱</Label>
              <Input 
                id='email' 
                type='email' 
                placeholder='your@email.com'
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>密码</Label>
              <Input 
                id='password' 
                type='password' 
                placeholder='输入密码'
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className='text-sm text-red-500'>{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
            <p className='text-sm text-slate-600 text-center'>
              还没有账号?{' '}
              <Link href='/register' className='text-blue-600 hover:underline'>
                立即注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}