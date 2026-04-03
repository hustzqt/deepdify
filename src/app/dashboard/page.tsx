export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Deepdify 工作台</h1>
      <p>欢迎回来！认证系统测试成功 ✅</p>
      <p className="mt-4">
        <a
          href="/dashboard/usage"
          className="text-primary font-medium underline underline-offset-4 hover:opacity-90"
        >
          查看 AI 用量统计
        </a>
      </p>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Phase 2 测试完成项：</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>✅ 用户注册 API</li>
          <li>✅ 用户登录</li>
          <li>✅ Session 持久化</li>
          <li>✅ 路由保护 (Middleware)</li>
          <li>✅ 数据库写入/读取</li>
        </ul>
      </div>
    </div>
  )
}
