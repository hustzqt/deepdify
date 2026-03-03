import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { CheckInCard } from "@/components/CheckInCard"
import { BookOpen, Star, TrendingUp } from "lucide-react"

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">个人中心</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>您的账户信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-lg">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              注册时间：{new Date(user.createdAt).toLocaleDateString("zh-CN")}
            </div>
            <Button variant="outline" className="w-full">编辑资料</Button>
          </CardContent>
        </Card>

        {/* Check-in Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              学习打卡
            </CardTitle>
            <CardDescription>每日坚持，共同进步</CardDescription>
          </CardHeader>
          <CardContent>
            <CheckInCard />
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>账户设置</CardTitle>
            <CardDescription>管理您的账户</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">修改密码</Button>
            <Button variant="outline" className="w-full justify-start">通知设置</Button>
            <Button variant="outline" className="w-full justify-start">隐私设置</Button>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              学习数据
            </CardTitle>
            <CardDescription>您的学习历程</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">128</div>
                <div className="text-xs text-muted-foreground">已读文章</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-500">2,560</div>
                <div className="text-xs text-muted-foreground">知识积分</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-500">15</div>
                <div className="text-xs text-muted-foreground">收藏文章</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-cyan-500">8</div>
                <div className="text-xs text-muted-foreground">分享次数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              成就徽章
            </CardTitle>
            <CardDescription>您的成就记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square rounded-lg bg-yellow-100 flex items-center justify-center" title="首次打卡">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center opacity-50" title="连续7天">
                <span className="text-2xl">7</span>
              </div>
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center opacity-50" title="连续30天">
                <span className="text-2xl">30</span>
              </div>
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center opacity-50" title="累计100天">
                <span className="text-2xl">100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
