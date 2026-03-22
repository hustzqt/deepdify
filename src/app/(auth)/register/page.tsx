import { RegisterForm } from '@/components/features/RegisterForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Registration page — layout mirrors login (centered card, Deepdify branding).
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Deepdify Studio</CardTitle>
          <CardDescription>创建账号，加入 AI 驱动的跨境电商工作台</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <p className="text-xs text-muted-foreground">
            注册即表示您同意我们的服务条款与隐私政策
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
