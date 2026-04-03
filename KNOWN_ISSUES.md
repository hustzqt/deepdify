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

## Next.js 14.x 安全补丁

仓库已跟踪 **Next.js 14.2.35**（14.x 补丁线，符合宪法「禁止升 15/16」）。若再次出现弃用提示，在 **14.2.x** 范围内跟进补丁即可。

## `next build` 时 ESLint 选项告警

若出现 `Invalid Options: useEslintrc, extensions`，多为 **ESLint 9** 与 **eslint-config-next 14** 的 peer 期望不一致。当前构建仍可完成；后续可将 ESLint 对齐到 Next 官方推荐版本，或单独收紧 `next lint` 配置。

## Prisma generate 在部分环境 EPERM

若在沙盒或杀毒软件锁定下出现 `query_engine-windows.dll.node` 重命名失败，请在**本机终端**重试 `npx prisma generate`。

---

*随 Phase 1 推进更新；阻塞项请附终端完整输出。*
