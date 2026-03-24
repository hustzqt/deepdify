'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RegisterApiError, registerUser } from '@/lib/api/auth'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

/**
 * Registration form with Zod + React Hook Form and TanStack Query mutation.
 * Submits via POST fetch to `/api/auth/register` (JSON body); `method="post"` on the form avoids accidental GET navigation.
 */
export function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message || '注册成功，请登录')
      router.push('/login')
    },
    onError: (error: unknown) => {
      if (error instanceof RegisterApiError) {
        toast.error(error.message)
        return
      }
      const message =
        error instanceof Error ? error.message : '注册失败，请重试'
      toast.error(message)
    },
  })

  return (
    <form
      method="post"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">姓名</Label>
        <Input
          id="name"
          type="text"
          placeholder="您的姓名"
          autoComplete="name"
          disabled={mutation.isPending}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          disabled={mutation.isPending}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          type="password"
          placeholder="设置密码（至少6位）"
          autoComplete="new-password"
          disabled={mutation.isPending}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? '注册中...' : '注册'}
      </Button>
      <p className="text-center text-sm text-slate-600">
        已有账号?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          立即登录
        </Link>
      </p>
    </form>
  )
}
