// src/app/api/auth/register/route.ts
// 模块: M1_auth
// 功能: 用户注册API（自定义CredentialsProvider需要）

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    // 1. 解析并验证输入（Zod，铁律7）
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: '输入数据格式错误',
            details: parsed.error.flatten() 
          } 
        },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // 2. 检查邮箱是否已存在（铁律4：数据库查询）
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: { code: 'EMAIL_EXISTS', message: '该邮箱已被注册' } 
        },
        { status: 409 }
      )
    }

    // 3. 密码加密（bcrypt 10 rounds，铁律5）
    const hashedPassword = await hash(password, 10)

    // 4. 创建用户（Prisma，默认角色SELLER）
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SELLER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    // 5. 标准成功响应（宪法5.1铁律3：API标准化）
    return NextResponse.json(
      { 
        success: true, 
        data: user,
        message: '注册成功，请登录'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[POST /api/auth/register]', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } 
      },
      { status: 500 }
    )
  }
}
