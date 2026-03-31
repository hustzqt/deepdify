# Deepdify / BrandCraft

电商 AI 工作台（**Next.js 外壳** + **Dify 工作流**）。治理依据见仓库根目录 **`CONSTITUTION.md`**（含 **附录 C：依赖版本修订记录**）。

## 快速开始

```bash
pnpm install
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。包管理请使用 **pnpm**（与 `packageManager` 字段一致）。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发 |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:run` | Vitest |

## 与 `prometheus-ai/` 目录的关系

仓库内可能存在 **`prometheus-ai/`** 子目录（独立 Turborepo 实验或克隆，**不是本应用交付物**）。

- **主产品**为本目录下的 **deepdify** Next 应用（`src/`、`package.json` 于根目录）。
- TypeScript / ESLint 已配置为**不检查** `prometheus-ai`（避免与主项目 Prisma schema 冲突）。
- 长期建议：将 `prometheus-ai` **移出本仓库**或单独远程，以免协作混淆。

## 文档

- **项目上下文卡片**：`PROJECT_CONTEXT_CARD.md`
- **架构与运维**：`docs/architecture/`、`docs/operations/`
- **Phase 1 接口契约（草案）**：`docs/api/brand-analysis-contract.md`（`/api/ai/brand-analyze` → Dify Workflow）

## 技术栈（摘要）

Next.js **14.2.21** · React 18 · TypeScript strict · NextAuth v5 · Prisma 6 · Zod 4 · Tailwind · shadcn/ui  

细节与版本以 **`package.json`** 与宪法 **附录 C** 为准。
