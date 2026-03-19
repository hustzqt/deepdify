// src/lib/constants.ts
// 模块: 全局常量
// 功能: 项目中使用的常量定义

export const APP_NAME = 'Deepdify Studio'
export const APP_DESCRIPTION = 'AI驱动的跨境电商工作台'

// 导航配置
export const NAV_ITEMS = [
  {
    title: '仪表盘',
    href: '/',
    icon: 'LayoutDashboard',
  },
  {
    title: '商品管理',
    href: '/products',
    icon: 'Package',
  },
  {
    title: '智能选品',
    href: '/selection',
    icon: 'Search',
  },
  {
    title: '数据分析',
    href: '/analytics',
    icon: 'BarChart3',
  },
  {
    title: '订单管理',
    href: '/orders',
    icon: 'ShoppingCart',
  },
  {
    title: 'AI工具',
    href: '/ai-tools',
    icon: 'Sparkles',
  },
  {
    title: '系统设置',
    href: '/settings',
    icon: 'Settings',
  },
] as const

// Supabase 配置（这些会在环境变量中配置，这里只是类型提示）
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}