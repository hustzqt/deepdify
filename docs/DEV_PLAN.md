# Deepdify Studio — SaaS MVP 开发计划

> 宪法约束：CONSTITUTION.md v0.3.1  
> 最后更新：2026-03-28  
> 维护者：浔真 + AI 助手

---

## 0. 元规则

| 编号 | 规则 | 违规处理 |
|------|------|----------|
| M-1 | 每个 Phase 结束必须写结案摘要到 `PROJECT_MEMORY.md` | 阻塞下一 Phase |
| M-2 | 每个 Day 开始前读取 `PROJECT_MEMORY.md` | AI 助手强制执行 |
| M-3 | 任何架构决策变更必须更新 `CONSTITUTION.md` | 变更无效 |
| M-4 | `pnpm dev` 不过 = 当日未完成 | 不得进入下一 Day |
| M-5 | 每日工作量 ≤ 2 小时 | 超量任务顺延 |

---

## 1. Phase 总览

| Phase | 名称 | 天数 | 目标 |
|-------|------|------|------|
| 1.5 | 地基加固 | Day 01-03 | pnpm dev 稳定 + Dify 联通 + 接口契约 |
| 2 | Token 计量 | Day 04-08 | 数据模型 + 中间件 + 仪表盘 |
| 3 | 商品文案工作流 | Day 09-15 | 第一个可交付 AI 功能 |
| 4 | 知识库管理 | Day 16-22 | L1-L3 知识库体系 |
| 5 | 计费与多租户 | Day 23-28 | Stripe + 租户隔离 |
| 6 | 上线准备 | Day 29-35 | 安全审计 + 部署 + 监控 |

---

## 2. Phase 1.5：地基加固（Day 01-03）

### Day 01 —— pnpm dev 回归 + 前端验证

**目标**：确保本地开发环境完全可用

**Task 清单**：

| # | 任务 | 验证标准 |
|---|------|----------|
| 1.1 | 执行 `pnpm install`，解决依赖冲突 | 零报错 |
| 1.2 | 执行 `pnpm dev`，项目启动 | localhost:3000 可访问 |
| 1.3 | 验证登录流程（NextAuth） | 登录后跳转 /dashboard |
| 1.4 | 验证用户资料管理模块 | 资料编辑保存成功 |
| 1.5 | `.env.local` 密钥审计 | 无硬编码密钥，.gitignore 已包含 |
| 1.6 | 提交日报到 `DEV_PLAN.md` 底部 | 格式符合模板 |

**完成定义**：6/6 验证通过，`pnpm dev` 稳定运行 60 秒无崩溃

---

### Day 02 —— Dify Cloud 联通

**目标**：Dify Cloud 注册并创建第一个可调用的工作流

**Task 清单**：

| # | 任务 | 验证标准 |
|---|------|----------|
| 2.1 | 注册 Dify Cloud 账号 | 登录成功 |
| 2.2 | 创建应用"Deepdify-Echo-Test" | 应用出现在列表中 |
| 2.3 | 配置 DeepSeek 作为模型供应商 | API Key 验证通过 |
| 2.4 | 搭建 Echo 工作流（输入→LLM→输出） | Dify 内测试返回结果 |
| 2.5 | 获取 Dify API Key | 记录到 `.env.local` |
| 2.6 | 用 curl 从本地调通 Dify API | 返回 200 + JSON 结果 |

**完成定义**：本地终端 curl 命令成功调用 Dify 并返回 AI 结果

---

### Day 03 —— 接口契约文档 + Phase 1.5 结案

**目标**：定义前后端与 Dify 的接口规范，不写实现代码

**Task 清单**：

| # | 任务 | 验证标准 |
|---|------|----------|
| 3.1 | 编写 `docs/api-contracts/dify-gateway.md` | 包含请求/响应 JSON Schema |
| 3.2 | 编写 `docs/api-contracts/token-logging.md` | 包含 AiUsageLog 字段定义 |
| 3.3 | 编写 `docs/api-contracts/knowledge-base.md` | 包含 L1-L3 知识库接口骨架 |
| 3.4 | 三份契约文档交叉检查一致性 | 字段命名统一、无矛盾 |
| 3.5 | 编写 Phase 1.5 结案摘要 | 写入 `PROJECT_MEMORY.md` |
| 3.6 | 提交所有文档到仓库 | git log 可见 |

**完成定义**：三份接口契约文档已提交，Phase 1.5 结案写入记忆文件

---

## 3. Phase 2：Token 计量（Day 04-08）

### Day 04 —— Prisma AiUsageLog 数据模型

- 设计 `AiUsageLog` schema（userId, workflowId, model, inputTokens, outputTokens, cost, createdAt）
- 执行 `npx prisma migrate dev --name add-ai-usage-log`
- 编写种子脚本 `prisma/seed-usage.ts` 插入 3 条测试数据
- **验证**：✅ `npx prisma studio` 能看到 AiUsageLog 表且有 3 条数据

### Day 05 —— Dify Gateway 后端路由

- 创建 `app/api/ai/gateway/route.ts`
- 实现：接收前端请求 → 调用 Dify API → 返回结果
- 所有请求/响应格式严格遵守 Day 03 定义的契约文档
- **验证**：✅ Postman/curl 调用 `/api/ai/gateway` 返回 AI 结果

### Day 06 —— Token 记录中间件

- 在 Gateway 路由中增加 Token 记录逻辑
- 每次 AI 调用自动写入 `AiUsageLog`
- 从 Dify 响应中提取 `total_tokens`、`total_price`
- **验证**：✅ 调用一次 Gateway 后，`prisma studio` 中新增一条 UsageLog

### Day 07 —— Token 仪表盘前端

- 创建 `/dashboard/usage` 页面
- 调用 `app/api/usage/route.ts` 获取当前用户的 Token 使用记录
- 展示：表格（日期、模型、Token 数、费用）+ 简单汇总
- **验证**：✅ 页面正确显示 Day 04 的种子数据

### Day 08 —— Phase 2 集成测试 + 结案

- 端到端流程：登录 → 调用 AI → 查看 Token 记录
- 修复集成中发现的 bug
- 编写 Phase 2 结案摘要写入 `PROJECT_MEMORY.md`
- **验证**：✅ 完整流程无报错；✅ 结案已提交

---

## 4. Phase 3：商品文案工作流（Day 09-15）

### Day 09 —— Dify 商品文案工作流搭建

- 在 Dify Cloud 创建 "Product-Copywriting" 工作流
- 输入变量：productName, category, targetAudience, platform, tone
- Prompt 工程：针对小红书/淘宝/抖音不同平台的文案模板
- **验证**：✅ Dify 内测试，输入商品信息后输出符合平台风格的文案

### Day 10 —— 文案生成前端页面

- 创建 `/dashboard/copywriting` 页面
- 表单：商品名称、类目、目标人群、平台选择、语气风格
- 调用 Day 05 的 Gateway 路由（传入 workflowId）
- **验证**：✅ 填写表单提交后，页面展示 AI 生成的文案

### Day 11 —— 文案编辑与保存

- 生成结果支持用户在线编辑
- 保存到数据库（新建 `CopywritingRecord` 模型）
- 历史记录列表页
- **验证**：✅ 生成 → 编辑 → 保存 → 历史列表中可见

### Day 12 —— 多平台适配与批量生成

- 一次输入生成多个平台版本（小红书 + 淘宝 + 抖音）
- 结果对比展示（左右/Tab 切换）
- **验证**：✅ 一次提交返回 3 个平台版本文案

### Day 13 —— 小红书图文详情专项

- Dify 工作流增加图文排版建议节点
- 输出包含：标题、正文、标签推荐、配图建议
- 前端以小红书笔记预览样式展示
- **验证**：✅ 输出包含完整的小红书笔记结构

### Day 14 —— 文案质量评分

- Dify 工作流增加质量评分节点（基于 SEO 关键词密度、情感倾向、可读性）
- 前端展示评分雷达图
- **验证**：✅ 每篇文案附带质量评分和改进建议

### Day 15 —— Phase 3 集成测试 + 结案

- 全流程回归测试
- 修复 bug，性能粗测（响应时间 < 30s）
- 编写 Phase 3 结案摘要
- **验证**：✅ 完整流程稳定；✅ 结案已提交

---

## 5. Phase 4：知识库管理（Day 16-22）

### Day 16 —— 知识库数据模型设计

- Prisma schema：KnowledgeBase（L1/L2/L3 层级）、KnowledgeDocument、KnowledgeVersion
- L1 = 平台规则，L2 = 行业知识，L3 = 商家私有数据
- **验证**：✅ 迁移成功；✅ prisma studio 可见三张表

### Day 17 —— 知识库 CRUD 后端

- `/api/knowledge/` 路由组：创建、读取、更新、删除、列表
- 支持按层级（L1/L2/L3）筛选
- **验证**：✅ Postman 完成全部 CRUD 操作

### Day 18 —— 知识库管理前端

- `/dashboard/knowledge` 页面
- 三级 Tab 切换（平台规则 / 行业知识 / 我的数据）
- 文档上传（支持 txt/md/pdf 文本提取）
- **验证**：✅ 上传文档后在对应层级下可见

### Day 19 —— Dify 知识库同步

- 将本地知识库文档同步到 Dify Knowledge Base
- 通过 Dify API 管理 Dataset
- **验证**：✅ 本地上传的文档在 Dify 知识库中可查询到

### Day 20 —— 知识库版本控制

- 文档更新时保留历史版本
- 版本对比查看
- 回滚到指定版本
- **验证**：✅ 更新文档后旧版本可查看；✅ 回滚成功

### Day 21 —— 知识库与文案工作流集成

- 文案生成时可选择引用的知识库
- Dify 工作流增加知识库检索节点
- **验证**：✅ 引用知识库后文案质量/准确性可见提升

### Day 22 —— Phase 4 集成测试 + 结案

- 全流程回归
- 编写 Phase 4 结案摘要
- **验证**：✅ 知识库全链路稳定；✅ 结案已提交

---

## 6. Phase 5：计费与多租户（Day 23-28）

### Day 23 —— 套餐与配额数据模型

- Prisma schema：Plan（套餐）、Subscription（订阅）、UsageQuota（配额）
- 三档套餐：免费（1000 tokens/天）、基础（50000/天）、专业（无限）
- **验证**：✅ 迁移成功；✅ 种子数据包含三档套餐

### Day 24 —— 配额检查中间件

- AI Gateway 路由增加配额前置检查
- 超限时返回 429 + 友好提示
- **验证**：✅ 免费用户超过 1000 tokens 后被拦截

### Day 25 —— Stripe 支付集成

- Stripe Checkout Session 创建
- Webhook 处理支付成功事件
- 支付成功后自动升级套餐
- **验证**：✅ Stripe 测试模式完成一笔支付 → 用户套餐升级

### Day 26 —— 多租户隔离

- 所有数据查询增加 `tenantId` 过滤
- 知识库 L3 层严格租户隔离
- **验证**：✅ 用户 A 看不到用户 B 的数据

### Day 27 —— 用量账单页面

- `/dashboard/billing` 页面
- 当前套餐、本月用量、用量趋势图
- 升级/降级套餐入口
- **验证**：✅ 页面数据与数据库一致

### Day 28 —— Phase 5 集成测试 + 结案

- 计费全流程回归
- 编写 Phase 5 结案摘要
- **验证**：✅ 免费→付费→使用→账单 全链路通过

---

## 7. Phase 6：上线准备（Day 29-35）

### Day 29 —— 安全审计

- 依赖漏洞扫描（`pnpm audit`）
- API 路由鉴权检查（每个路由必须有 session 验证）
- SQL 注入 / XSS 基本防护确认
- **验证**：✅ 审计清单全部通过

### Day 30 —— 阿里云 ECS 部署

- Docker Compose 生产配置
- Nginx 反向代理 + SSL（deepdify.com）
- PostgreSQL 生产数据库配置
- **验证**：✅ https://deepdify.com 可访问登录页

### Day 31 —— CI/CD 流水线

- GitHub Actions：push → lint → build → deploy
- 自动化部署到 ECS
- **验证**：✅ 推送代码后自动部署成功

### Day 32 —— 监控与告警

- 应用健康检查端点 `/api/health`
- 基础错误日志收集（可选：Sentry 免费版）
- Token 消耗异常告警（日用量 > 阈值时通知）
- **验证**：✅ 健康检查返回 200；✅ 模拟异常触发告警

### Day 33 —— 灰度测试

- 邀请 3-5 个测试用户
- 收集反馈清单
- **验证**：✅ 测试用户能完成核心流程

### Day 34 —— Bug 修复 + 优化

- 修复灰度测试发现的问题
- 性能优化（首屏加载、API 响应时间）
- **验证**：✅ 所有 P0/P1 bug 已修复

### Day 35 —— Phase 6 结案 + MVP 发布

- 最终回归测试
- MVP 发布公告
- 编写完整项目回顾
- **验证**：✅ deepdify.com 生产环境稳定运行 24 小时

---

## 8. 日报模板

```
日期：YYYY-MM-DD
Phase：X | Day：XX
今日计划：
- Task X.X 描述
今日完成：
- Task X.X 描述（验证结果）
阻塞问题：（无 / 描述）
明日计划：
- Task X.X 描述
pnpm dev 状态：✅ 通过 / ❌ 失败（原因）
```

---

## 9. 变更日志

| 日期 | 变更内容 | 原因 |
|------|----------|------|
| 2026-03-28 | 初始化 DEV_PLAN.md（完整版） | Phase 1.5 启动 |
