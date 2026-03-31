# Dify / Next / 中转 / Cursor — 逐步填空表

> **禁止**在本文档中粘贴真实 API Key；密钥只放在 `.env`（已 gitignore）或密码管理器。若曾误贴密钥，须到对应平台**立即作废并轮换**。

---

## 文首三项（请勾选或填写）

| 问题 | 你的选择（填：是 / 否 / 说明） |
|------|--------------------------------|
| **是否使用 API 中转**（国内聚合 OpenAI/Claude 等） | **是**（51api） |
| **Dify 控制台是否通过本机 80 端口访问**（如 `http://localhost`） | **是**（与当前 Docker/Nginx 一致时填是） |
| **Cursor 是否使用「自定义 OpenAI Base URL / API Key」** | ＿＿＿＿（若用 51api 写代码则填「是」） |

**中转商名称（若「是」）**：51api（`www.51api.org`）

**当前记录（OpenAI/Claude 经中转）**：`51api.org` — 官方对话接口形态为：

`POST https://www.51api.org/v1/chat/completions`

---

## 一、Dify CE —「模型供应商」里填什么

> 路径：**设置 → 模型供应商**（名称可能为 Settings → Model Provider）

### 1.1 官方直连（未用中转）

| 供应商类型 | 在 Dify 里通常出现的字段名 | 你填什么 |
|------------|---------------------------|----------|
| OpenAI | **API Key** | `sk-` 开头密钥（**仅官网**；若走中转见 §1.3，勿混填） |
| OpenAI | **Base URL**（若有） | 默认留空或 `https://api.openai.com/v1`（以 Dify 版本说明为准） |
| DeepSeek | **API Key** | DeepSeek 控制台密钥 |
| Moonshot / Kimi | **API Key** | Moonshot 控制台密钥 |

### 1.2 使用中转（聚合站）

中转商界面常见名：**API Key**、**Base URL**、**接口地址**、**代理地址**。在 Dify 添加 **OpenAI-API-compatible** 或该中转说明中的 **兼容类型** 时：

| Dify 字段（常见） | 填什么 |
|-------------------|--------|
| **API Key** / **密钥** | 中转站给你的 **Key**（多为非 `sk-` 或带前缀，以中转说明为准） |
| **API Base** / **Base URL** / **OpenAI API 地址** | 中转提供的 **根地址**（是否含 `/v1` **以中转文档为准**；错误会导致 404） |
| **模型列表** | 保存 Key 后点 **同步/获取模型**，在下拉里选真实 model id |

> 若同一中转提供多条线路，按中转文档选 **Chat / 对话** 线路对应的 Base。

### 1.3 示例：`51api.org`（OpenAI 兼容）

接口文档给出的完整路径为 **`.../v1/chat/completions`** 时，在 **Dify / Cursor** 里填 **Base** 时只填到 **`/v1`**，**不要**把 `/chat/completions` 写进 Base（客户端会自动请求该路径）。

| 位置 | 填什么 |
|------|--------|
| **Dify → 模型供应商**（OpenAI-API-compatible 或「OpenAI」类 + 自定义 Base） | **API Base / Base URL**：`https://www.51api.org/v1` |
| **Dify → 同上** | **API Key**：在 51api 控制台生成（**不是** Dify 的 `app-`） |
| **Cursor → Override OpenAI Base URL**（若启用自定义） | `https://www.51api.org/v1` |
| **Cursor → OpenAI API Key** | 与 Dify 中 51api 所用密钥相同（或按 Cursor 要求单独建 Key） |

**不要**把 `https://www.51api.org/v1/chat/completions` 整段填进 Base，否则常见 SDK 会拼成 **重复路径** 导致 404。

**Next.js `DIFY_BASE_URL`**：仍只填 **本机 Dify 网关**（如 `http://localhost/v1`），**不是** 51api 地址；51api 只在 **Dify 模型供应商** 侧使用。

---

## 二、Dify CE — 应用「API 密钥」（给 Next 用）

> 路径：**工作室 → 选中应用 → 访问 API / API / 开发者**

| 字段名（常见） | 填什么 | 用途 |
|----------------|--------|------|
| **API Key** / **应用密钥** | 以 `app-` 开头的密钥（在 Dify **新建**） | 仅用于 **Next.js `DIFY_API_KEY`**，**不是** OpenAI `sk-` |

复制后保存到密码管理器；泄露则 **在 Dify 作废并重建**。

---

## 三、Next.js 本仓库 — `.env` / `.env.local` 填什么

> 代码见：`src/lib/dify.ts`（读取 `DIFY_BASE_URL`、`DIFY_API_KEY`）

### 3.1 与「Dify 是否走 80」的关系

| 你的情况 | `DIFY_BASE_URL` 填空 |
|----------|----------------------|
| **是**：浏览器用 `http://localhost`（无端口）打开 Dify | `http://localhost/v1` |
| **否**：例如用 `http://localhost:3001` 打开 Dify | `http://localhost:3001/v1`（以你**实际浏览器地址**为准，**末尾必须有 `/v1`**） |

| 变量名 | 填空 |
|--------|------|
| `DIFY_BASE_URL` | 上表 + **必须 `/v1` 结尾** |
| `DIFY_API_KEY` | 第二节复制的 **`app-...`** |

**不要**把 OpenAI/中转的 `sk-` 填进 `DIFY_API_KEY`。

### 3.2 直连供应商（可选，仅本地脚本 / 非 Dify 调用时需要）

| 变量名 | 何时填 |
|--------|--------|
| `DEEPSEEK_API_KEY` | 本地直连 DeepSeek |
| `OPENAI_API_KEY` | 本地直连 OpenAI |
| `MOONSHOT_API_KEY` | 本地直连 Kimi（见宪法附录） |

改完后执行：**重启** `pnpm dev`。

---

## 四、Cursor — 是否「自定义 OpenAI」

| 你的选择 | 操作 |
|----------|------|
| **否** | 使用 Cursor 自带计费模型即可，**不必**填 OpenAI Key。 |
| **是** | **Settings → Models / OpenAI API**（名称以当前版本为准）：**API Key** 填中转或官方 Key；**Override Base URL**（若有）填中转 **Base URL**。与 **Dify 无关**，也 **不要** 填 `app-` 密钥。 |

---

## 五、联调自检（填空：通过 / 失败）

| 步骤 | 结果 |
|------|------|
| Dify 控制台内，应用 **试运行** 能出回复 | ＿＿＿＿（须本地在 Dify 内点一次） |
| 浏览器打开 `http://localhost`（无 `/v1`）能进 Dify 首页 | ＿＿＿＿（走 80 时 `DIFY_BASE_URL=http://localhost/v1`） |
| 项目根目录 `.env` 已设 `DIFY_BASE_URL`、`DIFY_API_KEY`（`app-`）且已重启 dev | ＿＿＿＿（勿把本文档提交 Git） |
| 已登录本站，`POST /api/dify` 返回 200 或业务预期错误（非 401） | ＿＿＿＿ |

> 以上「结果」无法由仓库自动代填，须在浏览器与终端完成自检后手写。

---

## 六、常见错填

| 错误 | 后果 |
|------|------|
| 把 `sk-` 填进 `DIFY_API_KEY` | Next 调 Dify 失败 |
| `DIFY_BASE_URL` 无 `/v1` 或端口与浏览器不一致 | 404 / 连错环境 |
| 中转 Base URL 多写或少写 `/v1` | 供应商校验失败 |
| Base 误填为完整 `.../v1/chat/completions` | 路径重复，请求失败 |
| 旧 `app-` 未作废就泄露 | 额度被盗用 |

---

**文档版本**：与 `CONSTITUTION.md` 附录、§7.6 一致；模型逻辑别名见 **附录B**。
