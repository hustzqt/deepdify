import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { difyClient } from '@/lib/dify'

/**
 * POST /api/dify — Backend-for-AI proxy: forwards chat to Dify using server-side API key.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body: unknown = await req.json()
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { query, conversation_id, inputs } = body as {
      query?: unknown
      conversation_id?: unknown
      inputs?: unknown
    }

    if (typeof query !== 'string' || query.length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    if (
      conversation_id !== undefined &&
      typeof conversation_id !== 'string'
    ) {
      return NextResponse.json(
        { error: 'conversation_id must be a string' },
        { status: 400 }
      )
    }

    let inputsRecord: Record<string, unknown> = {}
    if (inputs !== undefined) {
      if (
        typeof inputs !== 'object' ||
        inputs === null ||
        Array.isArray(inputs)
      ) {
        return NextResponse.json(
          { error: 'inputs must be a plain object' },
          { status: 400 }
        )
      }
      inputsRecord = inputs as Record<string, unknown>
    }

    const response = await difyClient.chat({
      query,
      conversation_id,
      inputs: inputsRecord,
      user: session.user.id,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Dify API error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Dify request failed',
      },
      { status: 500 }
    )
  }
}
