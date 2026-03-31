import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import NewBrandError from '@/app/brands/new/error'

describe('NewBrandError', () => {
  it('renders message and calls reset when 重试 is clicked', async () => {
    const reset = vi.fn()
    const err = new Error('boom')

    const user = userEvent.setup()
    render(<NewBrandError error={err} reset={reset} />)

    expect(screen.getByText('页面错误')).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '重试' }))
    expect(reset).toHaveBeenCalledTimes(1)
  })
})
