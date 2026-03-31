import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement, type ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '@/app/(auth)/login/page'
import { RegisterForm } from '@/components/features/RegisterForm'
import { toast } from 'sonner'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(createElement(QueryClientProvider, { client }, ui))
}

/**
 * Mocks CSRF + credentials callback for login page tests.
 */
function mockLoginFetches(opts: {
  callbackStatus: number
  callbackBody?: string
  callbackJson?: Record<string, unknown>
}) {
  const { callbackStatus, callbackBody, callbackJson } = opts
  vi.mocked(globalThis.fetch).mockImplementation(
    async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('/api/auth/csrf')) {
        return new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (url.includes('/api/auth/callback/credentials')) {
        if (callbackJson) {
          return new Response(JSON.stringify(callbackJson), {
            status: callbackStatus,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return new Response(callbackBody ?? '', {
          status: callbackStatus,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response('not found', { status: 404 })
    }
  )
}

describe('auth security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn() as typeof fetch
    window.alert = vi.fn()
  })

  it('rejects login safely when password contains SQL injection-like payload', async () => {
    mockLoginFetches({
      callbackStatus: 401,
      callbackJson: { error: 'CredentialsSignin' },
    })

    const user = userEvent.setup()
    render(createElement(LoginPage))

    const maliciousPassword = "' OR '1'='1'; --"
    await user.type(screen.getByLabelText(/邮箱/), 'user@example.com')
    await user.type(screen.getByLabelText(/密码/), maliciousPassword)
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(screen.getByText(/邮箱或密码错误/)).toBeInTheDocument()
    })
  })

  it('includes CSRF token in credentials callback POST body', async () => {
    mockLoginFetches({
      callbackStatus: 401,
      callbackJson: { error: 'CredentialsSignin' },
    })

    const user = userEvent.setup()
    render(createElement(LoginPage))

    await user.type(screen.getByLabelText(/邮箱/), 'a@b.com')
    await user.type(screen.getByLabelText(/密码/), 'secret12')
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })

    const calls = vi.mocked(globalThis.fetch).mock.calls
    const callbackCall = calls.find((c) =>
      String(c[0]).includes('/api/auth/callback/credentials')
    )
    expect(callbackCall).toBeDefined()
    const body = callbackCall?.[1]?.body
    expect(typeof body).toBe('string')
    const params = new URLSearchParams(body as string)
    expect(params.get('csrfToken')).toBe('test-csrf-token')
    expect(params.get('email')).toBe('a@b.com')
  })

  it('does not execute script when name contains XSS-like string (RegisterForm)', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
          data: {
            id: 'u1',
            name: `<script>alert('xss')</script>`,
            email: 'xss@example.com',
            role: 'SELLER',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        }),
        { status: 201 }
      )
    )

    const user = userEvent.setup()
    renderWithQuery(createElement(RegisterForm))

    await user.type(
      screen.getByLabelText(/姓名/),
      `<script>alert('xss')</script>`
    )
    await user.type(screen.getByLabelText(/邮箱/), 'xss@example.com')
    await user.type(screen.getByLabelText(/密码/), 'secret12')
    await user.click(screen.getByRole('button', { name: '注册' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
    })

    expect(window.alert).not.toHaveBeenCalled()
  })
})
