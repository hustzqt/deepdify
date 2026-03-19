// src/components/layout/sidebar.tsx
// 模块: M2_dashboard
// 功能: 工作台侧边栏导航

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useUIStore } from '@/stores/ui-store'
import { navItems } from './nav-items'
import { Menu, X } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className={cn('flex items-center gap-2', !sidebarOpen && 'lg:hidden')}>
            <span className="text-xl font-bold">Deepdify</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] px-4">
          <nav className="flex flex-col gap-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white',
                      isActive && 'bg-slate-800 text-white',
                      !sidebarOpen && 'lg:justify-center lg:px-2'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className={cn(!sidebarOpen && 'lg:hidden')}>{item.title}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* 移动端汉堡菜单 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-slate-900 p-0">
          <div className="flex h-16 items-center px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Deepdify</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)] px-4">
            <nav className="flex flex-col gap-2 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white',
                        isActive && 'bg-slate-800 text-white'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}