// src/app/page.tsx
// 模块: 根路由
// 功能: 根据登录状态重定向到登录页或仪表盘

import { redirect } from 'next/navigation'

export default function HomePage() {
  // 暂时直接重定向到登录页（后续根据认证状态判断）
  redirect('/login')
}