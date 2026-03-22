/** @vitest-environment node */
import { compare } from 'bcrypt'
import type { User } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  generatePasswordResetToken,
  resetPasswordWithToken,
  sendPasswordResetEmail,
  verifyPasswordResetToken,
} from '@/lib/email/reset-password'
import { prisma } from '@/lib/prisma'

/** Last token written by mocked `user.update` during generate flow (for verify mock). */
let lastStoredResetToken: string | undefined

function mockUser(overrides: Partial<User>): User {
  return {
    id: 'id',
    email: 'e@e.com',
    name: null,
    password: 'p',
    role: 'USER',
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordResetCreated: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  }
}

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe('reset-password email helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    lastStoredResetToken = undefined
    process.env.AUTH_SECRET = 'unit-test-auth-secret-min-32-chars!!'

    vi.mocked(prisma.user.update).mockImplementation(
      (async (args) => {
        const data = args.data as {
          passwordResetToken?: string | null
          password?: string
        }
        if (typeof data.passwordResetToken === 'string') {
          lastStoredResetToken = data.passwordResetToken
        }
        return mockUser({
          id: 'user-1',
          email: 'a@b.com',
        })
      }) as typeof prisma.user.update
    )

    vi.mocked(prisma.user.findFirst).mockImplementation(
      (async (args) => {
        if (!args) {
          return null
        }
        const where = args.where as {
          id: string
          passwordResetToken: string
        }
        if (
          where.id === 'user-1' &&
          where.passwordResetToken === lastStoredResetToken
        ) {
          return mockUser({
            id: 'user-1',
            email: 'a@b.com',
          })
        }
        if (
          where.id === 'uid-99' &&
          where.passwordResetToken === lastStoredResetToken
        ) {
          return mockUser({
            id: 'uid-99',
            email: 'z@z.com',
            name: 'Z',
            password: 'x',
            role: 'SELLER',
          })
        }
        return null
      }) as typeof prisma.user.findFirst
    )
  })

  it('generates a composite token that verifies with purpose', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(
      mockUser({
        id: 'user-1',
        email: 'a@b.com',
      }) as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>
    )

    const token = await generatePasswordResetToken('a@b.com')
    if (!token) throw new Error('Token is null')

    const payload = await verifyPasswordResetToken(token)
    expect(payload.userId).toBe('user-1')
    expect(payload.email).toBe('a@b.com')
  })

  it('sendPasswordResetEmail logs to console (mock)', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    sendPasswordResetEmail('u@x.com', 'https://app/reset?token=t')
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('[MOCK EMAIL] Password Reset')
    )
    expect(log).toHaveBeenCalledWith('To: u@x.com')
    expect(log).toHaveBeenCalledWith('Link: https://app/reset?token=t')
    log.mockRestore()
  })

  it('resetPasswordWithToken updates hashed password', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(
      mockUser({
        id: 'uid-99',
        email: 'z@z.com',
        name: 'Z',
        password: 'x',
        role: 'SELLER',
      }) as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>
    )

    const token = await generatePasswordResetToken('z@z.com')
    if (!token) throw new Error('Token is null')

    await resetPasswordWithToken(token, 'newpass99')

    expect(prisma.user.update).toHaveBeenCalled()
    const calls = vi.mocked(prisma.user.update).mock.calls
    const resetCall = calls.find((c) => {
      const data = c[0]?.data as { password?: string } | undefined
      return typeof data?.password === 'string'
    })?.[0]
    expect(resetCall?.where).toEqual({ id: 'uid-99' })
    const hashed = resetCall?.data?.password
    expect(typeof hashed).toBe('string')
    expect(await compare('newpass99', hashed as string)).toBe(true)
  })
})
