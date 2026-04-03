// GET /api/brands/[id]/analysis-history — alias of /api/ai/brand-analyze/[brandId]/history (DEV_PLAN path).

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  brandAnalysisHistoryQuerySchema,
  getBrandAnalysisHistoryForUser,
} from '@/lib/brand-analysis-history'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { id: string }
}

/**
 * Same payload as GET /api/ai/brand-analyze/[brandId]/history; kept for DEV_PLAN URL compatibility.
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

  const brandId = context.params.id
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

  const items = await getBrandAnalysisHistoryForUser(
    session.user.id,
    brandId,
    parsed.data.limit
  )
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
