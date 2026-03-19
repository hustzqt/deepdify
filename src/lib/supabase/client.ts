// src/lib/supabase/client.ts
// 模块: M1_auth
// 功能: 浏览器端 Supabase 客户端配置

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIG } from '@/lib/constants'

export function createClient() {
  return createBrowserClient(
    SUPABASE_CONFIG.url!,
    SUPABASE_CONFIG.anonKey!
  )
}