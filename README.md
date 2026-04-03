# Deepdify / BrandCraft

电商 AI 工作台（**Next.js 外壳** + **Dify 工作流**）。治理依据见仓库根目录 **`CONSTITUTION.md`**（含 **附录 C：依赖版本修订记录**）。

## 快速开始

```bash
pnpm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
# 编辑 .env.local：至少配置 DATABASE_URL、DIRECT_URL、AUTH_SECRET、Dify、（可选）Redis
pnpm db:generate
pnpm db:push                   # 开发：将 schema 同步到数据库
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)（默认端口 3000；若被占用，Next 会改用其他端口）。包管理请使用 **pnpm**（与 `packageManager` 字段一致）。

### 环境变量

- 模板见仓库根目录 **`.env.example`**（已纳入版本控制）。
- 本地机密填入 **`.env.local`**（勿提交）。Prisma CLI 通过 `scripts/prisma-env.cjs` 读取 `.env` 与 `.env.local`（后者覆盖前者），与 Next 加载顺序一致。

### 数据库：开发 vs 生产

| 场景 | 命令 | 说明 |
|------|------|------|
| 本地 / 快速迭代 | `pnpm db:push` | 将 `schema.prisma` 推送到当前库（无迁移历史时可用） |
| 生产 / CI | `pnpm db:deploy` | 等价 `prisma migrate deploy`，只应用已有迁移 SQL |

新建迁移（开发机）：`pnpm db:migrate`（`migrate dev`）。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发 |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm db:push` / `pnpm db:deploy` | 开发同步 schema / 生产应用迁移 |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:run` | Vitest |

## 与 `prometheus-ai/` 目录的关系

仓库内可能存在 **`prometheus-ai/`** 子目录（独立 Turborepo 实验或克隆，**不是本应用交付物**）。

- **主产品**为本目录下的 **deepdify** Next 应用（`src/`、`package.json` 于根目录）。
- TypeScript / ESLint 已配置为**不检查** `prometheus-ai`（避免与主项目 Prisma schema 冲突）。
- 长期建议：将 `prometheus-ai` **移出本仓库**或单独远程，以免协作混淆。

## 文档

- **项目上下文卡片**：`PROJECT_CONTEXT_CARD.md`
- **生产部署（Vercel + Neon + Upstash）**：`docs/deployment.md`
- **架构与运维**：`docs/architecture/`、`docs/operations/`
- **Phase 1 接口契约（草案）**：`docs/api/brand-analysis-contract.md`（`/api/ai/brand-analyze` → Dify Workflow）

## 技术栈（摘要）

Next.js **14.2.35**（14.x 补丁线，勿升 15/16）· React 18 · TypeScript strict · NextAuth v5 · Prisma 6 · Zod 4 · Tailwind · shadcn/ui  

细节与版本以 **`package.json`** 与宪法 **附录 C** 为准。
