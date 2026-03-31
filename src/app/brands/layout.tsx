import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'

export const metadata: Metadata = {
  title: '品牌管理 - Deepdify',
}

/**
 * Shared shell for `/brands` routes: full viewport height and theme background.
 */
export default function BrandsLayout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return <div className="min-h-screen bg-background">{children}</div>
}
