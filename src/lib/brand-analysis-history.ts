import { z } from 'zod'
import { prisma } from '@/lib/prisma'

/** Shared query validation for brand analysis history endpoints. */
export const brandAnalysisHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export type BrandAnalysisHistoryItem = {
  id: string
  brandId: string
  result: unknown
  usageLogId: string | null
  createdAt: Date
  usageLog: { totalTokens: number; costUsd: number | null } | null
}

/**
 * Loads persisted analysis rows for a brand when the user owns it; otherwise returns null.
 */
export async function getBrandAnalysisHistoryForUser(
  userId: string,
  brandId: string,
  limit: number
): Promise<BrandAnalysisHistoryItem[] | null> {
  const owned = await prisma.brand.findFirst({
    where: { id: brandId, userId },
    select: { id: true },
  })
  if (!owned) {
    return null
  }

  return prisma.brandAnalysisResult.findMany({
    where: { brandId, userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      brandId: true,
      result: true,
      usageLogId: true,
      createdAt: true,
      usageLog: { select: { totalTokens: true, costUsd: true } },
    },
  })
}
