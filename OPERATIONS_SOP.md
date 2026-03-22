# Deepdify 项目操作 SOP 手册 (OPERATIONS_SOP.md)
# 标准作业程序：遇到X情况，执行Y操作
# 目标：减少思考成本，形成肌肉记忆

---

## SOP-001：代码修改后不生效（热更新失效）

触发条件：修改文件后浏览器行为无变化
优先级：P0（最高频）

操作步骤：
1. 确认文件已保存（VS Code标签页无白点）
2. PowerShell验证：cat "文件路径" | findstr "修改的关键词"
3. 浏览器：F12 → Network → 勾选"Disable Cache"
4. 强制刷新：Ctrl + Shift + R
5. 如果仍不生效 → 执行SOP-002（重启服务器）

禁止操作：
- 不要连续多次修改（确认生效后再改）
- 不要在PowerShell中用Set-Content写代码

---

## SOP-002：重启开发服务器（终极刷新）

触发条件：SOP-001无效 / 遇到奇怪错误 / 安装新依赖后
优先级：P0

操作步骤：
1. 在运行 pnpm dev 的窗口按 Ctrl + C（可能需要两次）
2. 确认看到 terminated 或回到 PS D:\...&gt; 提示符
3. 执行：pnpm dev
4. 等待显示 Ready in xxx ms
5. 浏览器新开无痕模式（Ctrl+Shift+N）测试

PowerShell命令：
cd D:\cursorpro\deepdify
pnpm dev

---

## SOP-003：验证文件内容（防止代码损坏）

触发条件：不确定代码是否正确写入 / PowerShell写入后
优先级：P1

操作步骤：
1. 使用cat查看：cat "文件路径"
2. 或使用findstr搜索关键词：cat "文件路径" | findstr "关键函数名"
3. 确认关键代码存在且未被截断

示例：
cat "src\app\(auth)\login\page.tsx" | findstr "window.location"

---

## SOP-004：验证登录功能（Phase 2验收）

触发条件：修改登录相关代码后
优先级：P0（当前主任务）

操作步骤：
1. 浏览器打开 http://localhost:3000/login
2. F12 → Network → 勾选"Disable Cache" → 清空
3. F12 → Console → 保持打开
4. 输入测试账号：test@deepdify.com / Test123456
5. 点击登录，观察：
   - Network是否有 POST /api/auth/callback/credentials 请求
   - Console是否有红色报错
   - 页面是否跳转到 /dashboard
6. 如果成功 → 执行SOP-005（Session持久化验证）

成功标准：
- Network显示credentials请求状态200
- Console无报错
- 地址栏变为 /dashboard
- Cookies中出现 next-auth.session-token

---

## SOP-005：验证Session持久化

触发条件：SOP-004登录成功
优先级：P1

操作步骤：
1. 登录成功后停留在Dashboard页面
2. 按 Ctrl + Shift + R 强制刷新
3. 观察：
   - 是否仍在Dashboard？（通过）
   - 还是被踢回Login？（失败）
4. 检查Cookies：F12 → Application → Cookies → localhost
   - 是否存在 next-auth.session-token？
   - 是否有过期时间？

---

## SOP-006：新开AI对话（标准启动流程）

触发条件：需要开始新任务 / 当前对话过长 / AI失忆
优先级：P0（关键）

操作步骤：
1. 复制 PROJECT_CONTEXT_CARD.md 全文
2. 作为新对话的第一条消息发送
3. 在"本次对话目标"处填写具体任务
4. 等待AI确认理解上下文（应复述技术栈版本和阻断点）
5. 才开始描述具体问题

禁止：
- 不要在新对话直接说"帮我改个bug"而不给上下文
- 不要在对话中途切换话题（开新对话）

---

## SOP-007：环境变量检查

触发条件：遇到认证/数据库连接问题
优先级：P0

检查清单：
1. 确认文件存在：dir .env*
2. 确认内容正确：cat .env
3. 确认包含：
   - DATABASE_URL（postgresql://...）
   - NEXTAUTH_URL（http://localhost:3000）
   - NEXTAUTH_SECRET（32位以上字符串）
4. 确认Prisma用.env（不是.env.local）
5. 修改后必须执行SOP-002（重启服务器）

---

# SOP使用原则
# 1. 遇到问题时先查此手册，不要凭记忆操作
# 2. 严格按照步骤顺序执行，不要跳过
# 3. 执行后记录结果（成功/失败），反馈给AI更新SOP
# 4. 如果SOP无效，开新对话并标记"需要更新SOP-XXX"