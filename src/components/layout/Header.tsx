import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useNews } from "@/contexts/NewsContext"

export function Header() {
  const { user, logout } = useAuth()
  const { hasUnreadToday } = useNews()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block">Deepdify</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className={`transition-colors hover:text-foreground/80 ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}>
              首页
            </Link>
            <Link to="/knowledge" className={`transition-colors hover:text-foreground/80 ${location.pathname === "/knowledge" ? "text-foreground" : "text-muted-foreground"}`}>
              知识库
            </Link>
            <Link to="/news" className="relative transition-colors hover:text-foreground/80 text-muted-foreground">
              每日资讯
              {hasUnreadToday && (
                <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/profile">个人中心</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                注销
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link to="/register">注册</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
