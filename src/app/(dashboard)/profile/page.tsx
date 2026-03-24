'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUploader } from '@/components/profile/AvatarUploader'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { SecurityCard } from '@/components/profile/SecurityCard'
import type { ProfileUpdateInput, UserProfile } from '@/types/profile'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('获取资料失败')
        }
        const data = (await response.json()) as UserProfile
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [])

  const handleUpdateProfile = async (data: ProfileUpdateInput) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error ?? '更新失败')
      }

      const updated = (await response.json()) as UserProfile
      setProfile(updated)
      alert('资料已保存')
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败')
      throw err
    }
  }

  const handleAvatarChange = (url: string) => {
    setProfile((prev) => (prev ? { ...prev, image: url } : null))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-red-500">{error ?? '加载失败'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">个人设置</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">基本资料</TabsTrigger>
          <TabsTrigger value="security">账号安全</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>头像</CardTitle>
                <CardDescription>上传您的个人头像</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Must match UserProfile.image from GET /api/user/profile; null = no avatar URL (fallback in uploader) */}
                <AvatarUploader
                  currentAvatar={profile.image}
                  name={profile.name}
                  onAvatarChange={handleAvatarChange}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>更新您的个人资料</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  defaultValues={{
                    email: profile.email,
                    name: profile.name,
                    company: profile.company,
                    phone: profile.phone,
                    timezone: profile.timezone as ProfileUpdateInput['timezone'],
                    language: profile.language as ProfileUpdateInput['language'],
                    bio: profile.bio,
                  }}
                  onSubmit={handleUpdateProfile}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <SecurityCard email={profile.email} createdAt={profile.createdAt} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
