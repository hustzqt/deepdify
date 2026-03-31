// Ref: .cursor/rules/global.mdc
// Ref: .cursor/rules/architecture.mdc

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ZodError, z } from 'zod'

/** Force dynamic handling so the route can read request cookies on each request. */
export const dynamic = 'force-dynamic'

/**
 * Resolve session cookie: `src/lib/auth.ts` sets `next-auth.session-token`; Auth.js may use `authjs.session-token`.
 */
function getSessionCookie(): ReturnType<ReturnType<typeof cookies>['get']> {
  const store = cookies()
  return (
    store.get('next-auth.session-token') ?? store.get('authjs.session-token')
  )
}

const createBrandSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional().default(''),
  tone: z.string().optional().default('professional'),
  description: z.string().optional().default(''),
  keywords: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      }
      return val
    })
    .default([]),
})

export async function GET(): Promise<NextResponse> {
  try {
    console.log('【API】GET /api/brands 开始')

    const sessionToken = getSessionCookie()
    console.log('【API】Cookie session-token:', sessionToken ? '存在' : '不存在')

    const session = await auth()
    console.log('【API】Session:', session ? '有效' : '无效')
    console.log('【API】Session user id:', session?.user?.id)

    if (!session?.user?.id) {
      console.log('【API】❌ 未授权')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const brands = await prisma.brand.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('【API】GET 错误:', error)
    return NextResponse.json(
      { error: '获取失败', detail: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('【API】POST /api/brands 开始')

    const sessionToken = getSessionCookie()
    console.log('【API】Cookie session-token:', sessionToken ? '存在' : '不存在')

    const session = await auth()
    console.log('【API】Session:', session ? '有效' : '无效')
    console.log('【API】Session user id:', session?.user?.id)

    if (!session?.user?.id) {
      console.log('【API】❌ 未授权')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body: unknown = await request.json()
    console.log('【API】请求体:', body)

    const validatedData = createBrandSchema.parse(body)

    const brand = await prisma.brand.create({
      data: {
        name: validatedData.name,
        industry: validatedData.industry,
        tone: validatedData.tone,
        description: validatedData.description || null,
        keywords: validatedData.keywords,
        userId: session.user.id,
      },
    })
    console.log('【API】创建成功:', brand.id)

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('【API】POST 错误:', error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: '验证失败', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '创建失败', detail: String(error) },
      { status: 500 }
    )
  }
}
