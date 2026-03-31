'use client'

import type { ReactElement } from 'react'

/**
 * Root segment error UI when a route fails to render.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): ReactElement {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-red-600">页面错误</h2>
      <pre className="mt-2 text-sm text-gray-600">{error.message}</pre>
      <button
        type="button"
        onClick={reset}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        重试
      </button>
    </div>
  )
}
