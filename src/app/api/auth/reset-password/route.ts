import { NextRequest, NextResponse } from 'next/server'
import { 
  resetPasswordWithToken, 
  generatePasswordResetToken,
  sendPasswordResetEmail 
} from '@/lib/email/reset-password'
import { resetPasswordBodySchema } from '@/lib/validations/auth'

// POST: 执行密码重置（使用 token 设置新密码）
export async function POST(request: NextRequest) {
  try {
    const json: unknown = await request.json()
    const parsed = resetPasswordBodySchema.safeParse(json)
    
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '输入数据格式错误',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data
    
    // 注意：token 现在是 compositeToken (userId:randomString)
    await resetPasswordWithToken(token, password)

    return NextResponse.json({
      success: true,
      message: '密码已重置，请使用新密码登录',
    })
  } catch (error) {
    console.error('[POST /api/auth/reset-password]', error)
    const message =
      error instanceof Error ? error.message : '密码重置失败'
    return NextResponse.json(
      {
        success: false,
        error: { code: 'RESET_FAILED', message },
      },
      { status: 400 }
    )
  }
}

// PUT: 请求发送重置邮件（新增）
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_EMAIL', message: '邮箱格式错误' } },
        { status: 400 }
      )
    }

    const compositeToken = await generatePasswordResetToken(email)
    
    // 即使 token 为 null（用户不存在），也返回成功（防止枚举攻击）
    if (compositeToken) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${compositeToken}`
      sendPasswordResetEmail(email, resetLink)
      console.log(`\n✅ [PASSWORD RESET] Link generated for ${email}:`)
      console.log(`${resetLink}\n`)
    }

    // 统一成功消息（不暴露用户是否存在）
    return NextResponse.json({
      success: true,
      message: '如果该邮箱存在，我们已发送重置链接，请检查邮件或控制台输出',
    })
  } catch (error: any) {
    if (error.message === 'TOO_FREQUENT') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TOO_FREQUENT', 
            message: '请求过于频繁，请5分钟后再试' 
          } 
        },
        { status: 429 }
      )
    }
    
    console.error('[PUT /api/auth/reset-password]', error)
    return NextResponse.json(
      { success: false, error: { code: 'REQUEST_FAILED', message: '请求失败' } },
      { status: 500 }
    )
  }
}