import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ZodError, z } from 'zod'

const brandSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  industry: z.string().min(1),
  tone: z
    .enum(['professional', 'friendly', 'luxury', 'playful', 'technical'])
    .default('professional'),
  targetAudience: z.string().max(200).optional(),
  colorPrimary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  colorSecondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  keywords: z.array(z.string()).max(10).optional(),
})

/**
 * GET /api/brands — list brands for the current user.
 */
export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const brands = await prisma.brand.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(brands)
  } catch (error) {
    console.error('GET /api/brands failed:', error)
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

/**
 * POST /api/brands — create a brand for the current user.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body: unknown = await req.json()
    const validated = brandSchema.parse(body)

    const brand = await prisma.brand.create({
      data: {
        name: validated.name,
        description: validated.description,
        industry: validated.industry,
        tone: validated.tone,
        targetAudience: validated.targetAudience,
        colorPrimary: validated.colorPrimary,
        colorSecondary: validated.colorSecondary,
        keywords: validated.keywords ?? [],
        userId: session.user.id,
      },
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('POST /api/brands failed:', error)
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 })
  }
}
