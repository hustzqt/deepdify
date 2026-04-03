# Phase B：生产环境优化（可勾选清单）

> 与 [deployment.md](./deployment.md) 配套；域名与项目名请替换为实际值。  
> 建议顺序：**B1 → B2 → B3 → B4**，间隙可完成「默认展开第一条历史」等小改动（见仓库内 `BrandAnalysisHistory`）。

---

## B1：自定义域名与 HTTPS（Vercel）

| # | 任务 | 验证标准 |
|---|------|----------|
| [ ] 1 | 购买或使用已有域名 | DNS 管理台可添加记录 |
| [ ] 2 | Vercel → Project → Settings → Domains 添加自定义域名 | 状态为 `Valid` |
| [ ] 3 | DNS 添加 CNAME 指向 `cname.vercel-dns.com`（或按 Vercel 提示） | `dig` / 在线 DNS 检测解析生效 |
| [ ] 4 | 等待 SSL 自动颁发 | `https://你的域名` 浏览器显示安全连接 |
| [ ] 5 | 更新环境变量：`NEXTAUTH_URL`、`NEXT_PUBLIC_APP_URL` 为 `https://你的域名`（无尾斜杠） | 登录与回调无 `invalid callback` |
| [ ] 6 | Redeploy 使变量生效 | 新部署成功 |

---

## B2：生产环境变量与数据库核对

| # | 任务 | 验证标准 |
|---|------|----------|
| [ ] 7 | 对生产库执行 `pnpm db:deploy`（或 `prisma migrate deploy`） | 迁移成功、表结构完整 |
| [ ] 8 | 确认 Vercel 中已配置：`DATABASE_URL`、`DIRECT_URL`、`NEXTAUTH_SECRET`（或 `AUTH_SECRET`）、`DIFY_*`、`UPSTASH_*` 等 | 应用可连 DB / Redis |
| [ ] 9 | 在生产域名下走通：登录 → 品牌 → AI 分析 → 用量相关页 | 无意外 500 |

---

## B3：最小可观测性（Sentry + 可选日志）

| # | 任务 | 验证标准 |
|---|------|----------|
| [ ] 10 | 注册 Sentry，创建 Next.js 项目，取得 DSN | Dashboard 可访问 |
| [ ] 11 | `pnpm add @sentry/nextjs` | 安装无报错 |
| [ ] 12 | 运行 `npx @sentry/wizard@latest -i nextjs` 或按文档添加 client/server config、`instrumentation` | 本地构建通过 |
| [ ] 13 | `next.config` 集成 Sentry 插件（若向导已写入则核对） | `pnpm build` 成功 |
| [ ] 14 | （可选）在关键 API 中 `Sentry.captureException` | 测试异常出现在 Sentry |
| [ ] 15 | 部署后触发一次测试错误 | Issue 可见 |
| [ ] 16 | （可选）接入 Logtail / Better Stack 等 + 结构化日志 | 平台可见日志行 |

**说明**：若暂不引入 Sentry，可依赖 Vercel Functions 日志 + 项目内 `[brand-analyze]` 等前缀（见 [deployment.md §8](./deployment.md)）。

---

## B4：上线前安全检查

| # | 任务 | 验证标准 |
|---|------|----------|
| [ ] 17 | 生产不使用本机 `.env.local`；密钥仅在 Vercel 环境变量 | 仓库无密钥提交 |
| [ ] 18 | 未登录访问受保护 API（如 `POST /api/ai/brand-analyze`）返回 **401** | 与预期一致 |
| [ ] 19 | 若有独立前端域，核对 CORS / 同源策略 | 浏览器无意外跨域错误 |
| [ ] 20 | `pnpm audit`，处理高危依赖 | 高危项已处理或已评估 |

---

## 执行顺序建议

1. **B1 + B2**：域名可用、环境变量与 DB 正确。  
2. **B3**：监控上线。  
3. **B4**：加固与审计。  
4. 间隙完成「历史列表默认展开最新一条」等低风险 UI 优化。
