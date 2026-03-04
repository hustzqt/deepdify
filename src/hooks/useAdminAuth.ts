// 管理员认证 Hook
import { useAuth } from "@/contexts/AuthContext"

const ADMIN_EMAIL = "admin@deepdify.com"

export function useAdminAuth() {
  const { user, isLoading } = useAuth()

  const isAdmin = user?.email === ADMIN_EMAIL

  // 保存管理员邮箱到 localStorage，供 API 调用使用
  if (isAdmin && user?.email) {
    localStorage.setItem("deepdify_admin_email", user.email)
  }

  return {
    user,
    isAdmin,
    isLoading,
    adminEmail: ADMIN_EMAIL,
  }
}
