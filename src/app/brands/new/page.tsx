'use client'

import { useState, type FormEvent, type ReactElement } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Minimal create-brand form: POST /api/brands then redirect to `/brands`.
 */
export default function NewBrandPage(): ReactElement {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  /**
   * Reads named fields via FormData (avoid `form.name`, which is the form element's name attr).
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    const keywordsStr = String(fd.get('keywords') ?? '')

    const data = {
      name: String(fd.get('name') ?? ''),
      industry: String(fd.get('industry') ?? ''),
      tone: String(fd.get('tone') ?? ''),
      description: String(fd.get('description') ?? ''),
      keywords: keywordsStr
        ? keywordsStr.split(',').map((k) => k.trim()).filter(Boolean)
        : [],
    }

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/brands')
      } else {
        const err = await res.text()
        alert('创建失败: ' + err)
      }
    } catch {
      alert('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>创建新品牌</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>品牌名称 *</label>
          <input name="name" required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>行业 *</label>
          <input name="industry" required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>调性</label>
          <input name="tone" style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>描述</label>
          <textarea name="description" rows={3} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>关键词（逗号分隔）</label>
          <input name="keywords" style={{ width: '100%', padding: 8 }} />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: loading ? '#ccc' : '#000',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '创建中...' : '创建品牌'}
        </button>
      </form>
    </div>
  )
}
