import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 从 cookie 中获取 session token
  const sessionToken = request.cookies.get("next-auth.session-token")?.value
  
  const isLoggedIn = !!sessionToken
  const { pathname } = request.nextUrl

  // 未登录用户访问受保护区域重定向到 login（含 /profile，与 (dashboard) 分组路由）
  if (
    (pathname.startsWith("/dashboard") || pathname === "/profile") &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 已登录用户访问 login 重定向到 dashboard
  if (pathname === "/login" && isLoggedIn) {
    const dashboardUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/login"],
}
