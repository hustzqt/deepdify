// Module: Brand — detail page with AI analyze panel.

import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { BrandDetailClient } from '@/components/brands/BrandDetailClient'

interface PageProps {
  params: { id: string }
}

/**
 * Brand detail: metadata + AI analysis entry (prefilled from DB).
 */
export default async function BrandDetailPage(props: PageProps): Promise<ReactElement> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = props.params

  const brand = await prisma.brand.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!brand) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-8">
      <div>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-1" asChild>
          <Link href="/brands">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            返回品牌列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="text-muted-foreground mt-1">{brand.industry}</p>
        {brand.description ? (
          <p className="mt-4 text-sm text-foreground/90 whitespace-pre-wrap">{brand.description}</p>
        ) : null}
      </div>

      <BrandDetailClient
        brand={{
          id: brand.id,
          name: brand.name,
          industry: brand.industry,
          description: brand.description,
          targetAudience: brand.targetAudience,
        }}
      />
    </div>
  )
}
