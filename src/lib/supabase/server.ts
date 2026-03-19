// src/lib/supabase/server.ts
// 模块: M1_auth
// 功能: 服务端 Supabase 客户端配置（用于 Server Components）

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isConfigured = supabaseUrl && supabaseKey

export function createClient() {
  if (!isConfigured) {
    console.warn('⚠️ Supabase 未配置，使用模拟客户端')
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {}
      },
    },
  })
}