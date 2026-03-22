# 项目约定文档

## 技术栈
| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 运行时 | Node.js | 20+ | LTS版本 |
| 框架 | Next.js | 14.x+ | App Router |
| 语言 | TypeScript | 5.x | 严格模式 |
| 样式 | Tailwind CSS | 3.x/4.x | 原子化 CSS |
| UI库 | shadcn/ui | latest | 按需安装 |
| ORM | Prisma | 5.x+ | PostgreSQL |
| 认证 | NextAuth.js / JWT | - | 根据项目选择 |
| 状态管理 | Zustand | latest | 轻量级 |
| 表单 | React Hook Form + Zod | latest | 表单验证 |
| 测试 | Vitest | latest | 单元测试 |

## 命名约定
- **文件名**：kebab-case（如 user-profile.tsx）
- **组件名**：PascalCase（如 UserProfile）
- **函数名**：camelCase（如 getUserById）
- **常量名**：UPPER_SNAKE_CASE（如 MAX_RETRY_COUNT）
- **类型文件**：PascalCase.types.ts（如 user.types.ts）

## Git分支策略
- `main`：生产分支，受保护
- `develop`：开发分支
- `feature/*`：功能分支（如 feature/user-auth）
- `fix/*`：修复分支（如 fix/login-bug）
- `release/*`：发布分支

## 提交信息格式（Conventional Commits）

## 代码规范要点
1. **TypeScript 严格模式**：禁止 any，必须类型定义
2. **组件**：使用函数式组件 + Hooks，禁用 class 组件
3. **API 路由**：必须验证输入（Zod schema）
4. **数据库**：使用 Prisma Client，禁止直接写 SQL
5. **样式**：优先使用 Tailwind，避免内联样式
6. **错误处理**：所有异步操作必须 try-catch
