// src/app/(dashboard)/page.tsx
// 模块: M2_dashboard
// 功能: 仪表盘首页 - 展示关键指标

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'

const stats = [
  {
    title: '总商品数',
    value: '1,234',
    description: '较上月增长 12%',
    icon: Package,
    trend: 'up',
  },
  {
    title: '今日订单',
    value: '56',
    description: '较昨日增长 8%',
    icon: ShoppingCart,
    trend: 'up',
  },
  {
    title: '销售额',
    value: '¥12,345',
    description: '较上月增长 23%',
    icon: TrendingUp,
    trend: 'up',
  },
  {
    title: '活跃用户',
    value: '890',
    description: '较上周增长 5%',
    icon: Users,
    trend: 'up',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">仪表盘</h2>
        <p className="text-slate-600">欢迎回到 Deepdify 电商工作台</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>销售趋势</CardTitle>
            <CardDescription>近30天销售额变化</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
            图表区域（后续集成 Recharts）
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>最近订单</CardTitle>
            <CardDescription>最新5笔订单</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
            订单列表（后续开发）
          </CardContent>
        </Card>
      </div>
    </div>
  )
}