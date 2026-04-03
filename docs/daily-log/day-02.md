# Day 02 — 现有功能回归（Sprint 1）

> 依据：`docs/DEV_PLAN.md` v2 · Sprint 1 Day 02  
> 日期：2026-03-31  
> 执行环境：Windows · 仓库根目录 `deepdify`

---

## 自动化 / 可复现验证（本机已执行）

| ID | 任务 | 结果 | 说明 |
|----|------|------|------|
| 2.1 | 启动开发服务器 | **通过** | `pnpm dev` → Next.js 14.2.21，`Local: http://localhost:3000`，`✓ Ready in ~2.7s`，加载 `.env.local` |
| 2.5 | AI 品牌分析 API（无会话） | **通过（预期行为）** | `POST /api/ai/brand-analyze` 无 Cookie → `401`，body：`{ success: false, error: { code: "UNAUTHORIZED", ... } }` |
| — | 受保护路由（中间件） | **通过** | `GET /dashboard` 无 Cookie → `307`，`Location: /login` |
| — | Vitest | **通过** | `brand-analyze-schema.test.ts`、`register.test.tsx` 共 5 个用例通过 |

---

## 需浏览器人工验收（无法在 CI/助手环境代点）

以下项 **未** 由自动化替代，请你用 **无痕窗口** 或干净配置在本机勾选：

| ID | 任务 | 状态 | 记录栏 |
|----|------|------|--------|
| 2.2 | 注册 → 登录 → 仪表盘 | ⬜ 待人工 | 注：根路径 `/` 当前 **始终** `redirect('/login')`（见 `src/app/page.tsx`）；登录成功后期望进入 `/dashboard`（见登录页逻辑） |
| 2.3 | 品牌 CRUD | ⬜ 待人工 | `/brands`、`/brands/new`、`/brands/[id]` |
| 2.4 | 用户资料（头像/资料） | ⬜ 待人工 | `/profile` 与相关 API |

### 2.5 补充（需登录 Cookie）

带 Session 调用 `POST /api/ai/brand-analyze`（浏览器控制台 `fetch(..., { credentials: 'include' })` 或复制 `next-auth.session-token` 用 curl）以验证 **200 + Dify 成功路径**；需有效 `DIFY_*` 环境变量。

---

## 发现与备注

1. **首页行为**：`/` 固定重定向到 `/login`，不是「未登录显示落地页、已登录进 dashboard」。若产品期望首页分流，属后续 Story，非本次回归失败项。  
2. **Header / 登出**：此前审计已说明 `Header` 未挂载、登出链路为 Supabase vs NextAuth 混用风险；Day 02 若测「登出」，请用 `/api/auth/signout` 或清 Cookie 验证。  
3. **middleware**：`/brands` 不在 matcher 内，未登录可能仍可打开品牌页（若需保护，记入 BACKLOG）。

---

## 结论

- **自动化覆盖范围**：2.1 ✅ · 2.5（匿名）✅ · 中间件与相关单测 ✅  
- **人工清单**：2.2、2.3、2.4、2.5（已登录 + Dify）待你在上表打勾并补一句现象  

---

## 回填区（人工填写）

```
Test 2.2 注册/登录： [ ] 通过 / [ ] 失败 — 备注：
Test 2.3 品牌 CRUD： [ ] 通过 / [ ] 失败 — 备注：
Test 2.4 用户资料： [ ] 通过 / [ ] 失败 — 备注：
Test 2.5 AI（已登录）： [ ] 通过 / [ ] 失败 — 备注：
```
