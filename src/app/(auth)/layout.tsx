// src/app/(auth)/layout.tsx
// 模块: M1_auth
// 功能: 认证页面（登录/注册）的共享布局

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Deepdify Studio</h1>
            <p className="text-slate-600 mt-2">AI驱动的跨境电商工作台</p>
          </div>
          {children}
        </div>
      </div>
    )
  }