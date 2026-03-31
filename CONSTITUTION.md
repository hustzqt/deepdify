# 《BrandCraft 电商AI工作室 开发宪法》v3.0
## Deepdify Evolution Constitution

> **生效日期**：Phase 2 结案日（Day 0）
> **项目状态**：BrandCraft Phase 1 启动（Dify集成阶段）
> **架构模式**：Dify-Core Hybrid（AI引擎70% + Next.js外壳30%）
> **核心约束**：零代码优先（AI逻辑全部在Dify配置，禁止在Next.js中写AI业务逻辑）

═══════════════════════════════════════════════════════════════════
第一章：项目身份与演进历史
═══════════════════════════════════════════════════════════════════

1.1 项目谱系
-----------
前身：Deepdify Studio（Day 1-4）
  └─ M1: 认证系统（NextAuth v5 + Prisma + Neon PG）
  └─ M2: 仪表盘框架（Layout + Sidebar + Profile管理）
  └─ 阻断点：登录Bug（signIn()不触发请求，已修复）

演进：BrandCraft（Day 0+）
  ├─ 保留：全部Deepdify代码资产（认证、数据库、UI组件）
  ├─ 新增：Dify CE AI引擎（Docker部署，Workflow编排）
  ├─ 新增：品牌管理模块（Brand/Product模型）
  ├─ 新增：AI创作工作台（Studio）
  └─ 目标：电商专属的AI文案助手（小红书/公众号/商品详情）

1.2 当前阶段定位
---------------
Phase 0（Day 0）：登录Bug修复与债务清理 ✅ 进行中
Phase 1（Day 1-7）：Dify集成与品牌知识库
Phase 2（Day 8-14）：AI Workflow核心（小红书生成器）
Phase 3（Day 15-21）：多平台适配与商业化准备
Phase 4（Day 22-30）：上线获客与迭代

═══════════════════════════════════════════════════════════════════
第二章：技术栈铁律（绝对锁定）
═══════════════════════════════════════════════════════════════════

2.1 前端层（Next.js外壳 30%）
----------------------------
框架：        Next.js 14.2.21（App Router）⚠️ 禁止升级到15/16
语言：        TypeScript 5.x（Strict Mode: true, noImplicitAny: true）
UI库：        shadcn/ui + Tailwind CSS（现有组件100%复用）
状态管理：    Zustand（轻量，禁止Redux/MobX）
表单：        React Hook Form 7.51.0（版本锁定）
验证：        Zod **^4.x**（历史「3.22.4」以 **附录 C** 为准）
验证桥接：    @hookform/resolvers **^5.x**（与 Zod 4 配套；历史「3.3.4」见 **附录 C**；⚠️ 禁止盲升 major、未回归即 latest）
认证：        NextAuth.js v5（Auth.js）- 修复后版本

2.2 API层（粘合层 30%）
----------------------
运行时：      Next.js API Routes（Edge Runtime禁止，用Node.js）
代理模式：    Backend-for-AI（禁止前端直接调用Dify/OpenAI）
错误处理：    三级降级（L1超时/L2服务不可用/L3经济模式）
数据格式：    { success: boolean, data?: T, error?: { code, message } }

2.3 AI层（Dify核心 70%）
-----------------------
编排工具：    Dify Community Edition（Docker部署，禁用遥测；遥测与出境要求见第八章）。

模型策略（原则，不锁死厂商版本号）：
  - **成本与质量分档**：默认档偏成本、标准档偏质量、关键路径偏稳定与可审计；具体 token 单价与盈亏参考 **第六章**。
  - **逻辑别名（实现时在 Dify / 映射表中绑定真实 model id；附录B 多行、可并行）**：
      • **deepseek-default** — 默认/成本优先  
      • **kimi-2.5**（或 **moonshot-kimi**）— 标准档 **中文 / 国内电商主路径**（通常作为主用；**纳入预算与 SLA 前须小样本实测**）  
      • **gpt-4o-mini** — 标准档 **英文 / 国际化 / 工具链**；与 Kimi **非二选一**，由 Workflow **条件分支**（语言、业务线、失败回退）与 **监控** 选用或互为备份  
      • **gpt-5.3-codex** — 关键路径（发布、迁移、支付、核心逻辑）及开发侧强推理；**以各供应商控制台实际 API / model id 为准**。
  - **映射维护**：逻辑别名 → 供应商与 model id 的对照表见 **附录B**（含标准档双轨）；变更时只更新映射与 Dify 控制台，不修改宪法条款编号。

  **开发工具链补充**（IDE/自动化与升级策略，与用户侧 Dify Workflow 区分）：
  - 失败触发升级、每请求 max_tokens、每任务 max_cost、每次最多 **2** 跳升级等，以 **docs/architecture/MODEL_ROUTING.md** 为准；与 **§2.2** Backend-for-AI、**§3.3** 故障降级、**第六章** 成本护栏一致执行。

知识库：      Dify Knowledge Base（品牌文档分段存储）
Workflow：    Chatflow/Workflow DSL（零代码编排）；模型切换用**条件节点**（如语言=zh→Kimi、en→GPT-4o-mini，或超时/校验失败→备份模型），绑定 **附录B** 别名；配合 **监控**（延迟、错误率、结构化输出失败率）再调路由。

2.4 数据层
----------
主数据库：    Neon Serverless PostgreSQL（新加坡节点）
ORM：         Prisma（当前 **^6.x**；历史条文「5.x」以 **附录 C** 与 `package.json` 为准；禁止原生 SQL，禁止其他 ORM）
缓存：        无（MVP阶段禁用Redis，避免复杂度）
文件存储：    本地public/uploads（MVP）→ 后续迁移S3

2.5 基础设施
------------
开发环境：    Windows 11 + PowerShell + VS Code/Cursor
包管理：      pnpm（禁止npm/yarn混用）
部署：        Vercel（Next.js）+ 云服务器Docker（Dify）
监控：        Console.log（MVP）→ 后续Sentry（P1）

2.6 禁止清单（FORBIDDEN LIST）
-----------------------------
❌ 禁止升级Next.js到15/16（已验证与@hookform/resolvers冲突）
❌ 禁止升级@hookform/resolvers到latest（TypeError灾难）
❌ 禁止在前端直接调用AI API（必须使用Backend-for-AI模式）
❌ 禁止在Next.js中写AI业务逻辑（全部移到Dify Workflow）
❌ 禁止引入新ORM（Prisma唯一合法）
❌ 禁止在生产环境使用Prisma db push（必须用migrate）
❌ 禁止PowerShell写入复杂代码（字符转义问题，仅用于命令）
❌ 禁止超过15个核心运行时文件（逼迫合并与简化）
❌ 禁止在Workflow中使用未经验证的第三方API（安全风险）

═══════════════════════════════════════════════════════════════════
第三章：架构原则（零代码优先）
═══════════════════════════════════════════════════════════════════

3.1 零代码边界定义
-----------------
必须在Dify中实现的（零代码）：
  ✓ Prompt模板设计与版本管理
  ✓ Workflow分支逻辑（if/else/switch）
  ✓ 知识库检索策略（RAG配置）
  ✓ 模型切换逻辑（条件节点）
  ✓ 多轮对话状态管理

必须在Next.js中实现的（代码）：
  ✓ 用户认证与Session管理
  ✓ API路由代理与错误包装
  ✓ Token计量与成本熔断
  ✓ 数据库CRUD（Brand/Product/User）
  ✓ UI组件渲染与表单验证

3.2 文件数预算管理（15文件硬限制）
----------------------------------
核心运行时文件清单（当前状态）：

已有文件（8个）：
  1. src/app/api/auth/[...nextauth]/route.ts      [M1遗产]
  2. src/app/api/auth/register/route.ts           [M1遗产]
  3. src/app/api/user/profile/route.ts            [M4遗产]
  4. src/app/api/user/avatar/route.ts             [M4遗产]
  5. src/middleware.ts                             [M1遗产]
  6. src/lib/auth.ts                               [M1遗产]
  7. src/lib/prisma.ts                             [基础设施]
  8. src/app/api/dify/route.ts                    [新增，Dify代理]

预留文件（7个余额）：
  9. src/app/api/brands/route.ts                  [品牌CRUD]
  10. src/app/studio/page.tsx                     [创作工作台]
  11. src/app/brands/page.tsx                     [品牌管理页]
  12. src/lib/cost-tracker.ts                     [Token计量]
  13. src/components/studio/generator-form.tsx    [Studio组件]
  14. src/app/api/products/route.ts               [产品CRUD（P1）]
  15. [保留应急额度]

文件合并策略：
  - API路由尽量合并（如dify/route.ts统一处理所有AI调用）
  - 页面组件超过200行必须拆分，但拆分为子组件不计入15限制
  - 工具函数库（lib/）合并到单个文件（如utils.ts）

3.3 故障降级策略（L1/L2/L3）
---------------------------
L1（超时）：Dify API超过30秒
  → 返回：{ error: '⏳ AI响应超时，请稍后重试', fallback: true }
  → 前端：显示重试按钮，不计费

L2（服务不可用）：Dify服务宕机或配置错误
  → 返回：{ error: '🔧 AI服务维护中，请10分钟后重试', fallback: true }
  → 前端：显示维护页面

L3（成本熔断）：日费用超过¥50硬上限
  → 自动切换：所有用户强制使用DeepSeek-V3（最低成本）
  → 通知：控制台告警，次日恢复

═══════════════════════════════════════════════════════════════════
第四章：开发路线图与里程碑
═══════════════════════════════════════════════════════════════════

4.1 Phase 0：债务清理（Day 0）✅ 当前
--------------------------------------
目标：解除阻断点，确保基础稳固
交付物：
  - 登录Bug修复（绕过signIn，使用fetch直接调用）
  - Git标签：phase2-complete
验收标准：
  - [ ] test@deepdify.com可登录并跳转Dashboard
  - [ ] 刷新后Session保持
  - [ ] 错误密码显示友好提示

4.2 Phase 1：Dify集成（Day 1-7）
--------------------------------
Day 1：Dify CE部署与首个API连通
  - Docker部署Dify（端口3001）
  - 配置DeepSeek模型
  - 实现/api/dify/route.ts（含降级逻辑）
  - 测试：浏览器Console调用→返回中文回复

Day 2-3：品牌知识库搭建
  - Prisma迁移：添加Brand/Product模型
  - Dify KB配置：平台级知识库（小红书规范）
  - 实现/api/brands/route.ts（CRUD）
  - 实现/brands/page.tsx（品牌管理UI）

Day 4-5：首个Workflow（小红书生成器）
  - Dify内创建WF-001-小红书文案生成
  - Prompt工程：测评风/分享风/教程风
  - 知识库检索节点（品牌调性注入）
  - 图片关键词推荐节点（代码节点）

Day 6-7：Studio创作台
  - 实现/studio/page.tsx
  - 流程：选择品牌→选择风格→生成→展示结果
  - 结果编辑功能（简单文本编辑）
  - 历史记录查看（调用Dify对话历史API）

4.3 Phase 2：AI核心能力（Day 8-14）
------------------------------------
Week 2目标：验证AI生成质量，招募种子用户
- Day 8-9：Prompt优化（v1.0→v1.1）
  - 5个测试用例门禁（正常/空输入/超长/特殊字符/模型降级）
  - A/B测试不同Prompt效果
  
- Day 10：开源工具快速评估（2小时）
  - UIUXProMax（30分钟）
  - Deerflow（30分钟）
  - 记录到docs/tool-evaluation.md
  - 决策：Go/No-Go（MVP阶段不集成，标记为P2）

- Day 11-12：公众号Workflow（WF-002）
  - 复制WF-001结构，修改Prompt为长文风格
  - Studio增加平台选择器（小红书/公众号）

- Day 13-14：商品卖点提炼（WF-003）
  - 输入产品信息→输出5个卖点
  - 可作为其他Workflow前置步骤

4.4 Phase 3：商业化准备（Day 15-21）
-------------------------------------
- Day 15-17：用量控制与付费系统
  - middleware.ts扩展：每日调用限制（免费10次/天）
  - cost-tracker.ts：日预算熔断（¥50）
  - 面包多/爱发电集成（激活码模式）

- Day 18-19：部署与监控
  - 云服务器部署Dify（生产环境）
  - Vercel部署Next.js（生产环境）
  - 域名配置（deepdify.com备案完成后）

- Day 20-21：种子用户测试
  - 招募3个电商运营朋友
  - 收集反馈，修复体验Bug
  - 不开发新功能，只优化现有Workflow

4.5 Phase 4：上线获客（Day 22-30）
-----------------------------------
- Day 22-24：SEO与内容营销
  - 基础SEO配置（title/description/结构化数据）
  - 用自己产品生成小红书内容作为案例（吃狗粮）
  
- Day 25-27：发布获客
  - V2EX发布（技术+产品板块）
  - 即刻（电商/AI圈子）
  - 小红书（电商运营话题）
  
- Day 28-30：数据验证与迭代
  - 目标：30注册用户，5个付费转化
  - 成本核算：验证¥29/月定价可行性
  - 决策：是否继续投入（Go/No-Go）

═══════════════════════════════════════════════════════════════════
第五章：编码规范与质量标准
═══════════════════════════════════════════════════════════════════

5.1 TypeScript严格规范
---------------------
- 禁止any类型（全局禁用）
- 禁止@ts-ignore（必须用@ts-expect-error并说明理由）
- 所有函数必须显式返回类型
- 所有组件Props必须定义Interface（禁止内联类型）
- 数组操作优先使用map/filter/reduce（禁止for循环堆砌）

5.2 组件设计原则
---------------
单一职责：一个组件只做一件事
  - 超过200行必须拆分
  - 拆分为子组件不计入15文件限制
  
命名规范：
  - 文件：kebab-case（dify-client.ts）
  - 组件：PascalCase（StudioPage.tsx）
  - 函数：camelCase（generateContent）
  - 常量：SCREAMING_SNAKE（API_BASE_URL）
  
状态管理：
  - 服务端状态：SWR（轻量，禁止React Query）
  - 客户端状态：Zustand（简单store）
  - 表单状态：React Hook Form（严格受控）

5.3 API设计规范
---------------
请求格式：
  POST /api/resource
  Content-Type: application/json
  Body: { field: string }

响应格式（强制统一）：
  // 成功
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "total": 100 } // 可选
  }
  
  // 失败
  {
    "success": false,
    "error": {
      "code": "AUTH_INVALID", // 机器可读
      "message": "邮箱或密码错误" // 人类可读
    }
  }

HTTP状态码：
  200：成功（GET/PUT/PATCH）
  201：创建成功（POST）
  204：删除成功（DELETE）
  400：请求参数错误（Zod验证失败）
  401：未认证（未登录）
  403：无权限（已登录但无访问权）
  404：资源不存在
  429：请求过于频繁（限流）
  500：服务器内部错误（必须记录日志）

5.4 错误处理完整性
-----------------
所有async函数必须try-catch：
  try {
    // 业务逻辑
  } catch (error) {
    // 1. 记录日志（console.error或后续Sentry）
    // 2. 返回友好错误（不要暴露内部细节）
    return Response.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: '服务器繁忙' } },
      { status: 500 }
    )
  }

UI必须三态：
  - Loading：Skeleton或Spinner
  - Success：数据展示
  - Error：错误提示+重试按钮
  - Empty：空状态引导（如"暂无品牌，点击创建"）

5.5 数据库操作规范
-----------------
- 所有查询必须通过Prisma（禁止原生SQL）
- 列表查询必须分页（默认pageSize=20，最大100）
- 删除默认软删除（deletedAt字段，物理删除需人工确认）
- 关联查询必须select字段（禁止select *）
- 敏感字段（password）默认排除（使用Prisma omit）

═══════════════════════════════════════════════════════════════════
第六章：成本控制与商业可持续性
═══════════════════════════════════════════════════════════════════

6.1 Token成本模型（人民币）
---------------------------
DeepSeek-V3：    Input ¥0.002/1K | Output ¥0.008/1K  （默认）
GPT-4o-mini：    Input ¥0.015/1K | Output ¥0.06/1K  （标准档·**英文/国际化/工具链**并行路径，见附录B）
Kimi（Moonshot）： 以供应商当期报价为准（标准档·**中文/国内电商**主路径，**与 4o-mini 并行**；**写入 SLA 与预算前须完成 A/B 实测**）
GPT-4o：         Input ¥0.18/1K  | Output ¥0.72/1K  （高级）
Claude-3.5：     Input ¥0.216/1K | Output ¥1.08/1K （高级）

单次调用成本估算（小红书生成，约2000 tokens）：
  DeepSeek：     (500×0.002 + 1500×0.008)/1000 = ¥0.013
  GPT-4o-mini：  (500×0.015 + 1500×0.06)/1000 = ¥0.0975
  GPT-4o：       (500×0.18 + 1500×0.72)/1000 = ¥1.17

6.2 预算熔断机制
----------------
日预算硬上限：¥50
  - 达到80%（¥40）：控制台警告，发送通知
  - 达到100%（¥50）：自动切换所有用户到DeepSeek-V3
  - 超过¥50：拒绝服务（返回L3降级），次日零点恢复

月度预算软上限：¥1,500
  - 超过时人工审查：是否被攻击/滥用，是否调整定价

6.3 定价策略（MVP）
-------------------
免费版：
  - 10次/天
  - 仅DeepSeek-V3
  - 基础功能（小红书/公众号/卖点）

基础版：¥29/月
  - 100次/天
  - 可选GPT-4o-mini
  - 全部功能

专业版：¥99/月
  - 无限次（硬上限1000次/天防滥用）
  - 可选GPT-4o/Claude-3.5
  - DALL-E 3配图（即将推出）

成本盈亏平衡点（单用户）：
  基础版：¥29收入 vs ¥3成本（100次×¥0.03平均）= 毛利¥26（90%）
  专业版：¥99收入 vs ¥30成本（考虑GPT-4o usage）= 毛利¥69（70%）

═══════════════════════════════════════════════════════════════════
第七章：AI协作规范（人机协作）
═══════════════════════════════════════════════════════════════════

7.1 AI Agent上下文加载
----------------------
每次新对话必须加载：
  1. CONSTITUTION_COMPACT.md（精简版宪法）
  2. PROJECT_CONTEXT_CARD.md（当前状态卡片）
  3. 相关ADR决策记录（如涉及架构变更）

AI确认语：
  "已加载BrandCraft宪法v3.0，理解当前阶段为[Phase X Day Y]，
   阻断点为[如有]，将严格遵守技术栈锁定（Next.js 14.2.21, resolvers 3.3.4），
   剩余文件预算[X/15]。"

7.2 编码前Checklist
------------------
- [ ] 确认当前所属模块（M1-M7）与Phase
- [ ] 确认当前阻断点是否与本次任务相关
- [ ] 列出将要修改的文件（检查15文件预算）
- [ ] 检查禁止清单（FORBIDDEN LIST）
- [ ] 预估Token成本（如涉及AI调用）

7.3 编码中规范
--------------
- 所有代码直接在回复中给出（由人类复制到VS Code）
- 禁止让PowerShell写入复杂代码（简单cat/findstr可以）
- 修改前用注释标注：// Module: MX_XXX, Func: XXX
- 复杂逻辑必须加行内注释（为什么，而非做什么）
- 每50行代码必须有一次人工确认（避免方向偏差）

7.4 编码后交付格式
------------------
## CHECKPOINT
- 完成了什么：[具体功能描述]
- 修改了哪些文件：[完整路径列表]
- 文件预算状态：[当前使用/15]
- 验证方法：[如何确认功能正常，含测试命令]
- 如果失败：[回退方案或排查步骤]
- 下一步：[接下来做什么]

7.5 冲突解决
------------
当AI经验与宪法冲突时：
  - 宪法优先级高于AI经验
  - AI可提出建议，但必须标注"[建议：需人类确认]"
  - 人类明确指令时，AI必须执行（即使违背经验）

7.6 模型路由规则与 API 配置（人机协作 + Backend-for-AI）
------------------------------------------------------
7.6.1 文档位置
  - 详细规则（任务分档、fallback 链、失败升级条件、成本护栏）见：
    **`docs/architecture/MODEL_ROUTING.md`**
  - 与第二章「模型策略」关系：第二章与 **附录B** 定义 **产品侧**（含标准档 **Kimi + GPT-4o-mini 双轨**、条件分支与监控）；`MODEL_ROUTING.md` 定义 **开发工具链**（IDE/Agent 分层与升级），二者互补，不冲突。

7.6.2 三层边界（必须遵守）
  1. **用户浏览器**：只调用本应用同源 API（如 `POST /api/dify`），**禁止**暴露 Dify Key 或直连 OpenAI/DeepSeek。
  2. **Next.js API Route**：`src/app/api/dify/route.ts` 等作为 **Backend-for-AI**，用服务端环境变量读取 `DIFY_API_KEY`，转发请求。
  3. **Dify CE**：Workflow、知识库、模型切换在 **Dify 控制台** 配置（零代码优先，见第三章）。

7.6.3 环境变量（与附录一致，开发时逐项核对）
  - `DIFY_BASE_URL`：Dify 开放 API 根路径，须以 **`/v1`** 结尾（示例：`http://localhost/v1` 或 `http://localhost:3001/v1`，以实际 Docker/Nginx 为准）。
  - `DIFY_API_KEY`：在 Dify 控制台「应用 / API 密钥」创建，格式多为 `app-...`。
  - 若旧配置使用 `DIFY_API_BASE_URL`，与 `DIFY_BASE_URL` **同义**，项目代码以 **`DIFY_BASE_URL`** 为准（见 `src/lib/dify.ts`），两者择一即可、须同值。

7.6.4 首次接通检查清单（建议顺序）
  - [ ] Dify CE 已启动，浏览器可打开控制台，模型供应商已配置（如 DeepSeek API Key）。
  - [ ] `.env` / `.env.local` 已写入 `DIFY_BASE_URL`、`DIFY_API_KEY`，**重启** `pnpm dev`。
  - [ ] 用户已登录（Session 有效），在浏览器 **Console** 对同源执行 `POST /api/dify` 测试（见 `PROJECT_CONTEXT_CARD.md` 快速检查）。
  - [ ] 若 401：检查 `auth()` 与 Cookie；若 5xx：检查 Dify 地址、Key、应用是否发布 Chatflow。

7.6.5 与「模型路由」的衔接
  - **IDE/Agent**（Cursor 等）按 `MODEL_ROUTING.md` 选择便宜→贵的模型；**应用内用户**不经过该文件，仅经过 **Dify Workflow** 内配置的模型与条件节点。
  - 生产「成本熔断」与「日预算」仍以 **第六章** 与 **L3 降级** 为准；`MODEL_ROUTING.md` 中的 **每任务 max_cost、最多 2 跳升级** 主要针对 **开发自动化**，可在后续接入 `cost-tracker.ts` 时对齐。

═══════════════════════════════════════════════════════════════════
第八章：数据安全与隐私（宪法第25条）
═══════════════════════════════════════════════════════════════════

8.1 数据主权
------------
- 用户品牌信息、产品数据、销售数据归属用户
- 禁止用于训练公开模型（包括OpenAI/Claude的基础模型）
- Dify必须部署CE私有版本（禁止Cloud版，避免数据出境）

8.2 技术措施
------------
- Dify配置：DISABLE_TELEMETRY=true（禁用遥测）
- Prompt标注：敏感数据段落添加指令"此为用户私有信息，不可记忆或复用"
- 传输加密：HTTPS强制（生产环境）
- 存储加密：Neon PostgreSQL默认加密

8.3 合规红线
------------
- 未经用户明确授权，不得将生成内容用于案例展示
- 不得保留用户知识库副本（仅Dify内部索引）
- 用户删除账户时，级联删除所有关联数据（Prisma onDelete: Cascade）

═══════════════════════════════════════════════════════════════════
第九章：版本控制与备份
═══════════════════════════════════════════════════════════════════

9.1 Git规范
-----------
提交信息格式：
  type(scope): subject
  
  type:
    feat: 新功能
    fix: 修复
    docs: 文档
    refactor: 重构
    chore: 杂项
    
  scope: 模块名（auth/brand/studio/dify）
  
  示例：feat(studio): 增加小红书生成器Workflow调用

分支策略（简化版）：
  main: 生产分支（保护）
  develop: 开发分支（日常）
  feature/X: 功能分支（短期）

9.2 Dify配置版本控制
--------------------
- 每次Workflow修改后导出YAML备份到`docs/prompts/`
- 命名：WF-001-v1.0-小红书文案生成-20250115.yml
- 变更日志：记录修改原因、修改前后对比、测试评分
- 回滚机制：保留最近3个版本，紧急时可5分钟回滚

9.3 数据库备份
--------------
- 开发环境：每日手动导出（Prisma Studio或pg_dump）
- 生产环境：Neon自动每日备份（保留7天）
- 重要里程碑：手动创建快照（如Phase 2结案前）

═══════════════════════════════════════════════════════════════════
附录：关键环境变量模板
═══════════════════════════════════════════════════════════════════

# .env（开发环境统一配置）
# 注意：Prisma读.env，NextAuth读.env.local，开发时统一用.env

# ===== Database =====
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# ===== NextAuth =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[32位以上随机字符串，openssl rand -base64 32生成]"

# ===== Dify（Next.js 读取 src/lib/dify.ts：DIFY_BASE_URL + DIFY_API_KEY）=====
# 与网关/端口一致，末尾必须带 /v1；旧名 DIFY_API_BASE_URL 若存在，须与 DIFY_BASE_URL 同值
DIFY_BASE_URL="http://localhost/v1"
DIFY_API_KEY="app-[从Dify控制台获取]"
DIFY_DAILY_BUDGET_MAX="50"

# ===== AI Models（可选：仅在非 Dify 直连或本地脚本需要时） =====
DEEPSEEK_API_KEY="sk-[你的密钥]"
OPENAI_API_KEY="sk-[你的密钥]"
# Moonshot / Kimi（若采用 kimi-2.5 / moonshot-kimi 别名且不在 Dify 内统一托管密钥时）
# MOONSHOT_API_KEY="sk-[你的密钥]"

═══════════════════════════════════════════════════════════════════
附录B：模型逻辑别名映射（维护表，不绑定具体版本号）
═══════════════════════════════════════════════════════════════════

说明：下列名称仅为**逻辑别名**；在 Dify「模型供应商」与各 Workflow 中选用的 **真实 model id** 以供应商控制台为准，团队更新时维护本表或等价 `docs/` 表格即可，**无需**因厂商改名而修订第二章条文。

**标准档双轨（非二选一）**：偏中文/国内电商 **主路径** 以 **Kimi** 为主；偏国际化/英文/工具链 **并行保留 GPT-4o-mini**；由 Workflow **条件分支 + 监控** 分配流量或互为备份，**最优解不是二选一**。预算与 SLA 以 **第六章** + **实测数据** 定稿。

| 逻辑别名 | 档位与用途 | 典型绑定方式 |
|----------|------------|--------------|
| **deepseek-default** | 默认 / 成本优先 | DeepSeek 供应商 + 所选对话模型 id |
| **kimi-2.5** 或 **moonshot-kimi** | 标准档 · **中文 / 国内电商主路径**（通常主用） | Moonshot / Kimi 兼容 API 下的 model id |
| **gpt-4o-mini** | 标准档 · **英文 / 国际化 / 工具链**（与 Kimi 并行） | OpenAI `gpt-4o-mini` 或兼容网关同等 model id |
| **gpt-5.3-codex** | 关键路径（发布、迁移、支付、核心逻辑）；开发侧高难/升级终点 | OpenAI 或 OpenAI-兼容网关上的实际 model id |

═══════════════════════════════════════════════════════════════════
附录 C：依赖版本修订记录（与 package.json 对齐，避免文档漂移）
═══════════════════════════════════════════════════════════════════

说明：第二章「技术栈铁律」中的历史版本号保留为演进记录；**以本附录及仓库 `package.json` 为准**。修订须同步更新 `PROJECT_CONTEXT_CARD.md` 第三节。

| 日期 | 包名 | 旧版（条文/历史） | 当前（package.json） | 原因摘要 | 批准人 |
|------|------|-------------------|---------------------|----------|--------|
| 2026-03 | `prisma` / `@prisma/client` | 5.x | ^6.0.1 | 团队已迁移至 Prisma 6，与现有 schema / 迁移一致 | 浔真 |
| 2026-03 | `zod` | 3.x | ^4.3.6 | 与当前校验代码及生态一致 | 浔真 |
| 2026-03 | `@hookform/resolvers` | 3.3.4（曾锁定） | ^5.2.2 | 与 Zod 4、RHF 当前组合一致；禁止在未回归前提下盲升 major | 浔真 |

**AI 与协作者注意**：实现新代码时**不得**再假设 Prisma 5 / Zod 3 API；遇疑查官方迁移指南与本附录。

═══════════════════════════════════════════════════════════════════
宪法签署
═══════════════════════════════════════════════════════════════════

版本：v3.0 BrandCraft Edition
生效日期：[Day 0日期]
下次审查：Phase 1结束时（Day 7）

人类签署：浔真 _______________
AI确认：已理解并承诺严格遵守本宪法所有条款
