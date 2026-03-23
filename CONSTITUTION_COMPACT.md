# BrandCraft宪法精简版 v3.0
## AI快速加载上下文

> **加载确认语**："已加载BrandCraft宪法v3.0，当前阶段[Phase 0 Day 0]，阻断点[登录Bug修复中]，剩余文件预算[8/15]，将严格遵守技术栈锁定。"

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
- **验证桥接**: @hookform/resolvers 3.3.4（禁止latest）
- **数据库**: Neon PostgreSQL + Prisma 5.x
- **AI引擎**: Dify CE（Docker，禁用遥测）

### 三、当前状态（Phase 0 Day 0）
- **阻断点**: 登录Bug（signIn()不触发，已修复为fetch方案）
- **验证中**: test@deepdify.com登录→Dashboard跳转
- **下一步**: Day 1 Dify CE部署（端口3001）
- **文件预算**: 8/15已用（剩余7个）

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
- ❌ 升级Next.js/resolvers（已验证灾难）
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
宪法v3.0完整版见CONSTITUTION.md
生效日期：[Day 0]
