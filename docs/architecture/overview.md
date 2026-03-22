# 架构总览

## 技术架构
- **前端框架**：Next.js 14+ (App Router)
- **渲染策略**：Server Components 优先，Client Components 按需
- **样式方案**：Tailwind CSS + shadcn/ui 组件库
- **状态管理**：
  - 服务端：React Server Components + 数据获取
  - 客户端：Zustand（轻量级状态）
- **表单处理**：React Hook Form + Zod 验证

## 数据层
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **数据获取**：Prisma Client (Server) / TanStack Query (Client)
- **文件位置**：
  - 模型定义：`prisma/schema.prisma`
  - 客户端配置：`src/lib/db.ts`

## 认证与授权
- **方案**：NextAuth.js / 自定义 JWT
- **存储**：HttpOnly Cookie
- **保护路由**：Middleware (`src/middleware.ts`)

## 项目结构详解

## 开发工作流
1. **数据库变更** → 修改 `schema.prisma` → 运行 `npx prisma migrate dev`
2. **创建 API** → 在 `app/api/` 下新建路由 → 使用 Zod 验证输入
3. **创建页面** → 在 `app/` 下新建目录 → 使用 Server Component
4. **创建组件** → 区分 Server/Client Component → 放入对应目录
5. **添加类型** → 在 `types/` 下定义共享类型

## 安全要点
- 不在客户端暴露 API 密钥
- 敏感操作需要二次确认
- 上传文件验证类型和大小
- API 路由检查用户认证状态
- 使用环境变量存储敏感信息
