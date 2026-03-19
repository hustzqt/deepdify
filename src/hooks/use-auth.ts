// src/hooks/use-auth.ts
// 模块: M1_auth
// 功能: 认证逻辑封装 Hook

import { useEffect } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'

// 检查是否是模拟客户端（Supabase 未配置时）
const isMockClient = () => {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    // 检查当前会话
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
            avatar: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role || 'SELLER',
            createdAt: session.user.created_at,
          })
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Session check error:', error)
        setLoading(false)
      }
    }

    checkSession()

    // 如果是模拟客户端，跳过监听（避免错误）
    if (isMockClient()) {
      console.log('Mock mode: skipping auth state listener')
      return
    }

    // 监听认证状态变化（仅真实 Supabase 环境）
    let subscription: { unsubscribe: () => void } | undefined
    
    try {
      const result = supabase.auth.onAuthStateChange(
        // ✅ 修复: 添加类型注解 (event: AuthChangeEvent, session: Session | null)
        async (event: AuthChangeEvent, session: Session | null) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!,
              avatar: session.user.user_metadata?.avatar_url,
              role: session.user.user_metadata?.role || 'SELLER',
              createdAt: session.user.created_at,
            })
          } else if (event === 'SIGNED_OUT') {
            logout()
          }
        }
      )
      
      // 安全提取 subscription
      if (result && typeof result === 'object') {
        subscription = result.data?.subscription || result.subscription
      }
      
    } catch (error) {
      console.error('Auth state change error:', error)
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [supabase, setUser, setLoading, logout])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      logout()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  }
}