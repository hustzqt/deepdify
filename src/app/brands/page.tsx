// Ref: .cursor/rules/global.mdc
// Ref: .cursor/rules/architecture.mdc
// Module: Brand — list page (Server Component)

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { BrandAiAnalyzePanel } from '@/components/brands/BrandAiAnalyzePanel'
import type { Brand } from '@prisma/client'
import type { ReactElement } from 'react'

/**
 * Lists all brands for the signed-in user.
 */
export default async function BrandsPage(): Promise<ReactElement> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">品牌管理</h1>
          <p className="text-gray-600 mt-1">管理您的品牌资产和 AI 知识库</p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            创建品牌
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mb-10">
        <BrandAiAnalyzePanel />
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-lg text-gray-500 mb-4">还没有创建任何品牌</p>
          <Button asChild variant="outline">
            <Link href="/brands/new">创建第一个品牌</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand: Brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold truncate">{brand.name}</h2>
                  {brand.difyKnowledgeId ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs shrink-0">
                      AI就绪
                    </span>
                  ) : null}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                  {brand.description ?? '暂无描述'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {brand.industry ? (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {brand.industry}
                    </span>
                  ) : null}
                  {brand.tone ? (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {brand.tone}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
