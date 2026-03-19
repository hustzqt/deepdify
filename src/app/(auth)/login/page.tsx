'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>请输入您的邮箱和密码</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>邮箱</Label>
          <Input id='email' type='email' placeholder='your@email.com' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>密码</Label>
          <Input id='password' type='password' placeholder='输入密码' />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button className='w-full' onClick={() => alert('登录功能开发中...')}>
          登录
        </Button>
        <p className='text-sm text-slate-600 text-center'>
          还没有账号?{' '}
          <Link href='/register' className='text-blue-600 hover:underline'>
            立即注册
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
