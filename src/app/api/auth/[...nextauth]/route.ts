// src/app/api/auth/[...nextauth]/route.ts
// 模块: M1_auth
// 功能: NextAuth API路由（App Router）

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers