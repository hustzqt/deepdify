// src/app/(dashboard)/layout.tsx
// 模块: M2_dashboard
// 功能: 工作台（仪表盘）布局 - 包含侧边栏和顶部导航

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={cn('transition-all duration-300 lg:ml-64')}>
        <Header />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}