// src/middleware.ts
// 模块: M1_auth
// 功能: 路由守卫 - 保护需要登录的页面

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 检查 Supabase 是否已配置
const isSupabaseConfigured = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 需要保护的路由（登录后才能访问）
const protectedRoutes = ['/dashboard', '/products', '/orders', '/analytics', '/settings', '/ai-tools', '/selection']
// 认证相关路由（已登录用户不应访问）
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  // 如果 Supabase 未配置，暂时跳过认证检查（开发模式）
  if (!isSupabaseConfigured) {
    console.log('⚠️ Supabase 未配置，跳过认证检查（开发模式）')
    return NextResponse.next()
  }

  // Supabase 已配置时，使用正常的认证检查
  const { updateSession } = await import('@/lib/supabase/middleware')
  const { supabase, response } = updateSession(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}