// src/lib/prisma.ts
// 模块: M1_auth（全局通用）
// 功能: Prisma客户端单例 - 符合宪法第四章4.1数据库操作安全

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 开发环境热重载时复用连接，避免耗尽连接池（铁律4：数据库操作安全）
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
