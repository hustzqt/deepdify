/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { parseForgotPasswordPutResponse } from '@/lib/auth/forgot-password-client'

describe('parseForgotPasswordPutResponse', () => {
  it('returns success when API returns success and message', () => {
    const r = parseForgotPasswordPutResponse({
      success: true,
      message: '如果该邮箱存在，我们已发送重置链接',
    })
    expect(r.kind).toBe('success')
    if (r.kind === 'success') {
      expect(r.message).toContain('重置')
    }
  })

  it('returns error from nested error.message', () => {
    const r = parseForgotPasswordPutResponse({
      success: false,
      error: { code: 'INVALID_EMAIL', message: '邮箱格式错误' },
    })
    expect(r.kind).toBe('error')
    if (r.kind === 'error') {
      expect(r.message).toBe('邮箱格式错误')
    }
  })

  it('returns generic error for invalid payload', () => {
    expect(parseForgotPasswordPutResponse(null).kind).toBe('error')
    expect(parseForgotPasswordPutResponse('x').kind).toBe('error')
  })
})
