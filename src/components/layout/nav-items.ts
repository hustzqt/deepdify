// src/components/layout/nav-items.ts
// 模块: M2_dashboard
// 功能: 侧边栏导航配置

import { 
    LayoutDashboard, 
    Package, 
    Search, 
    BarChart3, 
    ShoppingCart, 
    Sparkles, 
    Settings 
  } from 'lucide-react'
  
  export interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }
  
  export const navItems: NavItem[] = [
    {
      title: '仪表盘',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      title: '商品管理',
      href: '/products',
      icon: Package,
    },
    {
      title: '智能选品',
      href: '/selection',
      icon: Search,
    },
    {
      title: '数据分析',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      title: '订单管理',
      href: '/orders',
      icon: ShoppingCart,
    },
    {
      title: 'AI工具',
      href: '/ai-tools',
      icon: Sparkles,
    },
    {
      title: '系统设置',
      href: '/settings',
      icon: Settings,
    },
  ]