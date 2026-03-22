import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 从 cookie 中获取 session token
  const sessionToken = request.cookies.get("next-auth.session-token")?.value
  
  const isLoggedIn = !!sessionToken
  const { pathname } = request.nextUrl

  // 未登录用户访问 dashboard 重定向到 login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
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
  matcher: ["/dashboard/:path*", "/login"]
}
