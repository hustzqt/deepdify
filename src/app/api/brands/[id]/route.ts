import { NextRequest, NextResponse } from 'next/server'
import type { Brand } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ZodError, z } from 'zod'

const brandUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  industry: z.string().min(1).optional(),
  tone: z
    .enum(['professional', 'friendly', 'luxury', 'playful', 'technical'])
    .optional(),
  targetAudience: z.string().max(200).optional().nullable(),
  colorPrimary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  colorSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  keywords: z.array(z.string()).max(10).optional(),
})

/**
 * Ensures the brand exists and belongs to the given user.
 */
async function verifyBrandOwnership(
  brandId: string,
  userId: string
): Promise<Brand | null> {
  return prisma.brand.findFirst({
    where: { id: brandId, userId },
  })
}

/**
 * GET /api/brands/[id] — fetch one brand owned by the current user.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brand = await verifyBrandOwnership(params.id, session.user.id)
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('GET /api/brands/[id] failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/brands/[id] — update a brand owned by the current user.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await verifyBrandOwnership(params.id, session.user.id)
  if (!existing) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  try {
    const body: unknown = await req.json()
    const validated = brandUpdateSchema.parse(body)

    if (Object.keys(validated).length === 0) {
      return NextResponse.json(existing)
    }

    const updated = await prisma.brand.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('PUT /api/brands/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}

/**
 * DELETE /api/brands/[id] — delete a brand owned by the current user.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await verifyBrandOwnership(params.id, session.user.id)
    if (!existing) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    await prisma.brand.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/brands/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}
