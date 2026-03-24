// src/lib/supabase/client.ts
// 模块: M1_auth
// 功能: 浏览器端 Supabase 客户端配置

import { createBrowserClient } from '@supabase/ssr'

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 检查是否已配置
const isConfigured = supabaseUrl && supabaseKey

export function createClient() {
  if (!isConfigured) {
    console.warn('⚠️ Supabase 未配置，使用模拟客户端')
    // 返回模拟客户端（开发模式）
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ error: new Error('Supabase 未配置') }),
        signUp: async () => ({ error: new Error('Supabase 未配置') }),
        signOut: async () => {},
        onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
      },
    } as unknown as SupabaseBrowserClient
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!)
}