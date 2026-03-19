// src/lib/validations/auth.ts
// 模块: M1_auth
// 功能: 认证相关 Zod 验证 Schema

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
})

export const registerSchema = z.object({
  name: z.string().min(2, '姓名至少2位'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
