# PROJECT_CONTEXT_CARD.md
## BrandCraft（Deepdify Evolution）项目上下文卡片

═══════════════════════════════════════════════════════════════
一、项目基础信息
═══════════════════════════════════════════════════════════════

项目名称: BrandCraft（品牌工匠）
项目代号: brandcraft-v1
项目路径: D:\cursorpro\deepdify
Git仓库: [待初始化远程仓库]

演进历史:
  - Day 1-4: Deepdify Studio（基础认证与 Profile 管理）
  - Day 0: Phase 2 结案，BrandCraft Phase 1 启动（AI 集成）
  - 2026-03: **Phase 0.8** — 文档与依赖对齐、工程基线（tsc/ESLint/Vitest）就绪

**Phase 0.8 定义（本阶段收口标准）**：
  - 宪法 **附录 C** 与 `package.json` 一致
  - 本卡片与仓库状态同步
  - 主应用可回归：登录 → 品牌列表/创建（按当前功能范围）
  - Phase 1 前：**Dify 侧至少 1 条工作流可演示**（Cloud 或自建，以路线图为准）

═══════════════════════════════════════════════════════════════
二、当前状态（实时更新）
═══════════════════════════════════════════════════════════════

当前阶段: **Phase 0.8**（Phase 0 收尾 → Phase 1 启动前）
当前任务: 文档治理 + Dify 首次贯通准备（见宪法与路线图）
状态: 🟡 工程基线已建立；**Dify 端到端与商业验证待闭环**

最近Git提交:
  - 以仓库 `git log` 为准（卡片不逐条同步，避免漂移）

文件预算: 以宪法「15 文件硬限制」为准；实际代码量已增长，**需定期人工对照宪法第四章**

成本消耗: ¥0（未开始生产级 AI 调用计费）

阻断点 / 验收:
  - [ ] Phase 1：**Dify Cloud（或等价）首个工作流跑通**
  - [ ] **Session → `/api/dify`（或未来 `/api/ai/*`）代理设计落地**（仅服务端密钥）
  - [ ] **品牌上下文 → AI**：Phase 1 MVP 可采用 Prompt 注入（见架构评审结论）
  - [ ] 宪法附录 C 已读且依赖无盲区

下一步（Phase 1.0 方向）:
  1. Dify 侧：注册/部署 + 模型与工作流
  2. Next：认证 + 代理路由 + 限流/用量占位（与宪法 §2.2 响应格式一致）
  3. 可选：本地 Dify CE（资源见运维评估，2C2G ECS 不足以跑全套）

═══════════════════════════════════════════════════════════════
三、技术环境（精确版本 — 以 package.json 为准）
═══════════════════════════════════════════════════════════════

操作系统: Windows 11
IDE: VS Code / Cursor
Shell: PowerShell（仅命令，不写复杂代码）
包管理: **pnpm@9**（见 `packageManager` 字段；**勿与 npm/yarn 混用**）

Node.js: **>=20**（engines）
Next.js: **14.2.35**（14.x 补丁线，禁止升 15/16）
TypeScript: 5.x Strict
数据库: Neon Serverless PostgreSQL（新加坡节点）或开发用本地/Compose PG
ORM: **Prisma ^6**（见宪法 **附录 C**）

验证栈: **Zod ^4**、**@hookform/resolvers ^5**（与附录 C 一致）

AI引擎: Dify（Cloud 优先于 MVP；CE Docker 见资源评估）
模型: 以 Dify 控制台与宪法 **附录 B** 逻辑别名为准

端口占用:
  - 3000: Next.js 开发服务器
  - 3001: Dify（若本地 Compose，按 `dify` 文档）

═══════════════════════════════════════════════════════════════
四、关键文档位置
═══════════════════════════════════════════════════════════════

宪法（必须加载）:
  - CONSTITUTION.md（完整版，含 **附录 C 版本修订**）
  - CONSTITUTION_COMPACT.md（AI 快速加载版 — 精简条可能与附录 C 不完全同步，**冲突时以完整版 + package.json 为准**）

架构文档:
  - docs/architecture/MODEL_ROUTING.md（模型路由：IDE 分层与升级）
  - docs/architecture/SYSTEM_DESIGN.md（系统架构）
  - docs/architecture/ROADMAP_30DAYS.md（30天路线图）
  - docs/decisions/（ADR 决策记录）

Dify资产:
  - docs/prompts/（Prompt 版本库）
  - docs/tool-evaluation.md（开源工具评估）
  - docs/operations/dify-api-fill-in.md（Dify API 与环境填写）

运维文档:
  - docs/operations/SOP.md（标准操作流程）
  - BUG_ARCHIVE.md（Bug 档案）

API 契约（Phase 1 草案）:
  - docs/api/brand-analysis-contract.md（`/api/ai/brand-analyze`）
  - KNOWN_ISSUES.md（回归与依赖清理说明）

═══════════════════════════════════════════════════════════════
五、快速检查清单（遇到问题时）
═══════════════════════════════════════════════════════════════

代码没反应:
  1. 确认文件已保存
  2. `pnpm dev` 是否运行、控制台无报错
  3. 硬刷新：Ctrl+Shift+R

依赖问题:
  1. 删除 node_modules：`Remove-Item -Recurse -Force node_modules`（PowerShell）
  2. 重装：`pnpm install`
  3. 版本以 **package.json + 宪法附录 C** 为准（勿死记旧版 resolvers 3.3.4）

数据库问题:
  1. 连接：`npx prisma db pull`（慎用，会改 schema）
  2. 迁移：`npx prisma migrate status`
  3. Studio：`npx prisma studio`

AI 不工作:
  1. Dify 是否可用（Cloud 控制台或本地 `docker compose ps`）
  2. `DIFY_BASE_URL` / `DIFY_API_KEY` 是否与 `src/lib/dify.ts` 约定一致
  3. Network：`/api/dify` 或后续 `/api/ai/*` 状态码与响应体

═══════════════════════════════════════════════════════════════
六、联系人与资源
═══════════════════════════════════════════════════════════════

开发者: 浔真
AI助手: Claude（通过 Cursor）
技术顾问: [待补充]

关键资源:
  - Dify 文档: https://docs.dify.ai
  - DeepSeek API: https://platform.deepseek.com
  - NextAuth 文档: https://authjs.dev
  - shadcn/ui: https://ui.shadcn.com

═══════════════════════════════════════════════════════════════
最后更新: 2026-03（Phase 0.8 文档对齐）
更新者: 项目组（依据评估报告修订）
═══════════════════════════════════════════════════════════════
