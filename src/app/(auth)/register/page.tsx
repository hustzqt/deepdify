'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>注册账号</CardTitle>
        <CardDescription>创建您的 Deepdify 账号</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>姓名</Label>
          <Input id='name' type='text' placeholder='您的姓名' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>邮箱</Label>
          <Input id='email' type='email' placeholder='your@email.com' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>密码</Label>
          <Input id='password' type='password' placeholder='设置密码' />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button className='w-full' onClick={() => alert('注册功能开发中...')}>
          注册
        </Button>
        <p className='text-sm text-slate-600 text-center'>
          已有账号?{' '}
          <Link href='/login' className='text-blue-600 hover:underline'>
            立即登录
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
