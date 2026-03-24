import { z } from 'zod'

// 手机号验证（中国大陆格式）
const phoneRegex = /^1[3-9]\d{9}$/

// 支持的时区列表
export const SUPPORTED_TIMEZONES = [
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Singapore',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
] as const

// 支持的语言
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja'] as const

// 更新资料请求 Schema
export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(50, '姓名不能超过50字符').optional().nullable(),
  company: z.string().max(100, '公司名称不能超过100字符').optional().nullable(),
  phone: z.string().regex(phoneRegex, '请输入有效的中国大陆手机号码').optional().nullable(),
  timezone: z.enum(SUPPORTED_TIMEZONES).default('Asia/Shanghai'),
  language: z.enum(SUPPORTED_LANGUAGES).default('zh'),
  bio: z.string().max(500, '简介不能超过500字符').optional().nullable(),
})

// API 响应 Schema
export const UserProfileResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  company: z.string().nullable(),
  phone: z.string().nullable(),
  timezone: z.string(),
  language: z.string(),
  bio: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// 类型导出
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>
export type UserProfile = z.infer<typeof UserProfileResponseSchema>
