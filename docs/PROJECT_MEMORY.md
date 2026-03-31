# Deepdify Studio — 项目记忆文件

> 每日更新，AI 助手每次对话必读此文件  
> 最后更新：2026-03-28

---

## §1 项目身份

- **名称**：Deepdify Studio（前身 BrandCraft）
- **定位**：AI 驱动的品牌管理 SaaS
- **仓库**：`d:\cursorpro\deepdify`（主应用在根目录 `src/`，非嵌套 monorepo 子包）
- **宪法版本**：CONSTITUTION.md v0.3.1
- **开发计划**：`docs/DEV_PLAN.md` v2

---

## §2 技术栈（审计确认）

| 层 | 技术 | 版本 | 状态 |
|----|------|------|------|
| 框架 | Next.js (App Router) | 14.2.21 | ✅ 运行中 |
| 认证 | next-auth | 5.0.0-beta.30 | ✅ 可用 |
| ORM | Prisma | ^6 | ✅ 可用 |
| 数据库 | PostgreSQL | — | ✅ 已连接（Neon 等，见 `DATABASE_URL`） |
| 状态管理 | Zustand | — | ⚠️ 2 个 store |
| 数据请求 | @tanstack/react-query | — | ✅ 已集成 |
| 样式 | Tailwind CSS | — | ✅ 可用 |
| AI 接口 | Dify | — | ⚠️ 待验证连通性 |
| AI 备选 | OpenAI-compatible（`OPENAI_API_KEY`） | — | ⚠️ 待确认是否使用 |
| 校验 | Zod | ^4 | ⚠️ 注意 v4 变更 |
| 测试 | Vitest | — | ⚠️ 覆盖率未知 |
| 包管理 | pnpm | 9 | ✅ |
| Node | — | >=20 | ✅ |

---

## §3 路由地图（审计确认）

### 页面路由

| 路径 | 文件 | 状态 | 备注 |
|------|------|------|------|
| `/` | `src/app/page.tsx` | ✅ | 首页/落地页 |
| `/login` | `src/app/(auth)/login/page.tsx` | ✅ | |
| `/register` | `src/app/(auth)/register/page.tsx` | ✅ | 已迁入 `(auth)`，与 `RegisterForm` 一致 |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | ✅ | |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | ✅ | |
| `/dashboard` | `src/app/dashboard/page.tsx` | ✅ | |
| `/profile` | `src/app/(dashboard)/profile/page.tsx` | ✅ | |
| `/brands` | `src/app/brands/page.tsx` | ✅ | |
| `/brands/new` | `src/app/brands/new/page.tsx` | ✅ | |
| `/brands/[id]` | `src/app/brands/[id]/page.tsx` | ✅ | |

### API 路由

| 路径 | 文件 | 状态 | 备注 |
|------|------|------|------|
| `/api/auth/[...nextauth]` | `route.ts` | ✅ | NextAuth 核心 |
| `/api/auth/register` | `route.ts` | ✅ | |
| `/api/auth/reset-password` | `route.ts` | ✅ | |
| `/api/brands` | `route.ts` | ✅ | CRUD |
| `/api/brands/[id]` | `route.ts` | ✅ | |
| `/api/ai/brand-analyze` | `route.ts` | ⚠️ | 需验证 Dify 连通 |
| `/api/dify` | `route.ts` | ⚠️ | 需验证 |
| `/api/user/avatar` | `route.ts` | ✅ | |
| `/api/user/profile` | `route.ts` | ✅ | |

---

## §4 组件清单

| 目录 | 内容 | 状态 |
|------|------|------|
| `src/components/ui/` | 基础 UI 组件 | ✅ |
| `src/components/layout/` | 布局组件 | ✅ |
| `src/components/brands/` | `BrandAiAnalyzePanel` | ⚠️ 需完善 |
| `src/components/profile/` | 用户资料组件 | ✅ |
| `src/components/providers/` | React 上下文 Provider | ✅ |

---

## §5 环境变量

模板文件：**`.env.example`**（已纳入版本控制；`.env.local` 勿提交）。

建议键名（与代码对齐）：

- `DATABASE_URL` / `DIRECT_URL`
- `NEXTAUTH_URL`
- **`AUTH_SECRET` 或 `NEXTAUTH_SECRET`**（`src/lib/auth.ts` 同时支持）
- `PORT`（可选，固定本地端口）
- `DIFY_BASE_URL` / `DIFY_BRAND_ANALYSIS_KEY`（及可选 `DIFY_API_KEY`）
- `OPENAI_API_KEY`（若使用 OpenAI 兼容 API）
- `NEXT_PUBLIC_*`（见 `.env.example`）

---

## §6 已知问题（P0/P1）

| ID | 严重度 | 描述 | 状态 | 预计修复 |
|----|--------|------|------|----------|
| BUG-001 | 🔴 P0 | register 路由重复（顶层 vs `(auth)`） | ✅ 已修复 | Day 01 |
| BUG-002 | 🔴 P0 | 端口漂移 3000–3006 | 🔄 缓解 | `PORT=3000` + 释放占用进程 |
| BUG-003 | 🟡 P1 | `.env` 键名不一致（AUTH vs NEXTAUTH） | ✅ 已缓解 | `auth.ts` 双读 |
| BUG-004 | 🟡 P1 | 无 `.env.example` | ✅ 已创建 | Day 01 |
| BUG-005 | 🟡 P1 | `OPENAI_API_KEY` 用途不明 | 待确认 | Day 02 |

---

## §7 Phase 进度

| Phase | 状态 | 完成日期 |
|-------|------|----------|
| Phase 0.8 文档收尾 | ✅ 完成 | — |
| Phase 1.0 宪法 + 锁版本 | ✅ 完成 | — |
| Phase 1.5 Sprint 1 | 🔄 进行中 | — |
| Phase 1.5 Sprint 2 | ⬜ 未开始 | — |
| Phase 1.5 Sprint 3 | ⬜ 未开始 | — |

---

## §8 每日日志

### Day 01 — 2026-03-28

**任务**：项目审计 + P0 修复  

**完成**：

- 项目结构完整审计；技术栈与路由地图已写入本文档
- 识别 7 类问题并登记 §6
- **register**：删除 `src/app/register/page.tsx`，新增 `src/app/(auth)/register/page.tsx`（复用 `RegisterForm`），URL 仍为 `/register`
- **端口**：向 `.env.local` 追加 `PORT=3000`（若原本无 `PORT`）
- **密钥名**：`auth.ts` 同时读取 `AUTH_SECRET` 与 `NEXTAUTH_SECRET`
- **`.env.example`**：已添加；**`.gitignore`** 增加 `!.env.example` 以免被 `.env*` 误忽略
- **`docs/DEV_PLAN.md`** 升级为 v2；本文档同步审计版

**阻塞**：无  

**明日计划**：P0 收尾验证 + 现有功能回归（登录/品牌/API）

---

## §9 变更日志

| 日期 | 变更内容 |
|------|----------|
| 2026-03-28 | Day 01 审计版：技术栈、路由、BUG 表、日志 |
| 2026-03-28 | 初始化项目记忆（早期版本） |
