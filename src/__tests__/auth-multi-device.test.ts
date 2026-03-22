import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '@/app/(auth)/login/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

/**
 * Sets up fetch mocks for a successful CSRF + credentials login (redirect).
 */
function mockSuccessfulLogin() {
  vi.mocked(globalThis.fetch).mockImplementation(
    async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/api/auth/csrf')) {
        return new Response(JSON.stringify({ csrfToken: 'csrf-ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (url.includes('/api/auth/callback/credentials')) {
        return new Response(null, { status: 302, statusText: 'Found' })
      }
      return new Response('not found', { status: 404 })
    }
  )
}

describe('auth multi-device', () => {
  let hrefValue = ''

  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn() as typeof fetch
    window.alert = vi.fn()
    hrefValue = ''
    vi.stubGlobal('navigator', {
      ...navigator,
      userAgent: 'Mozilla/5.0 (default)',
    })
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        get href() {
          return hrefValue
        },
        set href(v: string) {
          hrefValue = v
        },
      },
    })
  })

  it('completes login flow under different User-Agent strings', async () => {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Chrome/120)',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1',
    ]

    for (const ua of agents) {
      vi.stubGlobal('navigator', { ...navigator, userAgent: ua })
      mockSuccessfulLogin()

      const user = userEvent.setup()
      const { unmount } = render(createElement(LoginPage))

      await user.type(screen.getByLabelText(/邮箱/), 'same@example.com')
      await user.type(screen.getByLabelText(/密码/), 'secret12')
      await user.click(screen.getByRole('button', { name: '登录' }))

      await waitFor(() => {
        expect(hrefValue).toBe('/dashboard')
      })

      unmount()
      vi.mocked(globalThis.fetch).mockClear()
      hrefValue = ''
    }
  })

  it('allows concurrent successful logins for the same account (JWT session)', async () => {
    mockSuccessfulLogin()

    const user = userEvent.setup()
    const { unmount } = render(createElement(LoginPage))

    await user.type(screen.getByLabelText(/邮箱/), 'concurrent@example.com')
    await user.type(screen.getByLabelText(/密码/), 'secret12')
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(hrefValue).toBe('/dashboard')
    })

    unmount()
    hrefValue = ''
    mockSuccessfulLogin()

    const user2 = userEvent.setup()
    render(createElement(LoginPage))

    await user2.type(screen.getByLabelText(/邮箱/), 'concurrent@example.com')
    await user2.type(screen.getByLabelText(/密码/), 'secret12')
    await user2.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(hrefValue).toBe('/dashboard')
    })

    expect(window.alert).not.toHaveBeenCalled()
  })
})
