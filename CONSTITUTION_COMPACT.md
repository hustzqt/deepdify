# BrandCraft宪法精简版 v3.0
## AI快速加载上下文

> **加载确认语**："已加载 BrandCraft 宪法 v3.0，当前阶段[Phase 0.8]，将严格遵守技术栈锁定；**依赖版本以 CONSTITUTION.md 附录 C + package.json 为准**。"

### 一、项目身份
- **前身**：Deepdify Studio（Day 1-4，认证+Profile完成）
- **演进**：BrandCraft（Day 0+，Dify AI集成）
- **架构**：Dify-Core Hybrid（AI引擎70% + Next.js 30%）
- **模式**：零代码优先（AI逻辑在Dify，禁止Next.js写AI业务）

### 二、技术栈锁定（绝对禁止变更）
- **Next.js**: 14.2.21（禁止15/16，已验证冲突）
- **TypeScript**: 5.x Strict
- **NextAuth**: v5（修复后版本）
- **表单**: React Hook Form 7.51.0（锁定）
- **验证桥接**: @hookform/resolvers ^5（与 Zod 4 配套；**完整版附录 C**）
- **数据库**: Neon PostgreSQL + **Prisma ^6**（**完整版附录 C**，勿再写 Prisma 5）
- **AI引擎**: Dify CE（Docker，禁用遥测）
- **模型逻辑别名（不锁版本）**: `deepseek-default`；标准档双轨 `kimi-2.5`·`moonshot-kimi` + `gpt-4o-mini`；关键 `gpt-5.3-codex` — 宪法 **§2.3** + **附录B**
- **模型路由（IDE/开发）**: `docs/architecture/MODEL_ROUTING.md`；**Backend-for-AI**: `DIFY_BASE_URL` + `DIFY_API_KEY`（宪法 **7.6** 与附录）

### 三、当前状态（Phase 0.8）
- **收口**: 文档与 package.json 对齐（附录 C）；工程基线 tsc + ESLint + Vitest
- **阻断点（Phase 1 前）**: Dify 侧至少 1 条工作流可演示；Session→Dify 代理设计落地
- **下一步**: Phase 1.0 AI 首次贯通（见 PROJECT_CONTEXT_CARD.md）
- **文件预算**: 宪法 15 文件硬限制需人工对照（实际代码已增长）

### 四、15文件硬限制（当前清单）
已有8：
1. api/auth/[...nextauth]/route.ts
2. api/auth/register/route.ts  
3. api/user/profile/route.ts
4. api/user/avatar/route.ts
5. middleware.ts
6. lib/auth.ts
7. lib/prisma.ts
8. api/dify/route.ts

预留7：
9. api/brands/route.ts
10. studio/page.tsx
11. brands/page.tsx
12. lib/cost-tracker.ts
13. components/studio/generator-form.tsx
14. api/products/route.ts
15. [应急]

### 五、禁止清单（FORBIDDEN）
- ❌ 升级 Next.js 大版本（15/16 已验证冲突）；**@hookform/resolvers 勿盲升**（需全量回归）
- ❌ 前端直接调AI API（必须用Backend-for-AI）
- ❌ Next.js写AI业务逻辑（移Dify Workflow）
- ❌ PowerShell写复杂代码（转义问题）
- ❌ 超过15核心文件
- ❌ 生产环境Prisma db push

### 六、故障降级（L1/L2/L3）
- L1（超时30s）: "⏳ AI响应超时，请稍后重试"
- L2（服务不可用）: "🔧 AI服务维护中，请10分钟后重试"  
- L3（成本熔断¥50）: 强制切换DeepSeek-V3

### 七、编码规范
- 禁止any，禁止@ts-ignore
- 函数必须返回类型，Props必须Interface
- 组件>200行拆分，子组件不计入15限制
- API响应格式: { success, data?, error? }
- 所有async必须try-catch

### 八、AI协作协议
1. **加载**: 人类粘贴本文件，AI背诵确认语
2. **Checklist**: 确认Phase/阻断点/文件预算/禁止清单
3. **编码**: 代码在回复中给出，人类复制到VS Code
4. **交付**: CHECKPOINT格式（完成/文件/验证/失败/下一步）
5. **冲突**: 宪法>AI经验，AI建议需标注"[建议：需人类确认]"

### 九、成本红线
- 单次调用: ≤¥0.5（实际¥0.01-0.12）
- 日预算: ¥50硬上限（熔断）
- 月预算: ¥1,500软上限（审查）

### 十、数据安全（第25条）
- Dify CE部署，DISABLE_TELEMETRY=true
- 用户数据禁止训练公开模型
- 敏感Prompt标注"不可记忆"

---
宪法 v3.0 完整版见 **CONSTITUTION.md**（含 **附录 C：依赖版本修订记录**）
生效日期：[Day 0] / 附录 C 修订：2026-03
