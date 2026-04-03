# 部署指南（Vercel + Neon + Upstash）

> 与路线 A Day 2 对齐；域名与项目名请替换为你的实际值。

## 1. 前置条件

- GitHub 仓库已推送当前代码。
- Neon 项目已创建（`DATABASE_URL` pooled + `DIRECT_URL` direct）。
- Dify 工作流 API Key（`DIFY_BRAND_ANALYSIS_KEY`）。
- Upstash Redis（`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`），生产环境**强烈建议**配置，避免多实例内存限流不一致。

## 2. Vercel 项目设置

| 项 | 值 |
|----|-----|
| Framework | Next.js |
| Root Directory | `./` |
| Install Command | `pnpm install` |
| Build Command | `pnpm build`（已含 `prisma generate`） |

无需手动填写 **Output Directory**（默认由 Next 插件处理）。

## 3. 环境变量（Production）

在 Vercel → Project → Settings → Environment Variables 中新增，**全部勾选 Production**（Preview 可按需复制）。

| Name | 说明 |
|------|------|
| `DATABASE_URL` | Neon **Pooled** 连接串 |
| `DIRECT_URL` | Neon **Direct** 连接串（迁移 / Prisma 需要） |
| `NEXTAUTH_URL` | 生产站点 origin，无尾斜杠，如 `https://xxx.vercel.app` |
| `AUTH_SECRET` 或 `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `DIFY_BASE_URL` | 默认 `https://api.dify.ai/v1` |
| `DIFY_BRAND_ANALYSIS_KEY` | Dify App API Key |
| `UPSTASH_REDIS_REST_URL` | Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Token |
| `NEXT_PUBLIC_APP_NAME` | 展示名 |
| `NEXT_PUBLIC_APP_URL` | 与 `NEXTAUTH_URL` 同源的公开 URL |

不要将密钥填入 `NEXT_PUBLIC_*`。

## 4. 生产数据库迁移

Vercel **不会**在构建时自动执行 `migrate deploy`。在首次部署前或 schema 变更后，于本机（或 CI）对**生产库**执行：

```bash
# 将 Neon 生产连接串写入当前 shell 或临时 .env.production（勿提交）
set DATABASE_URL=postgresql://...     # Windows cmd
set DIRECT_URL=postgresql://...
pnpm db:deploy
```

`pnpm db:deploy` 使用 `scripts/prisma-env.cjs`，会读取 `.env` / `.env.local`；若只用环境变量，可：

```bash
npx prisma migrate deploy
```

（需保证 `DATABASE_URL` / `DIRECT_URL` 已在环境中。）

## 5. 部署与验证

1. Push → Vercel 自动构建；检查 Build Logs 无报错。
2. 打开生产 URL：`/`、`/login`、`/register`。
3. 登录 → `/brands` 创建品牌 → 详情页 AI 分析 → 确认 Neon 中 `ai_usage_logs`、`brand_analysis_results` 有数据。
4. 连续触发分析超过 10 次/小时 → 期望 **429**（Redis 已配置时跨实例一致）。
5. `/dashboard/usage` 汇总与列表有数据。

## 6. 常见问题

| 现象 | 处理 |
|------|------|
| 构建报 Prisma Client 未生成 | 已用 `prisma generate && next build`；仍失败则检查 `prisma` 在 dependencies。 |
| 登录后重定向异常 | `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` 必须与浏览器地址栏 origin 一致（含 `https`）。 |
| AI 分析 504 / 超时 | Hobby 函数约 **10s** 上限；`brand-analyze` 已设 `maxDuration = 60`，需 **Vercel Pro** 或缩短 Dify 工作流耗时。 |
| 限流不累计 | 检查 Upstash 变量；未配置时回退内存，多实例下计数不准。 |

## 7. 自定义域名

在 Vercel → Domains 绑定后，将 `NEXTAUTH_URL` 与 `NEXT_PUBLIC_APP_URL` 改为新域名并 **Redeploy**。
