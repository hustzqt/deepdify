/**
 * NextAuth v5 (Auth.js) — server entry for session and auth routes.
 *
 * Exports (do not use legacy `getServerSession`):
 * - `auth` — `await auth()` in Server Components / Route Handlers / server actions
 * - `handlers` — pass `GET`/`POST` to `app/api/auth/[...nextauth]/route.ts`
 * - `signIn` / `signOut`
 *
 * Credentials + JWT: we omit `PrismaAdapter` for sessions (JWT-only); user rows stay in Prisma.
 * Password hashing uses `bcrypt` (package `bcrypt`, not `bcryptjs`).
 */
import type { NextAuthConfig, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { prisma } from "./prisma"
import { loginSchema } from "./validations/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "ADMIN" | "SELLER" | "VIEWER"
    }
  }
  interface User {
    role: "ADMIN" | "SELLER" | "VIEWER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "ADMIN" | "SELLER" | "VIEWER"
  }
}

const authConfig: NextAuthConfig = {
  // ✅ 关键修复 1：开发环境必须信任主机
  trustHost: true,
  
  // ✅ 关键修复 2：设置 secret（用于加密 cookie）
  // Prefer AUTH_SECRET (Auth.js); accept NEXTAUTH_SECRET for legacy .env compatibility.
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "your-development-secret-key-min-32-chars-long",
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: { 
    signIn: "/login", 
    signOut: "/login", 
    error: "/login" 
  },
  
  // Cookie: on HTTP (e.g. localhost) secure:true prevents the browser from sending cookies.
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // Dev (HTTP): false — required for session cookie to work. Prod (HTTPS): true.
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) throw new Error("邮箱或密码格式错误")
          
          const { email, password } = parsed.data
          const user = await prisma.user.findUnique({ where: { email } })
          
          if (!user || !user.password) throw new Error("用户不存在")
          if (!(await compare(password, user.password))) throw new Error("密码错误")
          if (user.deletedAt) throw new Error("账号已被禁用")
          
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
          } as User
        } catch (error) {
          console.error("[AUTH_ERROR]", error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) { 
        token.id = user.id; 
        token.role = user.role 
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "SELLER" | "VIEWER"
      }
      return session
    }
  },
  
  // 调试日志（开发环境 helpful）
  debug: process.env.NODE_ENV === "development",
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)