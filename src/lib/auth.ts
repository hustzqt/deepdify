import type { NextAuthConfig, Session, User } from "next-auth"
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
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) throw new Error("邮箱或密码格式错误")
        
        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        
        if (!user || !user.password) throw new Error("用户不存在")
        if (!(await compare(password, user.password))) throw new Error("密码错误")
        if (user.deletedAt) throw new Error("账号已被禁用")
        
        return { id: user.id, email: user.email, name: user.name, role: user.role } as User
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "SELLER" | "VIEWER"
      }
      return session
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)