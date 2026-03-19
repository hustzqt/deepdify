import { auth } from "@/lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl))
  }
  if (nextUrl.pathname === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
}