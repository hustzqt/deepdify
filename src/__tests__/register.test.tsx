import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '@/components/features/RegisterForm'
import { toast } from 'sonner'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
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
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn() as typeof fetch
  })

  it('posts JSON to /api/auth/register and shows success toast', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          message: '注册成功，请登录',
          data: {
            id: 'u1',
            name: 'Alice',
            email: 'alice@example.com',
            role: 'SELLER',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        }),
        { status: 201 }
      )
    )

    const user = userEvent.setup()
    renderWithQuery(<RegisterForm />)

    await user.type(screen.getByLabelText(/姓名/), 'Alice')
    await user.type(screen.getByLabelText(/邮箱/), 'alice@example.com')
    await user.type(screen.getByLabelText(/密码/), 'secret12')
    await user.click(screen.getByRole('button', { name: '注册' }))

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    const body = vi.mocked(globalThis.fetch).mock.calls[0]?.[1]?.body
    expect(typeof body === 'string' ? JSON.parse(body) : body).toEqual({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret12',
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
      expect(push).toHaveBeenCalledWith('/login')
    })
  })

  it('shows toast error when API returns EMAIL_EXISTS', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: '该邮箱已被注册' },
        }),
        { status: 409 }
      )
    )

    const user = userEvent.setup()
    renderWithQuery(<RegisterForm />)

    await user.type(screen.getByLabelText(/姓名/), 'Bob')
    await user.type(screen.getByLabelText(/邮箱/), 'dup@example.com')
    await user.type(screen.getByLabelText(/密码/), 'secret12')
    await user.click(screen.getByRole('button', { name: '注册' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('该邮箱已被注册')
    })
  })
})
