# 已知问题与清理项（Phase 0.8 → 1）

## 包管理器混用（若曾用 npm 安装）

若 `pnpm install` 出现大量 **Moving ... to node_modules/.ignored**，说明目录曾被 **npm** 装过依赖。

**建议在本机做一次干净安装（备份后执行）**：

```powershell
Set-Location D:\cursorpro\deepdify
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.ignored -ErrorAction SilentlyContinue
pnpm install
npx prisma generate
```

是否删除 `pnpm-lock.yaml` 由团队决定：**删除**会全量解析依赖，利于消除漂移；**保留**则更可复现。勿在未提交锁文件前于 CI 依赖「无锁」安装。

## Next.js 14.2.21 安全通告

`pnpm install` 可能提示 next@14.2.21 deprecated（安全更新）。宪法锁定 **14.x**；是否仅升 **14.x 补丁** 需单独评估并与宪法「禁止升 15/16」条款对照。

## Prisma generate 在部分环境 EPERM

若在沙盒或杀毒软件锁定下出现 `query_engine-windows.dll.node` 重命名失败，请在**本机终端**重试 `npx prisma generate`。

---

*随 Phase 1 推进更新；阻塞项请附终端完整输出。*
