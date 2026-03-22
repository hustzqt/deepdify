// src/lib/email/reset-password.ts
// 数据库版密码重置 - 可撤销、审计、频率限制

import { hash } from 'bcrypt'
import crypto from 'crypto'
import { prisma } from '../prisma'

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000  // 15分钟
const MIN_REQUEST_INTERVAL_MS = 5 * 60 * 1000  // 5分钟防刷

export async function generatePasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ 
    where: { email }
  })
  
  // 安全：不暴露用户是否存在
  if (!user) return null

  // 频率限制
  if (user.passwordResetCreated) {
    const elapsed = Date.now() - new Date(user.passwordResetCreated).getTime()
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      throw new Error('TOO_FREQUENT')
    }
  }

  const tokenString = crypto.randomBytes(32).toString('hex')
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: tokenString,
      passwordResetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      passwordResetCreated: new Date(),
    },
  })

  return `${user.id}:${tokenString}`
}

export async function verifyPasswordResetToken(compositeToken: string) {
  const [userId, token] = compositeToken.split(':')
  if (!userId || !token) throw new Error('INVALID_TOKEN')

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  })

  if (!user) throw new Error('EXPIRED')
  return { userId: user.id, email: user.email }
}

export async function resetPasswordWithToken(compositeToken: string, newPassword: string) {
  const { userId } = await verifyPasswordResetToken(compositeToken)
  const hashed = await hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetCreated: null,
    },
  })
}

export function sendPasswordResetEmail(to: string, link: string): void {
  console.log('\n' + '='.repeat(50))
  console.log('[MOCK EMAIL] Password Reset')
  console.log(`To: ${to}`)
  console.log(`Link: ${link}`)
  console.log('='.repeat(50) + '\n')
}