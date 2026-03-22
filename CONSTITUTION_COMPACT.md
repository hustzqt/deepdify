## 🚀 立即执行：第一项 - 新宪法精简版

基于宪法v2.0和当前卡点，我生成**《Deepdify宪法精简版v2.1》**，核心变化：
- **技术栈锁定当前实际版本**（Next.js 14.2.21，非16.x）
- **记录当前阻断点**（signIn不触发请求）
- **排除已失败方案**（避免AI重复建议）
- **精简至5个核心章节**（便于AI快速解析）

```markdown
# 《Deepdify 电商工作室 开发宪法》精简版 v2.1
## AI-Native Development Constitution Compact

> **最高指令**：本文档优先级高于所有开发经验。冲突时严格遵循本文档。
> **当前状态**：Phase 2 Sprint 1 验收测试 - 登录功能阻断中
> **加载提示**：AI加载后请回复："已加载Deepdify宪法精简版v2.1，当前阻断点：登录signIn不触发请求，将严格遵循技术栈锁定与排除方案清单。"

---

## 第一章：项目身份与当前状态

```yaml
project:
  name: "Deepdify 电商工作室"
  codename: "deepdify-studio"
  current_phase: "Phase 2 Sprint 1 验收测试"
  current_blocker: "登录页面 signIn('credentials') 不触发网络请求"
  
milestone_status:
  M1_auth: "代码100%完成，API测试通过，前端跳转逻辑阻断"
  M2_dashboard: "100%完成，Layout/Sidebar/Dashboard就绪"
  next_action: "修复登录跳转 → 验证Session持久化 → 启动Phase 3"

tech_environment:
  node_version: "18+"
  package_manager: "pnpm"
  ide: "Cursor + Claude"
  database: "Neon Serverless Postgres (新加坡节点)"
  host: "本地开发 http://localhost:3000"
```

---

## 第二章：技术栈铁律（绝对锁定）

```yaml
tech_stack_iron_rule: "以下版本已验证，禁止升级/替换，除非人类明确指令"

frontend:
  framework: "Next.js 14.2.21 (App Router) - 禁止升级到15/16"
  language: "TypeScript 5.x (Strict Mode)"
  ui_library: "shadcn/ui + Tailwind CSS"
  state: "Zustand"
  forms: "React Hook Form 7.51.0"
  validation: "Zod 3.22.4"
  validation_bridge: "@hookform/resolvers 3.3.4 (锁定，禁止latest)"
  auth: "NextAuth.js v5 (Auth.js)"

backend:
  runtime: "Next.js API Routes"
  orm: "Prisma 5.x"
  database: "PostgreSQL (Neon hosted)"
  
infrastructure:
  hosting: "Vercel (未来)"
  current_local: "Windows + PowerShell + VS Code"

forbidden_immediate:
  - "禁止建议升级到Next.js 15/16（已验证兼容性灾难）"
  - "禁止升级@hookform/resolvers（会导致TypeError）"
  - "禁止用PowerShell Set-Content写入复杂代码（字符转义问题）"
  - "禁止前端直接调用AI API（必须用Backend-for-AI模式）"
  - "禁止在生产环境使用Prisma db push（必须用migrate）"
```

---

## 第三章：当前阻断点与排除方案清单（关键）

### 当前阻断点详述
```yaml
blocker_001:
  symptom: "点击登录按钮 → 显示'登录中...' → Network无请求 → 不跳转"
  location: "src/app/(auth)/login/page.tsx"
  backend_status: "正常（手动fetch /api/auth/callback/credentials返回200）"
  frontend_status: "signIn('credentials', {redirect: false})不触发网络请求"
  impact: "Phase 2无法验收，Phase 3不能启动"
```

### 已排除的失败方案（禁止再建议）
```yaml
excluded_solutions:
  - solution: "升级Next.js到16.2.0 + Turbopack"
    reason: "已验证：与@hookform/resolvers冲突，产生TypeError"
    date_excluded: "2025-01-XX"
    
  - solution: "升级@hookform/resolvers到latest"
    reason: "已验证：与Next.js 14/16都产生模块解析错误"
    date_excluded: "2025-01-XX"
    
  - solution: "使用PowerShell Set-Content/Out-File写入代码"
    reason: "已验证：PowerShell字符串转义导致代码写入不完整"
    date_excluded: "2025-01-XX"
    
  - solution: "清除浏览器缓存（Ctrl+F5）"
    reason: "已验证：非缓存问题，Disable Cache已勾选仍不工作"
    date_excluded: "2025-01-XX"
    
  - solution: "重启pnpm dev服务器"
    reason: "已验证：重启后问题依旧，代码已保存"
    date_excluded: "2025-01-XX"
    
  - solution: "使用原始signIn()不处理响应"
    reason: "已验证：result.ok判断失效，不触发跳转"
    date_excluded: "2025-01-XX"

  - solution: "使用next-auth/react的signIn()默认行为"
    reason: "已验证：在Next.js 14.2.21 + NextAuth v5环境下，signIn()不触发网络请求，疑似内部路由拦截"
    date_excluded: "2025-01-XX"
```

### 当前尝试方向（有效假设）
```yaml
working_hypothesis: "signIn()内部fetch逻辑异常，需绕过直接使用标准fetch API"
next_attempt: "重写login/page.tsx，直接使用fetch('/api/auth/csrf') + fetch('/api/auth/callback/credentials')"
```

---

## 第四章：目录结构与关键文件（强制遵守）

```yaml
directory_structure: "所有文件必须严格放在以下位置"

critical_files:
  auth_config: "src/lib/auth.ts"
  login_page: "src/app/(auth)/login/page.tsx"  # 当前阻断文件
  middleware: "src/middleware.ts"
  env_file: ".env"  # 注意：Prisma读.env，NextAuth读.env.local，开发时统一用.env
  
schema_files:
  prisma_schema: "prisma/schema.prisma"
  
validation_files:
  auth_validation: "src/lib/validations/auth.ts"
  
component_locations:
  ui_components: "src/components/ui/"
  layout_components: "src/components/layout/"
  
forbidden_locations:
  - "禁止在根目录创建random文件夹"
  - "禁止将组件放在app/目录下（必须放在components/）"
  - "禁止混用JavaScript和TypeScript（100% TS）"
```

---

## 第五章：编码铁律（7条精简版）

### 铁律1：TypeScript严格模式（零容忍）
- 禁止`any`，禁止`@ts-ignore`
- 所有函数必须有返回类型
- Props必须定义Interface

### 铁律2：组件单一职责
- 单文件不超过200行，超过必须拆分
- 一个组件只做一件事

### 铁律3：API标准化
```typescript
// 成功响应格式
{ success: true, data: T, meta?: { page, total } }

// 错误响应格式  
{ success: false, error: { code: string, message: string } }

// HTTP状态码：200成功，201创建，400参数错，401未认证，403无权限，404不存在，500服务器错
```

### 铁律4：数据库操作安全
- 所有查询必须通过Prisma（禁止原生SQL）
- 列表查询必须有分页（默认20条）
- 删除默认软删除（deletedAt字段）

### 铁律5：环境变量安全
- 禁止硬编码密钥
- 客户端变量必须用`NEXT_PUBLIC_`前缀
- `.env`必须在`.gitignore`中

### 铁律6：错误处理完整性
- 所有async必须try-catch
- API必须处理网络错误
- 必须有Loading/Error/Empty状态

### 铁律7：版本锁定优先
- 优先使用`package@specific-version`而非`latest`
- 修改依赖后必须验证`pnpm dev`能正常启动

---

## 第六章：模块开发顺序（禁止跳跃）

```yaml
module_development_order: "必须严格按以下顺序，完成一个才能开始下一个"

M1_auth: 
  status: "代码完成，验收测试中（阻断）"
  must_complete_before: "Phase 2结案"
  
M2_dashboard:
  status: "代码完成，等待M1验收后联调"
  
M3_products:
  status: "等待Phase 2结案后启动"
  dependencies: "M1_auth + M2_dashboard"
  estimated_sprint: "Sprint 2"
  
M4_ai_tools:
  status: "待开发"
  dependencies: "M3_products"
  
M5_selection:
  status: "待开发"
  dependencies: "M3_products"
  
M6_analytics:
  status: "待开发"
  dependencies: "M3_products + M5_selection"
  
M7_orders:
  status: "待开发"
  dependencies: "M1_auth + M2_dashboard"
```

---

## 第七章：AI Agent交互协议（精简）

```yaml
ai_agent_protocol:

context_loading: "每次新对话，人类将粘贴PROJECT_CONTEXT_CARD.md，AI必须确认已读取"

before_coding:
  - "确认当前属于哪个模块（M1-M7）"
  - "确认当前阻断点是否与本次任务相关"
  - "列出将要修改的文件"
  - "检查排除方案清单，不重复已失败方案"

during_coding:
  - "所有代码直接在回复中给出，由人类复制到VS Code"
  - "禁止让PowerShell写入复杂代码（简单cat/findstr可以）"
  - "修改前用注释标注：// 模块: MX_xxx, 功能: xxx"
  - "复杂逻辑必须加行内注释"

after_coding:
  - "输出CHECKPOINT格式的总结"
  - "提供验证步骤（如何确认功能正常）"
  - "明确下一步动作"

checkpoint_format: |
  ## CHECKPOINT
  - 完成了什么：[具体描述]
  - 修改了哪些文件：[文件列表]
  - 验证方法：[如何确认成功]
  - 如果失败：[回退方案]
  - 下一步：[接下来做什么]

constraint_resolution: "当AI经验与本宪法冲突时，本宪法优先。AI可提出建议但需标注'建议（需人类确认）'"
```

---

## 附录：关键环境变量（当前开发）

```bash
# .env 文件必须包含（已验证配置）
DATABASE_URL="postgresql://neondb_owner:xxx@ep-green-smoke-a1657xx7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[实际值已配置，不在文档中明文显示]"
```

---

## 宪法签署

```yaml
version: "2.1 Compact"
effective_date: "立即生效"
ai_acknowledgment_required: "AI必须确认：'已加载Deepdify宪法精简版v2.1，理解当前阻断点为登录signIn不触发请求，将严格遵守技术栈锁定（Next.js 14.2.21, resolvers 3.3.4），不重复已排除方案。'"
```

CONSTITUTION_EOF
```

---

## ✅ CHECKPOINT - 第一项完成

**已完成**：生成《Deepdify宪法精简版v2.1》
**文件位置**：应保存为 `D:\cursorpro\deepdify\CONSTITUTION_COMPACT.md`
**核心改进**：
- 明确锁定Next.js 14.2.21（非16.x）
- 明确记录当前阻断点（signIn不触发请求）
- 明确列出已排除方案（防止AI重复建议PowerShell写代码/升级依赖等）
- 精简至7个核心章节（便于AI快速加载）

