// GET /api/ai/usage — paginated AiUsageLog rows for the signed-in user.

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * Returns current user's AI usage logs (newest first).
 */
export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const raw = Object.fromEntries(searchParams.entries())
  const parsed = querySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query',
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const { page, limit } = parsed.data
  const skip = (page - 1) * limit

  const where = { userId: session.user.id }

  const [items, total] = await Promise.all([
    prisma.aiUsageLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        brand: { select: { id: true, name: true } },
      },
    }),
    prisma.aiUsageLog.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0,
      },
    },
  })
}
