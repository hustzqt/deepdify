import { describe, expect, it } from 'vitest'
import { toPrismaJson } from '@/lib/ai/prisma-json'

describe('toPrismaJson', () => {
  it('round-trips objects for Prisma JSON column', () => {
    const input = { a: 1, nested: { b: 'x' } }
    const out = toPrismaJson(input)
    expect(out).toEqual(input)
  })
})
