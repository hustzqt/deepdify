/**
 * Client-side helpers for the forgot-password flow (PUT /api/auth/reset-password).
 */

/** Cooldown duration after a successful request or 429 (matches server rate limit). */
export const FORGOT_PASSWORD_COOLDOWN_MS = 5 * 60 * 1000

/** localStorage key for persisting cooldown across reloads (same origin). */
export const FORGOT_PASSWORD_COOLDOWN_STORAGE_KEY = 'forgot-password-cooldown-until'

/**
 * Parses JSON from PUT /api/auth/reset-password into a success or error message.
 *
 * @param data - Parsed JSON body (unknown shape)
 * @returns Parsed outcome with user-facing message
 */
export function parseForgotPasswordPutResponse(data: unknown): {
  kind: 'success'
  message: string
} | {
  kind: 'error'
  message: string
} {
  if (typeof data !== 'object' || data === null) {
    return { kind: 'error', message: '响应格式错误' }
  }

  const rec = data as Record<string, unknown>

  if (rec.success === true && typeof rec.message === 'string') {
    return { kind: 'success', message: rec.message }
  }

  const err = rec.error
  if (typeof err === 'object' && err !== null) {
    const errRec = err as Record<string, unknown>
    if (typeof errRec.message === 'string') {
      return { kind: 'error', message: errRec.message }
    }
  }

  return { kind: 'error', message: '请求失败' }
}
