// src/lib/supabase/server.ts
// 模块: M1_auth
// 功能: 服务端 Supabase 客户端配置（用于 Server Components）

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isConfigured = supabaseUrl && supabaseKey

// 模拟客户端类型定义（替代 any）
interface MockSupabaseClient {
  auth: {
    getSession: () => Promise<{ data: { session: null }; error: null }>
  }
}

/**
 * 创建服务端 Supabase 客户端
 * @注意: Next.js 15+ 中 cookies() 为异步函数，因此此函数必须为 async
 */
export async function createClient(): Promise<ReturnType<typeof createServerClient> | MockSupabaseClient> {
  if (!isConfigured) {
    console.warn('⚠️ Supabase 未配置，使用模拟客户端')
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as MockSupabaseClient
  }

  // ✅ 修复: Next.js 15+ 中 cookies() 返回 Promise，必须 await
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Server Component 中无法设置 cookie 时静默处理
          console.warn(`Cookie set failed for ${name}:`, error)
        }
      },
      remove(name: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          console.warn(`Cookie remove failed for ${name}:`, error)
        }
      },
    },
  })
}