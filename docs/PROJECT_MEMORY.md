# 项目记忆（Project Memory）

> 项目根目录：`deepdify`（BrandCraft / Deepdify Evolution）  
> 快照目的：记录**截至 Phase 1 完成 / Phase 1.5 启动**的目标、交付、环境、过程与问题，供后续迭代对照。

---

## 1. 项目目标（Phase 1 范围内）

| 目标 | 说明 |
|------|------|
| Backend-for-AI | 浏览器不接触 Dify Key；由 Next.js 服务端代理 Dify Workflow |
| 契约一致 | `POST /api/ai/brand-analyze` 与 `docs/api/brand-analysis-contract.md` 对齐；响应 `{ success, data?, error? }` |
| 认证 | 仅登录用户；**NextAuth v5 `auth()`**（不使用 legacy `getServerSession`） |
| 基本治理 | `Zod` 校验、内存限流、超时、错误码与日志 |
| 可演示闭环 | 品牌页可发起分析并展示结果（JSON/后续结构化） |

---

## 2. 已交付结果（仓库）

| 类型 | 路径 / 说明 |
|------|----------------|
| API 路由 | `src/app/api/ai/brand-analyze/route.ts` |
| 校验 | `src/lib/validations/brand-analyze.ts` |
| 单测 | `src/__tests__/brand-analyze-schema.test.ts`（请求体 Schema） |
| 前端面板 | `src/components/brands/BrandAiAnalyzePanel.tsx`（`credentials: 'include'`） |
| 页面 | `src/app/brands/page.tsx`（列表嵌面板）、`src/app/brands/[id]/page.tsx`（详情预填、`brandId`） |
| 主应用位置 | **根目录 `src/`**（非 `prometheus-ai/apps/web`） |

**环境变量（服务端）**：`DIFY_BASE_URL`、`DIFY_BRAND_ANALYSIS_KEY` 或 `DIFY_API_KEY`；仅存 `.env.local` 等已忽略文件。

---

## 3. 关键过程（可复用）

1. 契约先行，再定路径与 Dify 输入映射（`brand_name`、`industry` 等）。
2. 与 `src/lib/auth.ts` 一致使用 **`await auth()`**。
3. 对 Dify 响应使用 `unknown` + 窄化；`outputs` 对 `result` / 单键 / 整包做容错。
4. 浏览器调用使用 **`fetch` + `credentials: 'include'`** 携带 Session Cookie。

---

## 4. 技术环境（摘要）

| 项 | 说明 |
|----|------|
| Node | `>=20`（见 `package.json` engines） |
| Next.js | **14.2.21**（项目约定锁版本） |
| 包管理 | **pnpm@9**（`packageManager` 字段） |
| 数据库 | PostgreSQL + Prisma；品牌模型 `Brand` |
| 认证 | NextAuth v5；JWT Session；开发环境 HTTP cookie 策略见 `auth.ts` |

---

## 5. 已知问题与风险

| 类别 | 内容 |
|------|------|
| 文档漂移 | `PROJECT_CONTEXT_CARD.md` 等若仍写旧 Phase，需与当前能力对齐 |
| 限流 | 进程内 `Map`，多实例不共享；生产需 Redis 或网关 |
| Dify 输出 | 变量名/结构若与假设不一致，需按真实 JSON 调整解析 |
| 用量 | `tokensUsed` 依赖 Dify 返回路径，可能常为 0；Phase 2 定义事实来源 |
| 仓库卫生 | 未跟踪文件、嵌套 monorepo 产物需 `.gitignore` 与边界策略 |
| 安全 | 密钥若曾暴露应轮换；日志避免打印敏感内容 |

---

## 6. 后续方向（摘要，详见 `docs/DEV_PLAN.md`）

- 真实工作流验收 + 脱敏响应样例。  
- `AiUsageLog`、Redis 限流、结果结构化 UI。  
- 文档与卡片同步、主应用路径说明。

---

## 7. 参考索引

- `docs/DEV_PLAN.md` — 开发计划与路线图  
- `docs/api/brand-analysis-contract.md` — API 契约  
- `CONSTITUTION.md` — 项目宪法与附录 C  

---

*本文件为状态快照；不替代宪法与正式契约文档。*
