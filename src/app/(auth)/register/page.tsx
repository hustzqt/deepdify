'use client'

/**
 * Registration page under (auth) route group — URL remains /register.
 * Uses shared RegisterForm (Zod + RHF + TanStack Query).
 */
import type { ReactElement } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/features/RegisterForm'

export default function RegisterPage(): ReactElement {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">创建账号</CardTitle>
          <CardDescription>加入 Deepdify Studio</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
