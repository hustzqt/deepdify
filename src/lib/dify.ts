// src/lib/dify.ts
// Module: Dify proxy client (Backend-for-AI)
// Func: HTTP client for Dify CE chat-messages and file upload APIs

const DEFAULT_DIFY_BASE = 'http://localhost/v1'

interface DifyChatRequest {
  inputs?: Record<string, unknown>
  query: string
  conversation_id?: string
  user?: string
  response_mode?: 'blocking' | 'streaming'
}

interface DifyChatResponse {
  answer: string
  conversation_id: string
  id: string
  metadata?: Record<string, unknown>
}

/**
 * Thin wrapper around Dify REST API (blocking chat + file upload).
 * Instantiate only on the server (uses secret API key).
 */
export class DifyClient {
  private readonly apiKey: string

  private readonly baseUrl: string

  constructor() {
    const key = process.env.DIFY_API_KEY
    if (!key) {
      throw new Error('Missing DIFY_API_KEY environment variable')
    }
    this.apiKey = key
    this.baseUrl = process.env.DIFY_BASE_URL ?? DEFAULT_DIFY_BASE
  }

  /**
   * Sends a chat message to a Dify app (blocking mode by default).
   */
  async chat(params: DifyChatRequest): Promise<DifyChatResponse> {
    const res = await fetch(`${this.baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        response_mode: params.response_mode ?? 'blocking',
        user: params.user ?? 'deepdify-user',
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Dify API error: ${res.status} - ${error}`)
    }

    return res.json() as Promise<DifyChatResponse>
  }

  /**
   * Uploads a file to Dify for use in workflows / knowledge pipelines.
   */
  async uploadFile(file: File, user?: string): Promise<unknown> {
    const formData = new FormData()
    formData.append('file', file)
    if (user) {
      formData.append('user', user)
    }

    const res = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`File upload failed: ${res.status}`)
    }

    return res.json() as Promise<unknown>
  }
}

/** Singleton for server-side routes (do not import in Client Components). */
export const difyClient = new DifyClient()
