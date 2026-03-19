// src/hooks/use-auth.ts
// 模块: M1_auth
// 功能: 认证逻辑封装 Hook

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'

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

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setLoading, logout])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
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