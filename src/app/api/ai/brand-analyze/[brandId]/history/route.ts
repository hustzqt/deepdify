// GET /api/ai/brand-analyze/[brandId]/history — analysis history for a brand owned by the session user.

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  brandAnalysisHistoryQuerySchema,
  getBrandAnalysisHistoryForUser,
} from '@/lib/brand-analysis-history'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { brandId: string }
}

/**
 * Returns recent persisted analysis results for the given brand (newest first).
 */
export async function GET(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  const { brandId } = context.params
  if (!brandId) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing brand id' },
      },
      { status: 400 }
    )
  }

  const { searchParams } = new URL(request.url)
  const parsed = brandAnalysisHistoryQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries())
  )
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

  const { limit } = parsed.data
  const userId = session.user.id

  const items = await getBrandAnalysisHistoryForUser(userId, brandId, limit)
  if (items === null) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Brand not found' } },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { items },
  })
}
