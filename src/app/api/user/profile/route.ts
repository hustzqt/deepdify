import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileUpdateSchema, UserProfileResponseSchema } from '@/types/profile'
import { ZodError } from 'zod'

/**
 * GET /api/user/profile
 * 获取当前用户完整资料
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: '未认证' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        company: true,
        phone: true,
        timezone: true,
        language: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const validatedData = UserProfileResponseSchema.parse({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })

    return NextResponse.json(validatedData)
  } catch (error) {
    console.error('获取用户资料失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

/**
 * PUT /api/user/profile
 * 更新用户资料
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: '未认证' }, { status: 401 })
    }

    const body: unknown = await request.json()

    const validatedData = ProfileUpdateSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.company !== undefined && { company: validatedData.company }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
        ...(validatedData.timezone !== undefined && { timezone: validatedData.timezone }),
        ...(validatedData.language !== undefined && { language: validatedData.language }),
        ...(validatedData.bio !== undefined && { bio: validatedData.bio }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        company: true,
        phone: true,
        timezone: true,
        language: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const responseData = UserProfileResponseSchema.parse({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: '输入验证失败', details: error.issues },
        { status: 400 }
      )
    }

    console.error('更新用户资料失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
