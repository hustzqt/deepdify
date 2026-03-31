# Deepdify Studio — 项目记忆文件

> 用途：跨对话持久化关键决策、教训和状态  
> 规则：每个 Phase 结案时必须更新；每次新对话开始时必须读取  
> 最后更新：2026-03-28

---

## 1. 项目基本信息

| 项 | 值 |
|----|-----|
| 项目名称 | Deepdify Studio |
| 前身 | BrandCraft（已重构整合） |
| 技术栈 | Next.js 14 + Prisma + NextAuth + Tailwind + shadcn/ui |
| AI 基础设施 | Dify Cloud SaaS + DeepSeek API |
| 数据库 | PostgreSQL（本地 Docker / 生产阿里云） |
| 部署目标 | 阿里云 ECS（deepdify.com） |
| 仓库结构 | 单体应用，根目录即主项目（不使用 monorepo） |

---

## 2. 关键决策记录

| 日期 | 决策 | 理由 | 影响范围 |
|------|------|------|----------|
| Phase 1 | Dify Cloud SaaS 而非本地 Docker 部署 | 零运维、快速验证、数据可接受 | AI 工作流、API 调用方式 |
| Phase 1 | DeepSeek 为主模型，预留多模型切换 | 成本最低（约 GPT-4 的 1/50）、中文优秀 | Token 计费、模型配置 |
| Phase 1 | 三层 Token 互验模型（Dify 回报 + 本地估算 + 月底对账） | 平衡精度与开发成本 | 计费系统设计 |
| Phase 1 | 知识库三级结构（L1 平台规则 / L2 行业 / L3 商家私有） | 隔离公共知识与私有数据，支持多租户 | 知识库模型、权限设计 |
| Phase 1 | 不使用 monorepo 分包，主应用即根目录 | 简化构建链，避免 turborepo/workspace 配置开销 | 项目结构、构建、部署 |
| Phase 1 | 开源工具 2 小时标记策略 | 评估超 2 小时未跑通则换方案，不阻塞 MVP | 技术选型流程 |
| Phase 1 | 宪法版本升级至 v0.3.1 + 附录 C 依赖锁定 | 确保依赖版本一致性 | 开发环境稳定性 |

---

## 3. Phase 结案摘要

### Phase 1：项目启动与文档体系（已完成）

**状态**：✅ 已完成

**产出**：

- `CONSTITUTION.md` v0.3.1（含附录 A/B/C）
- `PROJECT_CONTEXT_CARD.md`
- `DEV_PLAN.md`
- `PROJECT_MEMORY.md`（本文件）

**遗留**：

- `pnpm dev` 未验证（Phase 1.5 Day 01 执行）
- Dify Cloud 未注册（Phase 1.5 Day 02 执行）

**教训**：

- 文档先行是正确的，但不能无限延伸文档阶段
- 必须设置硬性截止点进入代码阶段

---

## 4. 技术债务清单

| ID | 描述 | 严重性 | 计划解决 |
|----|------|--------|----------|
| TD-001 | Tailwind bg-opacity 内联样式临时修复 | 低 | Phase 3 |
| TD-002 | prometheus-ai 仓库边界未清理 | 低 | Phase 6 |
| TD-003 | 生产环境日志策略未定义 | 中 | Phase 6 Day 29 |

---

## 5. 资源清单

| 资源 | 状态 | 备注 |
|------|------|------|
| DeepSeek API Key | ✅ 已有 | minimax 账号 |
| 阿里云 ECS | ✅ 已有 | 生产服务器 |
| 域名 deepdify.com | ✅ 已有 | 主域名 |
| 域名 meptai.com | ✅ 已有 | 备用 |
| Docker Desktop | ✅ 本地已装 | Windows |
| Dify Cloud 账号 | ⏳ 待注册 | Phase 1.5 Day 02 |
| Stripe 账号 | ⏳ 待注册 | Phase 5 Day 25 |

---

## 6. 每日状态追踪

| Day | 日期 | 状态 | 关键产出 | 阻塞 |
|-----|------|------|----------|------|
| 01 | - | ⏳ 待开始 | pnpm dev 回归 | - |
| 02 | - | ⏳ 待开始 | Dify Cloud 联通 | - |
| 03 | - | ⏳ 待开始 | 接口契约文档 | - |

（后续每日执行后填入）

---

## 7. 变更日志

| 日期 | 变更内容 |
|------|----------|
| 2026-03-28 | 初始化 PROJECT_MEMORY.md（完整版） |
