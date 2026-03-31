# 开发计划（Dev Plan）

> 项目根目录：`deepdify`（BrandCraft / Deepdify Evolution）  
> 阶段锚点：**Phase 1.5 启动**（在 Phase 1 服务端代理 + 品牌页闭环之后，进入文档治理与下一阶段能力规划）

---

## 1. 当前定位

- Phase 1 已具备：**`POST /api/ai/brand-analyze`**（NextAuth v5、`Zod`、内存限流、Dify Workflow 代理）、品牌列表/详情页 **`BrandAiAnalyzePanel`**、契约见 `docs/api/brand-analysis-contract.md`。
- Phase 1.5 重点：**路线图与仓库对齐**、**Dify 端到端验收固化**、**为 Phase 2（用量/持久化/限流生产化）做准备**。

---

## 2. 短期（Phase 1.x，约 1～2 迭代）

| 优先级 | 事项 | 验收 |
|--------|------|------|
| P0 | 用**真实 Dify 工作流**跑通一条端到端（Cloud 或已部署实例） | 可复现的成功调用 + **脱敏响应样例**写入运维/契约附录 |
| P0 | 根据真实 JSON **收紧或确认** `outputs` 解析逻辑（变量名可能与 `result` 不一致） | 代码与文档一致；异常分支有明确错误码 |
| P1 | 同步 **`PROJECT_CONTEXT_CARD.md`** / 宪法附录中的 Phase 与验收项 | 卡片与 `package.json`、主应用路径一致 |
| P1 | 明确**单一主应用**约定：根目录 `src/` 为默认开发目标；`prometheus-ai` 等子树策略写入 README 或 AGENTS | 减少路径与重复实现 |

---

## 3. 中期（Phase 2 方向）

| 领域 | 计划 | 说明 |
|------|------|------|
| 用量与审计 | Prisma `AiUsageLog`（或等价） | 用户、品牌、tokens、时间、可选成本字段；与 Dify 账单对账策略单独定义 |
| 限流生产化 | Redis 或 API 网关限流 | 替换进程内 `Map`；多实例/Serverless 下行为一致 |
| 产品体验 | 分析结果从「JSON 展示」→ **结构化 UI** | 若契约中 `result` 有稳定 schema，可用 Zod 校验后渲染 |
| 密钥与运维 | 密钥仅服务端；日志脱敏 | 轮换流程；禁止在日志中打印完整 Dify 响应或 Key |

---

## 4. 工程与协作约定

1. **契约先行**：新 API 先更新 `docs/api/*` 再改路由。
2. **认证**：服务端统一 `await auth()`（NextAuth v5），不引入 `getServerSession` 与旧版模式。
3. **测试**：关键 Schema 与纯函数优先单测；带 Dify 的集成测试使用 mock，不在仓库中提交真实 Key。
4. **提交粒度**：`feat` / `fix` / `docs` 清晰；大文档与功能代码分 commit（可选）。

---

## 5. 风险与缓解

| 风险 | 缓解 |
|------|------|
| Dify 输出结构变化 | 保留脱敏样例；解析层集中在一个模块并带单测 |
| 文档与代码漂移 | Phase 收口时强制更新 `PROJECT_CONTEXT_CARD` 与本文件 |
| 仓库未跟踪文件混乱 | 梳理 `.gitignore`、是否提交 turbo 缓存、子 monorepo 边界 |
| 密钥泄露 | 轮换 Key；仅 `.env.local` / 部署密钥管理 |

---

## 6. 参考文档

- `docs/PROJECT_MEMORY.md` — 截至当前的状态快照与记忆
- `docs/api/brand-analysis-contract.md` — 品牌分析 API 契约
- `CONSTITUTION.md` / `CONSTITUTION_COMPACT.md` — 宪法与附录 C

---

*本文件随阶段推进更新；冲突时以仓库内最新契约与 `package.json` 为准。*
