# Deepdify 项目 BUG 档案 (BUG_ARCHIVE.md)
# 格式：YAML结构化，便于AI快速解析
# 更新规则：每解决一个BUG添加记录，每遇到新BUG追加条目

---

bug_001:
  id: "BUG-001"
  status: "已解决"
  module: "M1_auth"
  title: "@hookform/resolvers 版本冲突导致 TypeError"
  symptom: "TypeError: Cannot read properties of undefined (reading 'modules')"
  root_cause: "Next.js 16 Turbopack 与 @hookform/resolvers@latest 不兼容"
  first_seen: "2025-01-XX"
  solution: "回退 Next.js 到 14.2.21 + 锁定 @hookform/resolvers@3.3.4"
  verified_by: "重新安装依赖后页面正常加载"
  prevention: "严格遵守宪法技术栈锁定，禁止升级resolvers"
  
---

bug_002:
  id: "BUG-002"
  status: "已解决"
  module: "M1_auth"
  title: "PowerShell 字符串转义导致代码写入不完整"
  symptom: "修改login/page.tsx后浏览器运行旧代码，cat查看内容损坏"
  root_cause: "PowerShell Out-File/Set-Content 对 TypeScript 字符串转义处理不当"
  first_seen: "2025-01-XX"
  solution: "停止使用 PowerShell 写入复杂代码，改用 VS Code 直接编辑"
  verified_by: "VS Code保存后代码立即生效"
  prevention: "所有代码编辑使用 VS Code/Cursor，PowerShell仅用于命令执行"
  
---

bug_003:
  id: "BUG-003"
  status: "已解决"
  module: "环境配置"
  title: "Prisma 无法读取 .env.local 中的 DATABASE_URL"
  symptom: "执行 pnpm prisma db pull 报错找不到 DATABASE_URL"
  root_cause: "Prisma CLI 默认只读取 .env，不读取 .env.local"
  first_seen: "2025-01-XX"
  solution: "开发环境统一使用 .env 文件（同时满足Prisma和NextAuth）"
  verified_by: "prisma db pull 成功连接到 Neon"
  prevention: "宪法明确规定开发环境使用.env，生产环境用平台变量"
  
---

bug_004:
  id: "BUG-004"
  status: "已解决"
  module: "数据库"
  title: "阿里云 ECS Docker PostgreSQL 连接失败"
  symptom: "本地无法连接ECS的PostgreSQL，SSL/镜像源多次报错"
  root_cause: "ECS自建数据库需要复杂网络配置，不适合开发环境"
  first_seen: "2025-01-XX"
  solution: "迁移到 Neon Serverless Postgres（新加坡节点）"
  verified_by: "prisma db push 成功，API连接正常"
  prevention: "MVP阶段使用托管数据库(Neon/Supabase)，不自建"
  
---

bug_005:
  id: "BUG-005"
  status: "进行中"
  module: "M1_auth"
  title: "next-auth/react signIn() 不触发网络请求"
  symptom: "点击登录按钮→显示'登录中...'→Network面板无请求→不跳转"
  root_cause: "调查中：疑似Next.js 14.2.21 + NextAuth v5 + App Router兼容性问题"
  first_seen: "2025-01-XX"
  attempts:
    - attempt_1: "清除浏览器缓存 (失败)"
    - attempt_2: "重启pnpm dev服务器 (失败)"
    - attempt_3: "使用result.ok判断跳转 (失败，不执行)"
    - attempt_4: "使用window.location.replace强制跳转 (失败，signIn不返回)"
  current_hypothesis: "signIn()内部fetch逻辑异常，需绕过直接使用标准fetch API"
  next_solution: "重写login/page.tsx，直接fetch('/api/auth/csrf') + fetch('/api/auth/callback/credentials')"
  prevention: "记录此BUG，未来遇到类似前端无响应优先考虑绕过封装库"
  
---

bug_006:
  id: "BUG-006"
  status: "待观察"
  module: "M1_auth"
  title: "NextAuth Session 持久化验证"
  symptom: "尚未验证：登录成功后刷新页面是否保持登录状态"
  root_cause: "依赖BUG-005解决后才能测试"
  first_seen: "2025-01-XX"
  solution: "待执行：登录成功后按Ctrl+Shift+R强制刷新，观察是否仍在Dashboard"
  verified_by: "未验证"
  
---

bug_007:
  id: "BUG-007"
  status: "待观察"
  module: "M1_auth"
  title: "反向路由保护（已登录用户访问/login）"
  symptom: "尚未验证：已登录用户访问/login是否自动跳转到/dashboard"
  root_cause: "middleware.ts逻辑待验证"
  first_seen: "2025-01-XX"
  solution: "待执行：登录成功后手动访问/login，观察是否被重定向"
  verified_by: "未验证"

---

# 使用说明
# 1. AI编程时优先查阅此档案，避免重复建议已失败的方案
# 2. 新BUG遵循YAML格式追加到文件底部
# 3. 状态标记：待观察/进行中/已解决/已关闭
# 4. 当前阻断点用 进行中 标记在状态字段