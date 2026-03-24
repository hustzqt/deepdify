'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import {
  ProfileUpdateSchema,
  SUPPORTED_LANGUAGES,
  SUPPORTED_TIMEZONES,
  type ProfileUpdateInput,
} from '@/types/profile'

interface ProfileFormProps {
  defaultValues: ProfileUpdateInput & { email: string }
  onSubmit: (data: ProfileUpdateInput) => Promise<void>
}

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(
      ProfileUpdateSchema
    ) as Resolver<ProfileUpdateInput>,
    defaultValues: {
      name: defaultValues.name ?? '',
      company: defaultValues.company ?? '',
      phone: defaultValues.phone ?? '',
      timezone: defaultValues.timezone ?? 'Asia/Shanghai',
      language: defaultValues.language ?? 'zh',
      bio: defaultValues.bio ?? '',
    },
  })

  const bio = watch('bio') || ''
  const bioLength = bio.length
  const timezoneValue = watch('timezone')
  const languageValue = watch('language')

  const handleFormSubmit = async (data: ProfileUpdateInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          value={defaultValues.email}
          disabled
          className="bg-gray-100"
        />
        <p className="text-xs text-gray-500">邮箱地址不可修改</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">姓名</Label>
        <Input
          id="name"
          placeholder="请输入姓名"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">公司名称</Label>
        <Input
          id="company"
          placeholder="请输入公司名称"
          {...register('company')}
        />
        {errors.company && (
          <p className="text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">手机号码</Label>
        <Input
          id="phone"
          placeholder="请输入11位手机号"
          {...register('phone')}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">时区</Label>
        <Select
          value={timezoneValue}
          onValueChange={(value) =>
            setValue(
              'timezone',
              value as (typeof SUPPORTED_TIMEZONES)[number],
              { shouldValidate: true, shouldDirty: true }
            )
          }
        >
          <SelectTrigger id="timezone">
            <SelectValue placeholder="选择时区" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asia/Shanghai">Asia/Shanghai (北京时间)</SelectItem>
            <SelectItem value="Asia/Hong_Kong">Asia/Hong_Kong (香港)</SelectItem>
            <SelectItem value="Asia/Tokyo">Asia/Tokyo (东京)</SelectItem>
            <SelectItem value="Asia/Singapore">Asia/Singapore (新加坡)</SelectItem>
            <SelectItem value="America/New_York">America/New_York (纽约)</SelectItem>
            <SelectItem value="America/Los_Angeles">America/Los_Angeles (洛杉矶)</SelectItem>
            <SelectItem value="Europe/London">Europe/London (伦敦)</SelectItem>
            <SelectItem value="Europe/Paris">Europe/Paris (巴黎)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">界面语言</Label>
        <Select
          value={languageValue}
          onValueChange={(value) =>
            setValue(
              'language',
              value as (typeof SUPPORTED_LANGUAGES)[number],
              { shouldValidate: true, shouldDirty: true }
            )
          }
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="选择语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">个人简介</Label>
        <Textarea
          id="bio"
          placeholder="介绍一下自己..."
          className="min-h-[100px] resize-none"
          {...register('bio')}
        />
        <div className="flex justify-between text-xs">
          <span
            className={bioLength > 500 ? 'text-red-500' : 'text-gray-500'}
          >
            {bioLength}/500
          </span>
          {errors.bio && (
            <span className="text-red-500">{errors.bio.message}</span>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          '保存更改'
        )}
      </Button>
    </form>
  )
}
