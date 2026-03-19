// src/lib/supabase/server.ts
// 模块: M1_auth
// 功能: 服务端 Supabase 客户端配置（用于 Server Components）

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_CONFIG } from '@/lib/constants'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    SUPABASE_CONFIG.url!,
    SUPABASE_CONFIG.anonKey!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在 Server Component 中调用时可能会失败
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在 Server Component 中调用时可能会失败
          }
        },
      },
    }
  )
}