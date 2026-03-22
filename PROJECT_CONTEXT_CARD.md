# 🎯 DEEPDIFY 项目上下文卡片 v1.0
# 用途：每次新AI对话时，粘贴此卡片作为第一条消息
# 更新时间：2025-01-XX

## 项目一句话
跨境电商AI工作台，Next.js 14全栈应用

## 技术栈（锁死，不可变更）
- Next.js 14.2.21 (App Router) | TypeScript 5.x
- NextAuth v5 (Auth.js) | Prisma 5.x | Neon PostgreSQL
- React Hook Form 7.51.0 | @hookform/resolvers 3.3.4 | Zod 3.22.4
- shadcn/ui | Tailwind CSS | Zustand
- pnpm | Windows + PowerShell + VS Code

## 当前阶段
Phase 2 Sprint 1 验收测试

## 当前阻断点
登录页 signIn('credentials', {redirect:false}) 不触发网络请求
- 后端API正常（手动fetch返回200）
- 前端signIn()内部未发起fetch（Network面板无请求）

## 已完成的模块
- ✅ M1_auth 后端（注册/登录API、Prisma模型、密码哈希）
- ✅ M2_dashboard 布局（Sidebar、Header、Dashboard页面）
- ⏳ M1_auth 前端跳转（当前阻断）

## 绝对禁止（已验证失败的方案）
1. ❌ 升级Next.js到15/16（与resolvers冲突）
2. ❌ 升级@hookform/resolvers到latest（TypeError）
3. ❌ PowerShell Set-Content写入代码（字符转义损坏）
4. ❌ 仅清缓存/重启dev（非缓存问题）
5. ❌ 使用next-auth/react原生signIn()（本环境下不触发请求）

## 当前尝试方向
绕过signIn()，直接用fetch调用 /api/auth/csrf + /api/auth/callback/credentials

## 关键文件路径
| 文件 | 路径 |
|------|------|
| 认证配置 | src/lib/auth.ts |
| 登录页（阻断） | src/app/(auth)/login/page.tsx |
| 中间件 | src/middleware.ts |
| Prisma模型 | prisma/schema.prisma |
| 环境变量 | .env |

## 协作规则
- 我是IT小白，需要精确的复制粘贴指令
- 代码在聊天中给出，我手动粘贴到VS Code
- 每步完成后输出CHECKPOINT
- 修改前先确认当前文件内容（cat命令）
- 完整宪法见：CONSTITUTION_COMPACT.md v2.1

## 本次对话目标
修复BUG-005（登录页signIn不触发请求），执行SOP-004验收：
1. 重写 src/app/(auth)/login/page.tsx，绕过signIn()，直接使用fetch调用/api/auth/csrf + /api/auth/callback/credentials
2. 登录成功后强制跳转到/dashboard  
3. 按SOP-004验证登录功能（Network有请求、Console无报错、跳转成功）
4. 验收通过后执行SOP-005验证Session持久化