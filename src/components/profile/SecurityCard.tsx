'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Key, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SecurityCardProps {
  email: string
  createdAt: string
}

/**
 * Account security summary: email, password shortcut, registration date.
 */
export function SecurityCard({ email, createdAt }: SecurityCardProps) {
  const router = useRouter()

  /** Navigates to password reset flow (forgot-password page). */
  const handleChangePassword = () => {
    router.push('/forgot-password')
  }

  /** Formats an ISO date string for zh-CN display. */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          账号安全
        </CardTitle>
        <CardDescription>管理您的账号安全设置</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">登录邮箱</h4>
            <p className="text-sm text-gray-500 mt-1">{email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Key className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">密码</h4>
                <p className="text-sm text-gray-500 mt-1">
                  建议定期更换密码以保护账号安全
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleChangePassword}>
                修改密码
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            账号创建于：{formatDate(createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
