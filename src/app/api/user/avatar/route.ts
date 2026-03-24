import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 确保上传目录存在
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars')

// 支持的文件类型和大小限制
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * POST /api/user/avatar
 * 上传用户头像
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: '未认证' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '仅支持 JPEG、PNG、WebP 格式' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const imageUrl = `/uploads/avatars/${filename}`

    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    })

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: '头像上传成功',
    })
  } catch (error) {
    console.error('头像上传失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
