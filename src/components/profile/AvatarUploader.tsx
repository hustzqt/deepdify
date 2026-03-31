'use client'

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload } from 'lucide-react'

interface AvatarUploaderProps {
  currentAvatar: string | null
  name: string | null
  onAvatarChange: (url: string) => void
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const DEFAULT_AVATAR = '/default-avatar.png'

/**
 * Avatar upload with local preview and POST /api/user/avatar (field name `avatar`).
 */
export function AvatarUploader({
  currentAvatar,
  name,
  onAvatarChange,
}: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userImage = currentAvatar

  const imageSrc = previewUrl || userImage || DEFAULT_AVATAR

  const handleClick = () => fileInputRef.current?.click()

  const processFile = useCallback(
    async (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('仅支持 JPEG、PNG、WebP 格式')
        return
      }
      if (file.size > MAX_SIZE) {
        alert('文件大小不能超过 5MB')
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
        })

        const data = (await response.json()) as {
          url?: string
          error?: string
        }

        if (!response.ok) {
          throw new Error(data.error ?? '上传失败')
        }

        const url = data.url
        if (typeof url !== 'string' || !url) {
          throw new Error('上传响应无效')
        }

        onAvatarChange(url)
        setPreviewUrl(null)
      } catch (error) {
        console.error('上传错误:', error)
        alert(error instanceof Error ? error.message : '头像上传失败')
        setPreviewUrl(null)
      } finally {
        setIsUploading(false)
        URL.revokeObjectURL(objectUrl)
      }
    },
    [onAvatarChange]
  )

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void processFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      void processFile(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative h-24 w-24 min-h-24 min-w-24 flex-shrink-0 cursor-pointer group rounded-full overflow-hidden ring-2 ring-offset-2 ring-gray-200 group-hover:ring-blue-400 transition-all bg-gray-100"
      >
        {/* Blob/data URLs and onError fallback are simpler with native img than next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element -- user preview + dynamic fallback */}
        <img
          src={imageSrc}
          alt={name || '用户头像'}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover block"
          style={{ display: 'block' }}
          onError={(e) => {
            const el = e.currentTarget
            if (el.src.includes('default-avatar')) return
            el.src = DEFAULT_AVATAR
          }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 group-hover:!opacity-100 rounded-full transition-all"
          style={{ opacity: 0 }}
        >
          <Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div className="text-center space-y-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? '上传中...' : '更换头像'}
        </Button>
        <p className="text-xs text-gray-500">
          支持 JPG、PNG、WebP，最大 5MB
        </p>
      </div>
    </div>
  )
}
