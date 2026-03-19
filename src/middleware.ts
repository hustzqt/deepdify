// src/middleware.ts
// 模块: M1_auth
// 功能: 路由守卫 - 保护需要登录的页面

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 需要保护的路由（登录后才能访问）
const protectedRoutes = ['/dashboard', '/products', '/orders', '/analytics', '/settings', '/ai-tools', '/selection']
// 认证相关路由（已登录用户不应访问）
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // 未登录用户访问受保护路由 -> 重定向到登录页
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 已登录用户访问登录/注册页 -> 重定向到仪表盘
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 所有根目录下的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}