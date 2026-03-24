# PROJECT_CONTEXT_CARD.md
## BrandCraft（Deepdify Evolution）项目上下文卡片

═══════════════════════════════════════════════════════════════
一、项目基础信息
═══════════════════════════════════════════════════════════════

项目名称: BrandCraft（品牌工匠）
项目代号: brandcraft-v1
项目路径: D:\cursorpro\deepdify
Git仓库: [待初始化远程仓库]

演进历史:
  - Day 1-4: Deepdify Studio（基础认证与Profile管理）
  - Day 0: Phase 2结案，BrandCraft Phase 1启动（AI集成）

═══════════════════════════════════════════════════════════════
二、当前状态（实时更新）
═══════════════════════════════════════════════════════════════

当前阶段: Phase 0（Day 0）债务清理
当前任务: 登录Bug修复（阻断点解除）
状态: 🟡 进行中（代码已提供，待验证）

最近Git提交:
  - 待提交：登录修复（fetch方案替代signIn）

文件预算: 8/15（剩余7个）
成本消耗: ¥0（未开始AI调用）

阻断点:
  - [ ] 登录修复验证（test@deepdify.com→Dashboard）
  - [ ] Session持久化验证（刷新保持登录）
  - [ ] 反向保护验证（已登录用户访问/login跳转）

下一步（Day 1）:
  1. Dify CE Docker部署（端口3001）
  2. DeepSeek模型配置
  3. 首个API连通测试（浏览器Console→Dify→中文回复）

═══════════════════════════════════════════════════════════════
三、技术环境（精确版本）
═══════════════════════════════════════════════════════════════

操作系统: Windows 11
IDE: VS Code / Cursor
Shell: PowerShell（仅命令，不写复杂代码）
包管理: pnpm

Node.js: 18+
Next.js: 14.2.21（锁定）
TypeScript: 5.x Strict
数据库: Neon Serverless PostgreSQL（新加坡节点）
ORM: Prisma 5.x

AI引擎: Dify CE（待部署）
模型: DeepSeek-V3（默认）/ GPT-4o-mini（标准）/ GPT-4o（高级）

端口占用:
  - 3000: Next.js开发服务器
  - 3001: Dify CE（预留）

═══════════════════════════════════════════════════════════════
四、关键文档位置
═══════════════════════════════════════════════════════════════

宪法（必须加载）:
  - CONSTITUTION.md（完整版）
  - CONSTITUTION_COMPACT.md（AI快速加载版）

架构文档:
  - docs/architecture/SYSTEM_DESIGN.md（系统架构）
  - docs/architecture/ROADMAP_30DAYS.md（30天路线图）
  - docs/decisions/（ADR决策记录）

Dify资产:
  - docs/prompts/（Prompt版本库）
  - docs/tool-evaluation.md（开源工具评估）

运维文档:
  - docs/operations/SOP.md（标准操作流程）
  - BUG_ARCHIVE.md（Bug档案）

═══════════════════════════════════════════════════════════════
五、快速检查清单（遇到问题时）
═══════════════════════════════════════════════════════════════

代码没反应:
  1. cat 文件路径 | findstr "关键词"（确认代码已保存）
  2. VS Code显示白点？→ Ctrl+S保存
  3. pnpm dev是否运行？→ 控制台无报错
  4. 硬刷新：Ctrl+Shift+R

依赖问题:
  1. 删除node_modules：Remove-Item -Recurse -Force node_modules
  2. 重装：pnpm install
  3. 锁定版本检查：package.json中resolvers是否为3.3.4

数据库问题:
  1. 连接测试：npx prisma db pull
  2. 迁移状态：npx prisma migrate status
  3. Studio查看：npx prisma studio

AI不工作:
  1. Dify是否运行？docker compose ps
  2. 端口3001可访问？http://localhost:3001
  3. API Key有效？Dify控制台检查
  4. 查看Network标签：/api/dify请求状态

═══════════════════════════════════════════════════════════════
六、联系人与资源
═══════════════════════════════════════════════════════════════

开发者: 浔真
AI助手: Claude（通过Cursor）
技术顾问: [待补充]

关键资源:
  - Dify文档: https://docs.dify.ai
  - DeepSeek API: https://platform.deepseek.com
  - NextAuth文档: https://authjs.dev
  - shadcn/ui: https://ui.shadcn.com

═══════════════════════════════════════════════════════════════
最后更新: Day 0
更新者: AI助手（基于宪法v3.0）
═══════════════════════════════════════════════════════════════
