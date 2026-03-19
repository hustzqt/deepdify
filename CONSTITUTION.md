# 《Deepdify 电商工作室 开发宪法》
## AI-Native Development Constitution v2.0

> **本文档是所有AI编程Agent的最高指令文件。任何模块开发、架构决策、代码生成均须以本宪法为准。冲突时，本宪法优先级最高。**

---

## 文档元数据

```yaml
document:
  id: "DEEPDIFY-CONSTITUTION-v2.0"
  type: "AI Development Constitution"
  created: "2025-01-XX"
  status: "ACTIVE"
  authority: "SUPREME"
复制

（此处粘贴完整宪法内容...）

CONSTITUTION_EOF

复制代码
收起

### 步骤3：同时放一份到 .github 目录

```bash
mkdir -p .github
cp CONSTITUTION.md .github/CONSTITUTION.md
复制
方法二：VS Code / Cursor 手动创建（最简单）
复制代码
收起
步骤1 → 打开 VS Code 或 Cursor
步骤2 → 在项目根目录右键 → 新建文件
步骤3 → 文件命名为 CONSTITUTION.md
步骤4 → 将完整宪法内容复制粘贴进去
步骤5 → Ctrl+S (Windows) 或 Cmd+S (Mac) 保存
复制

文件目录结构应该如下：

复制代码
收起
deepdify-studio/
├── CONSTITUTION.md          ← 项目根目录（主文件）
├── .github/
│   └── CONSTITUTION.md      ← GitHub目录（备份）
├── src/
├── package.json
└── ...
复制
方法三：用 Node.js 脚本批量生成（自动化）

创建一个 scripts/init-constitution.js：

javascript
复制代码
收起
const fs = require('fs');
const path = require('path');

const CONSTITUTION_CONTENT = `
# 《Deepdify 电商工作室 开发宪法》
## AI-Native Development Constitution v2.0

> **本文档是所有AI编程Agent的最高指令文件。**
> **任何模块开发、架构决策、代码生成均须以本宪法为准。**
> **冲突时，本宪法优先级最高。**

---

## 文档元数据

\`\`\`yaml
document:
  id: "DEEPDIFY-CONSTITUTION-v2.0"
  type: "AI Development Constitution"
  created: "${new Date().toISOString().split('T')[0]}"
  status: "ACTIVE"
  authority: "SUPREME - 所有开发指令的最高优先级"
  format: "YAML-structured Markdown for AI parsing"
\`\`\`

---

## 第一章：项目身份与愿景

\`\`\`yaml
project:
  name: "Deepdify 电商工作室"
  codename: "deepdify-studio"
  version_target: "MVP 1.0"
  
  mission: |
    为中国跨境电商卖家提供一站式AI驱动的
    商品管理、智能选品、数据分析工作台
    
  vision: |
    让每一个跨境卖家都拥有专属AI运营团队
    
  core_value_proposition:
    - "AI驱动的智能选品与商品优化"
    - "多平台统一管理（Amazon/Shopee/TikTok Shop）"
    - "数据洞察驱动的经营决策"
    - "自动化工作流减少80%重复劳动"
\`\`\`

---

## 第二章：技术架构宪章

### 2.1 技术栈锁定（不可更改）

\`\`\`yaml
tech_stack:
  iron_rule: "以下技术选型已锁定，AI不得建议替换"
  
  frontend:
    framework: "Next.js 14+ (App Router)"
    language: "TypeScript (strict mode)"
    styling: "Tailwind CSS + shadcn/ui"
    state: "Zustand (轻量全局状态)"
    forms: "React Hook Form + Zod"
    charts: "Recharts"
    tables: "TanStack Table v8"
    
  backend:
    runtime: "Next.js API Routes (App Router)"
    orm: "Prisma"
    database: "PostgreSQL (Supabase hosted)"
    auth: "NextAuth.js v5 (Auth.js)"
    file_storage: "Supabase Storage"
    
  ai_integration:
    primary: "OpenAI GPT-4 API"
    fallback: "Claude API (Anthropic)"
    embedding: "OpenAI text-embedding-3-small"
    
  infra:
    hosting: "Vercel"
    ci_cd: "GitHub Actions"
    monitoring: "Vercel Analytics + Sentry"
    
  forbidden_technologies:
    - { tech: "Redux", reason: "过度复杂，用Zustand替代" }
    - { tech: "GraphQL", reason: "MVP阶段REST足够" }
    - { tech: "MongoDB", reason: "电商数据强关系型" }
    - { tech: "Express.js", reason: "使用Next.js API Routes" }
    - { tech: "CSS Modules", reason: "统一使用Tailwind" }
    - { tech: "jQuery", reason: "禁止使用" }
\`\`\`

### 2.2 项目目录结构（强制遵守）

\`\`\`yaml
directory_structure:
  rule: "所有文件必须放在对应目录，不得随意创建顶层目录"
  
  layout: |
    deepdify-studio/
    ├── CONSTITUTION.md              # 本文件（开发宪法）
    ├── README.md
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma            # 数据库模型（唯一真相源）
    │   ├── migrations/
    │   └── seed.ts
    ├── src/
    │   ├── app/                     # Next.js App Router
    │   │   ├── (auth)/              # 认证相关页面组
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── (dashboard)/         # 主工作台页面组
    │   │   │   ├── layout.tsx       # 工作台统一布局
    │   │   │   ├── page.tsx         # 仪表盘首页
    │   │   │   ├── products/        # 商品管理
    │   │   │   ├── selection/       # 智能选品
    │   │   │   ├── analytics/       # 数据分析
    │   │   │   ├── orders/          # 订单管理
    │   │   │   ├── ai-tools/        # AI工具集
    │   │   │   └── settings/        # 系统设置
    │   │   ├── api/                 # API路由
    │   │   │   ├── auth/
    │   │   │   ├── products/
    │   │   │   ├── ai/
    │   │   │   └── analytics/
    │   │   ├── layout.tsx           # 根布局
    │   │   ├── page.tsx             # 着陆页
    │   │   └── globals.css
    │   ├── components/              # 组件库
    │   │   ├── ui/                  # shadcn/ui基础组件
    │   │   ├── layout/              # 布局组件
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── Header.tsx
    │   │   │   └── Breadcrumb.tsx
    │   │   ├── products/            # 商品相关组件
    │   │   ├── analytics/           # 分析相关组件
    │   │   └── shared/              # 通用业务组件
    │   ├── lib/                     # 工具库
    │   │   ├── prisma.ts            # Prisma客户端单例
    │   │   ├── auth.ts              # Auth配置
    │   │   ├── ai.ts                # AI调用封装
    │   │   ├── utils.ts             # 通用工具函数
    │   │   └── validations/         # Zod schemas
    │   ├── hooks/                   # 自定义Hooks
    │   ├── stores/                  # Zustand stores
    │   ├── types/                   # TypeScript类型定义
    │   └── constants/               # 常量定义
    ├── public/                      # 静态资源
    ├── tests/                       # 测试文件
    └── scripts/                     # 工具脚本
\`\`\`

---

## 第三章：数据模型宪章

### 3.1 核心数据模型

\`\`\`yaml
data_models:
  design_principles:
    - "Prisma schema 是数据结构的唯一真相源"
    - "所有模型必须有 id, createdAt, updatedAt"
    - "软删除优于硬删除（使用 deletedAt 字段）"
    - "枚举使用 Prisma enum，不用魔法字符串"
    - "金额字段使用 Decimal 类型，不用 Float"
    
  core_entities:
    User:
      description: "系统用户（卖家）"
      key_fields:
        - "id: 主键UUID"
        - "email: 登录邮箱"
        - "name: 显示名称"
        - "role: 角色(ADMIN/SELLER/VIEWER)"
        - "subscription: 订阅等级"
        
    Store:
      description: "店铺（支持多平台多店铺）"
      key_fields:
        - "platform: 平台枚举(AMAZON/SHOPEE/TIKTOK)"
        - "region: 区域市场"
        - "credentials: 加密存储的API密钥"
        - "belongsTo: User"
        
    Product:
      description: "商品（核心实体）"
      key_fields:
        - "title: 商品标题"
        - "description: 商品描述"
        - "sku: SKU编码"
        - "price: Decimal价格"
        - "cost: Decimal成本"
        - "status: 状态枚举"
        - "platformData: JSON(平台特有数据)"
        - "aiScore: AI评分"
        - "belongsTo: Store"
        
    Order:
      description: "订单"
      key_fields:
        - "orderNumber: 订单号"
        - "status: 订单状态"
        - "totalAmount: Decimal"
        - "belongsTo: Store"
        
    AITask:
      description: "AI任务记录"
      key_fields:
        - "taskType: 任务类型枚举"
        - "input: JSON输入"
        - "output: JSON输出"
        - "tokensUsed: Token消耗"
        - "status: 执行状态"
        - "belongsTo: User"
\`\`\`

---

## 第四章：模块开发宪章

### 4.1 七大核心模块

\`\`\`yaml
modules:
  development_order: "严格按以下顺序开发，不得跳跃"
  
  M1_auth:
    name: "认证与用户系统"
    priority: "P0 - 最高"
    sprint: 1
    features:
      - "邮箱密码注册/登录"
      - "NextAuth.js session管理"
      - "角色权限基础框架"
      - "用户Profile页面"
    acceptance_criteria:
      - "用户可注册、登录、登出"
      - "Session持久化正常"
      - "未认证用户自动跳转登录页"
      
  M2_dashboard:
    name: "工作台框架与仪表盘"
    priority: "P0 - 最高"
    sprint: 1
    features:
      - "侧边栏导航（可折叠）"
      - "顶部Header（用户头像/通知）"
      - "面包屑导航"
      - "仪表盘首页（关键指标卡片）"
      - "响应式布局（桌面端优先）"
    acceptance_criteria:
      - "导航在所有页面正常工作"
      - "布局在1280px+屏幕完美显示"
      - "侧边栏折叠/展开动画流畅"
      
  M3_products:
    name: "商品管理"
    priority: "P0 - 最高"
    sprint: 2
    features:
      - "商品列表（TanStack Table，分页/筛选/排序）"
      - "商品详情页"
      - "商品创建/编辑表单"
      - "商品图片上传"
      - "批量操作（上下架/删除）"
      - "商品搜索"
    acceptance_criteria:
      - "支持1000+商品流畅渲染"
      - "表单验证完整（Zod）"
      - "图片上传支持拖拽和预览"
      
  M4_ai_tools:
    name: "AI工具集"
    priority: "P1 - 高"
    sprint: 3
    features:
      - "AI标题优化器"
      - "AI商品描述生成器"
      - "AI关键词提取器"
      - "AI竞品分析"
      - "AI使用额度管理"
    acceptance_criteria:
      - "AI响应流式输出（Streaming）"
      - "错误处理优雅（超时/限流/余额不足）"
      - "历史记录可查"
      
  M5_selection:
    name: "智能选品"
    priority: "P1 - 高"
    sprint: 3
    features:
      - "选品雷达（趋势发现）"
      - "商品评分模型"
      - "竞争度分析"
      - "利润计算器"
    acceptance_criteria:
      - "评分算法可解释"
      - "数据可视化直观"
      
  M6_analytics:
    name: "数据分析"
    priority: "P1 - 高"
    sprint: 4
    features:
      - "销售趋势图表"
      - "商品表现排名"
      - "流量分析"
      - "利润分析报表"
      - "数据导出（CSV/Excel）"
    acceptance_criteria:
      - "图表交互流畅"
      - "支持日/周/月时间粒度"
      - "大数据量下性能可接受"
      
  M7_orders:
    name: "订单管理"
    priority: "P2 - 中"
    sprint: 4
    features:
      - "订单列表与筛选"
      - "订单详情"
      - "订单状态流转"
      - "物流追踪集成"
    acceptance_criteria:
      - "订单状态机逻辑正确"
      - "支持按多条件筛选"
\`\`\`

### 4.2 模块开发检查清单

\`\`\`yaml
module_checklist:
  before_coding:
    - "[ ] 确认模块在开发顺序中的位置"
    - "[ ] 确认依赖的前置模块已完成"
    - "[ ] 确认数据模型已在schema.prisma中定义"
    - "[ ] 确认API端点已规划"
    
  during_coding:
    - "[ ] 遵循目录结构规范"
    - "[ ] TypeScript严格模式无报错"
    - "[ ] 使用shadcn/ui组件，不自造轮子"
    - "[ ] 表单使用React Hook Form + Zod"
    - "[ ] API使用标准响应格式"
    - "[ ] 错误处理完整"
    
  after_coding:
    - "[ ] 页面响应式检查"
    - "[ ] 加载状态/空状态/错误状态都有处理"
    - "[ ] 无TypeScript any类型"
    - "[ ] 无硬编码字符串（使用constants）"
    - "[ ] 无console.log残留"
\`\`\`

---

## 第五章：编码铁律

### 5.1 七条不可违反的铁律

\`\`\`yaml
iron_rules:
  rule_1:
    title: "TypeScript严格模式"
    level: "ABSOLUTE - 零容忍"
    content: |
      - 禁止使用 any 类型
      - 禁止使用 @ts-ignore
      - 所有函数必须有返回类型声明
      - 所有Props必须定义Interface
    example_violation: "const data: any = await fetch(...)"
    example_correct: "const data: ProductListResponse = await fetch(...)"
    
  rule_2:
    title: "组件单一职责"
    level: "ABSOLUTE"
    content: |
      - 每个组件文件不超过200行
      - 超过200行必须拆分子组件
      - 一个组件只做一件事
      - 逻辑复杂的提取到自定义Hook
    
  rule_3:
    title: "API标准化"
    level: "ABSOLUTE"
    content: |
      所有API响应必须遵循统一格式：
      成功: { success: true, data: T, meta?: { page, total } }
      失败: { success: false, error: { code: string, message: string } }
      
      HTTP状态码规范：
      200 - 成功
      201 - 创建成功
      400 - 请求参数错误
      401 - 未认证
      403 - 无权限
      404 - 资源不存在
      500 - 服务器错误
    
  rule_4:
    title: "数据库操作安全"
    level: "ABSOLUTE"
    content: |
      - 所有查询必须通过Prisma（禁止原生SQL）
      - 列表查询必须有分页（默认20条/页）
      - 必须使用where条件限定用户数据范围
      - 删除操作默认软删除
    
  rule_5:
    title: "环境变量安全"
    level: "ABSOLUTE"
    content: |
      - 禁止在代码中硬编码任何密钥/URL
      - 所有敏感配置走.env文件
      - 客户端可访问的变量必须用NEXT_PUBLIC_前缀
      - .env文件必须在.gitignore中
    
  rule_6:
    title: "错误处理完整性"
    level: "ABSOLUTE"
    content: |
      - 所有async函数必须try-catch
      - API调用必须处理网络错误
      - 用户操作必须有Loading/Success/Error反馈
      - 使用全局ErrorBoundary捕获未处理异常
    
  rule_7:
    title: "命名规范一致性"
    level: "ABSOLUTE"
    content: |
      文件命名：
      - 组件文件: PascalCase.tsx (如 ProductCard.tsx)
      - 工具文件: camelCase.ts (如 formatPrice.ts)
      - 常量文件: camelCase.ts 中 UPPER_SNAKE_CASE
      - 类型文件: camelCase.ts (如 product.types.ts)
      
      变量命名：
      - 组件: PascalCase (如 ProductCard)
      - 函数: camelCase (如 getProducts)
      - 常量: UPPER_SNAKE_CASE (如 MAX_PAGE_SIZE)
      - 类型/接口: PascalCase with prefix (如 IProduct, TProductStatus)
      - 布尔变量: is/has/can前缀 (如 isLoading, hasError)
\`\`\`

---

## 第六章：AI集成宪章

\`\`\`yaml
ai_integration:
  architecture:
    pattern: "Backend-for-AI"
    rule: "所有AI API调用必须通过后端代理，禁止前端直接调用AI API"
    reason: "保护API Key + 控制用量 + 统一日志"
    
  implementation:
    api_route: "/api/ai/{task-type}"
    streaming: true
    timeout: 30000
    retry: 
      max_attempts: 2
      backoff: "exponential"
      
  prompt_management:
    storage: "src/lib/ai/prompts/"
    format: "TypeScript template functions"
    versioning: "每个prompt模板有版本号"
    rule: "Prompt必须参数化，禁止在API Route中拼接字符串"
    
  cost_control:
    user_quota: "每用户每日有Token上限"
    model_selection:
      heavy_tasks: "GPT-4 (标题优化/竞品分析)"
      light_tasks: "GPT-3.5-turbo (关键词提取/简单生成)"
    logging: "每次AI调用必须记录到AITask表"
    
  error_handling:
    rate_limit: "显示友好提示，建议稍后重试"
    timeout: "30秒超时，显示超时提示"
    invalid_response: "AI返回异常时使用fallback模板"
    quota_exceeded: "引导用户升级套餐"
\`\`\`

---

## 第七章：UI/UX设计宪章

\`\`\`yaml
ui_ux:
  design_system:
    framework: "shadcn/ui + Tailwind CSS"
    theme: "专业商务风，深蓝主色调"
    rule: "优先使用shadcn/ui组件，不足时才自建"
    
  color_palette:
    primary: "slate-900 / blue-600"
    secondary: "slate-600"
    accent: "blue-500"
    success: "green-500"
    warning: "amber-500"
    danger: "red-500"
    background: "slate-50 (页面) / white (卡片)"
    
  layout_rules:
    sidebar_width: "256px (展开) / 64px (折叠)"
    content_max_width: "1440px"
    card_border_radius: "8px (rounded-lg)"
    spacing_unit: "4px的倍数 (Tailwind默认)"
    
  interaction_patterns:
    loading: "骨架屏(Skeleton) 优于 转圈(Spinner)"
    empty_state: "必须有空状态插画和引导操作"
    error_state: "必须有错误提示和重试按钮"
    success_feedback: "使用Toast通知（sonner库）"
    destructive_actions: "必须二次确认弹窗"
    
  responsive:
    priority: "桌面端优先 (Desktop First)"
    breakpoints:
      desktop: ">= 1280px (主要适配)"
      tablet: ">= 768px (基本适配)"
      mobile: "< 768px (不在MVP范围)"
\`\`\`

---

## 第八章：API设计宪章

\`\`\`yaml
api_design:
  base_path: "/api"
  versioning: "暂不分版本（MVP阶段）"
  
  naming_convention:
    style: "RESTful"
    examples:
      - "GET    /api/products          → 商品列表"
      - "POST   /api/products          → 创建商品"
      - "GET    /api/products/:id      → 商品详情"
      - "PATCH  /api/products/:id      → 更新商品"
      - "DELETE /api/products/:id      → 删除商品"
      - "POST   /api/ai/optimize-title → AI标题优化"
      
  request_validation:
    tool: "Zod"
    rule: "所有API入参必须经过Zod schema验证"
    location: "src/lib/validations/"
    
  response_format:
    success: |
      {
        "success": true,
        "data": { ... },
        "meta": {
          "page": 1,
          "pageSize": 20,
          "total": 150,
          "totalPages": 8
        }
      }
    error: |
      {
        "success": false,
        "error": {
          "code": "PRODUCT_NOT_FOUND",
          "message": "商品不存在或已被删除"
        }
      }
      
  authentication:
    method: "NextAuth.js Session"
    rule: "除公开API外，所有端点必须验证Session"
    helper: "使用 getServerSession() 获取当前用户"
    
  rate_limiting:
    global: "100 requests/minute per user"
    ai_endpoints: "10 requests/minute per user"
\`\`\`

---

## 第九章：性能与安全宪章

\`\`\`yaml
performance:
  targets:
    first_contentful_paint: "< 1.5s"
    time_to_interactive: "< 3s"
    api_response_time: "< 500ms (非AI接口)"
    lighthouse_score: "> 80"
    
  optimization_rules:
    - "使用Next.js Image组件处理图片"
    - "列表页使用服务端分页，不在前端分页"
    - "大列表使用虚拟滚动"
    - "API结果适当缓存（React Query staleTime）"
    - "动态导入（next/dynamic）非首屏组件"
    
security:
  rules:
    - "所有用户输入必须验证和转义"
    - "SQL注入防护（Prisma ORM天然防护）"
    - "XSS防护（React天然防护 + 不使用dangerouslySetInnerHTML）"
    - "CSRF防护（NextAuth内置）"
    - "API密钥永远不暴露给前端"
    - "文件上传必须验证类型和大小"
    - "敏感操作必须验证用户身份"
    
  file_upload:
    allowed_types: ["image/jpeg", "image/png", "image/webp"]
    max_size: "5MB"
    storage: "Supabase Storage"
    naming: "UUID重命名，不保留原文件名"
\`\`\`

---

## 第十章：开发流程宪章

\`\`\`yaml
development_workflow:
  sprint_structure:
    sprint_1:
      duration: "2周"
      modules: ["M1_auth", "M2_dashboard"]
      milestone: "可登录的空工作台"
      
    sprint_2:
      duration: "2周"
      modules: ["M3_products"]
      milestone: "完整的商品CRUD"
      
    sprint_3:
      duration: "2周"
      modules: ["M4_ai_tools", "M5_selection"]
      milestone: "AI功能可用"
      
    sprint_4:
      duration: "2周"
      modules: ["M6_analytics", "M7_orders"]
      milestone: "MVP功能完整"
      
  git_workflow:
    branch_naming:
      feature: "feature/{module}-{description}"
      bugfix: "fix/{description}"
      hotfix: "hotfix/{description}"
    examples:
      - "feature/m1-auth-login"
      - "feature/m3-product-list"
      - "fix/product-form-validation"
    commit_convention:
      format: "type(scope): description"
      types: ["feat", "fix", "refactor", "style", "docs", "chore"]
      examples:
        - "feat(auth): implement email login"
        - "fix(products): fix pagination offset"
        - "refactor(ai): extract prompt templates"
        
  code_review:
    rule: "AI生成的代码人类必须审查以下几点"
    checklist:
      - "是否遵循本宪法的技术栈锁定"
      - "是否有安全隐患"
      - "是否有硬编码"
      - "TypeScript类型是否完整"
      - "是否有遗漏的错误处理"
\`\`\`

---

## 第十一章：质量保障宪章

\`\`\`yaml
quality_assurance:
  dimensions:
    correctness:
      weight: "最高"
      criteria:
        - "功能按需求正确实现"
        - "边界情况已处理"
        - "数据一致性保证"
        
    reliability:
      weight: "高"
      criteria:
        - "错误处理完整"
        - "网络异常graceful降级"
        - "用户操作有明确反馈"
        
    maintainability:
      weight: "高"
      criteria:
        - "代码可读性强"
        - "组件职责单一"
        - "命名自解释"
        - "必要的注释"
        
    performance:
      weight: "中"
      criteria:
        - "无不必要的重渲染"
        - "列表数据虚拟化"
        - "图片优化加载"
        
    security:
      weight: "高"
      criteria:
        - "输入验证完整"
        - "权限检查到位"
        - "敏感数据加密"
        
  testing_strategy:
    mvp_phase:
      rule: "MVP阶段不强制单元测试，但关键逻辑需测试"
      must_test:
        - "AI prompt生成函数"
        - "价格计算/利润计算函数"
        - "数据格式转换函数"
        - "Zod验证schemas"
      tool: "Vitest"
\`\`\`

---

## 第十二章：AI Agent 交互协议

\`\`\`yaml
ai_agent_protocol:
  context_loading:
    rule: "每次新会话，AI必须首先加载本宪法"
    method: "将CONSTITUTION.md作为System Prompt的一部分"
    
  task_request_format:
    description: "人类向AI下达开发任务时，应遵循此格式"
    template: |
      ## 任务
      {描述要做什么}
      
      ## 所属模块
      {M1-M7中的哪个}
      
      ## 涉及文件
      {预期需要创建/修改哪些文件}
      
      ## 验收标准
      {做到什么程度算完成}
      
  ai_response_protocol:
    before_coding:
      - "确认任务属于哪个模块"
      - "确认前置依赖是否已就绪"
      - "列出将要创建/修改的文件清单"
      - "如有架构疑问，先提问再动手"
      
    during_coding:
      - "每个文件开头注释标注所属模块"
      - "遵循本宪法所有Iron Rules"
      - "复杂逻辑添加行内注释"
      
    after_coding:
      - "提供修改文件的完整清单"
      - "说明如何验证功能是否正常"
      - "提示下一步可能需要做什么"
      
  conflict_resolution:
    rule: |
      当AI的编程经验与本宪法冲突时：
      1. 本宪法优先
      2. AI可以提出建议但需说明理由
      3. 最终由人类决定是否修改宪法
      4. 未经批准不得违反宪法条款
\`\`\`

---

## 附录A：关键代码模板

### A.1 API Route 模板

\`\`\`typescript
// src/app/api/products/route.ts
// 模块: M3_products
// 功能: 商品列表API

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productQuerySchema } from "@/lib/validations/product";

export async function GET(request: NextRequest) {
  try {
    // 1. 认证检查
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
        { status: 401 }
      );
    }

    // 2. 参数验证
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = productQuerySchema.parse(searchParams);

    // 3. 数据查询
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { store: { userId: session.user.id }, deletedAt: null },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      prisma.product.count({
        where: { store: { userId: session.user.id }, deletedAt: null },
      }),
    ]);

    // 4. 标准响应
    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "服务器内部错误" } },
      { status: 500 }
    );
  }
}
\`\`\`

### A.2 页面组件模板

\`\`\`typescript
// src/app/(dashboard)/products/page.tsx
// 模块: M3_products
// 功能: 商品列表页

import { Suspense } from "react";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductTableSkeleton } from "@/components/products/ProductTableSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="商品管理"
        description="管理您所有店铺的商品"
        action={{ label: "添加商品", href: "/products/new" }}
      />
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTable />
      </Suspense>
    </div>
  );
}
\`\`\`

### A.3 Zustand Store 模板

\`\`\`typescript
// src/stores/useProductStore.ts
// 模块: M3_products

import { create } from "zustand";
import type { IProduct, TProductFilter } from "@/types/product.types";

interface ProductState {
  products: IProduct[];
  filter: TProductFilter;
  isLoading: boolean;
  error: string | null;
  
  setProducts: (products: IProduct[]) => void;
  setFilter: (filter: Partial<TProductFilter>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  products: [],
  filter: { page: 1, pageSize: 20, sortBy: "createdAt", sortOrder: "desc" as const },
  isLoading: false,
  error: null,
};

export const useProductStore = create<ProductState>((set) => ({
  ...initialState,
  setProducts: (products) => set({ products }),
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
\`\`\`

---

## 附录B：环境变量清单

\`\`\`yaml
environment_variables:
  required:
    DATABASE_URL: "PostgreSQL连接字符串"
    NEXTAUTH_SECRET: "NextAuth加密密钥"
    NEXTAUTH_URL: "应用URL (如 http://localhost:3000)"
    OPENAI_API_KEY: "OpenAI API密钥"
    
  optional:
    ANTHROPIC_API_KEY: "Claude API密钥（备选AI）"
    SUPABASE_URL: "Supabase项目URL"
    SUPABASE_ANON_KEY: "Supabase匿名密钥"
    SUPABASE_SERVICE_KEY: "Supabase服务端密钥"
    SENTRY_DSN: "Sentry错误追踪"
    
  client_side:
    NEXT_PUBLIC_APP_URL: "前端应用URL"
    NEXT_PUBLIC_APP_NAME: "Deepdify电商工作室"
    
  example_env_file: |
    # .env.local (不要提交到Git)
    DATABASE_URL="postgresql://user:pass@host:5432/deepdify"
    NEXTAUTH_SECRET="your-secret-key-here"
    NEXTAUTH_URL="http://localhost:3000"
    OPENAI_API_KEY="sk-..."
\`\`\`

---

## 附录C：常见问题裁决

\`\`\`yaml
faq_rulings:
  q1:
    question: "可以用其他UI库替代shadcn/ui吗？"
    ruling: "不可以。shadcn/ui是本项目唯一UI组件库。"
    
  q2:
    question: "可以用GraphQL替代REST吗？"
    ruling: "MVP阶段不可以。REST API完全满足需求。"
    
  q3:
    question: "可以跳过M2直接开发M3吗？"
    ruling: "不可以。必须严格按模块顺序开发。"
    
  q4:
    question: "组件超过200行怎么办？"
    ruling: "必须拆分。提取子组件或自定义Hook。"
    
  q5:
    question: "可以使用any类型应急吗？"
    ruling: "绝对不可以。花时间定义正确的类型。"
    
  q6:
    question: "前端可以直接调用OpenAI API吗？"
    ruling: "绝对不可以。必须通过后端API Route代理。"
    
  q7:
    question: "可以不做分页直接返回全部数据吗？"
    ruling: "不可以。所有列表API必须支持分页。"
    
  q8:
    question: "可以在组件中直接写SQL吗？"
    ruling: "不可以。所有数据库操作通过Prisma ORM。"
\`\`\`

---

## 宪法签署

\`\`\`yaml
constitution_signature:
  version: "2.0"
  effective_date: "立即生效"
  amendment_process: |
    修改本宪法需要：
    1. 人类架构师提出修改提案
    2. 评估影响范围
    3. 更新版本号
    4. 通知所有AI Agent重新加载
    
  ai_acknowledgment: |
    AI Agent在加载本宪法后，请回复：
    "已加载《Deepdify电商工作室开发宪法》v2.0，
     共12章+3附录，7条铁律已锁定，
     将严格遵循所有条款执行开发任务。"
\`\`\`
CONSTITUTION_EOF

console.log('✅ CONSTITUTION.md 已生成到项目根目录');

// 同时复制到 .github 目录
const githubDir = path.join(process.cwd(), '.github');
if (!fs.existsSync(githubDir)) {
  fs.mkdirSync(githubDir, { recursive: true });
}
fs.copyFileSync(
  path.join(process.cwd(), 'CONSTITUTION.md'),
  path.join(githubDir, 'CONSTITUTION.md')
);
console.log('✅ 已同步到 .github/CONSTITUTION.md');
复制

运行脚本：

bash
复制代码
收起
node scripts/init-constitution.js
复制
方法四：用 PowerShell 创建（Windows用户）
powershell
复制代码
收起
# 在项目根目录打开PowerShell
New-Item -Path "CONSTITUTION.md" -ItemType File
# 然后用记事本打开粘贴内容
notepad CONSTITUTION.md
复制
验证文件已正确保存
bash
复制代码
收起
# 检查文件是否存在
ls -la CONSTITUTION.md

# 查看文件大小（应该有几十KB）
wc -c CONSTITUTION.md

# 查看前几行确认内容正确
head -20 CONSTITUTION.md
复制

预期输出：

复制代码
收起
-rw-r--r-- 1 user staff 25600 Jan xx xx:xx CONSTITUTION.md
复制
如何让 AI 编程工具自动加载
Cursor 配置
bash
复制代码
收起
# 在项目根目录创建 .cursorrules
echo "请在每次对话开始时加载 CONSTITUTION.md 作为项目规范" > .cursorrules
复制
在 Cursor 中使用
复制代码
收起
每次开始新对话时输入:
@CONSTITUTION.md 请加载这个开发宪法，然后开始以下任务...
复制

最推荐的方式：方法二（VS Code手动创建）最简单可靠，方法三（Node脚本）最适合团队标准化。