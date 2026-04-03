# Day 04 — Phase 2 用量持久化（AiUsageLog）

> 日期：2026-04-03  
> 目标：`AiUsageLog` 模型、`POST /api/ai/brand-analyze` 成功路径写入、`GET /api/ai/usage` 分页查询

---

## 实现摘要

| 项 | 说明 |
|----|------|
| Schema | `AiUsageLog` → `users`（Cascade）、`brands`（SetNull）；`@@map("ai_usage_logs")` |
| 迁移 | `prisma/migrations/20260403120000_add_ai_usage_log/migration.sql` |
| 写入 | `src/app/api/ai/brand-analyze/route.ts` 成功解析 Dify 后写入；`brandId` 仅当属于当前用户时落库 |
| 用量字段 | `src/lib/ai/extract-dify-usage.ts` 从 `data.usage` / `usage` 提取 tokens 与 `total_price` |
| 查询 | `GET /api/ai/usage?page=1&limit=20`（需登录） |

---

## 本机验证清单（请勾选）

| 步骤 | 命令 / 操作 | 结果 |
|------|-------------|------|
| 1 | `pnpm db:push` 或 `pnpm exec prisma migrate deploy` | ⬜ |
| 2 | `pnpm db:generate`（若 EPERM，先关 Node 再试） | ⬜ |
| 3 | 登录后调用一次品牌分析 | ⬜ |
| 4 | `pnpm db:studio` 查看 `ai_usage_logs` 新增一行 | ⬜ |
| 5 | 浏览器 / curl 访问 `GET /api/ai/usage`（带 Cookie） | ⬜ |

---

## 备注

- 限流仍为进程内 Map；生产可换 Redis（后续 Day）。
- Dify 若未返回 `usage`，tokens 可能全为 0，属预期。
