import type { Prisma } from '@prisma/client'

/**
 * Serializes an arbitrary value to Prisma JSON input (stable for DB storage).
 */
export function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
