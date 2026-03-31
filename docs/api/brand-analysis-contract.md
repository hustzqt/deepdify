# 品牌分析接口契约 v1.0

> Phase 1 接口定义 | 创建日期：2026-03 | 状态：**草案**

## 概述

前端调用 Next.js API Route，服务端校验 Session 后转发至 **Dify Workflow**（Backend-for-AI），返回结构化品牌分析结果。

与宪法 **§2.2** 一致：响应采用 `{ success, data?, error? }` 形状（本文档内示例与之对齐）。

---

## 1. 前端 → Next.js API Route

### 端点

`POST /api/ai/brand-analyze`

### 请求头

```
Content-Type: application/json
```

**认证（Web 主路径）**：同域请求携带 **NextAuth 会话 Cookie**（`fetch(..., { credentials: 'include' })`）；服务端使用 `auth()` 校验，**不**将 Dify Key 暴露给浏览器。

**可选（非浏览器 / 扩展）**：`Authorization: Bearer <token>` 仅在另行约定 SSO/API token 时启用；Phase 1 默认以 **Cookie Session** 为准。

### 请求体（Request Body）

```json
{
  "brandId": "clxxx...",
  "brandName": "山海咖啡",
  "industry": "精品咖啡零售",
  "targetAudience": "25-35岁都市白领",
  "brandDescription": "主打中国产地精品豆...",
  "analysisType": "full"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `brandId` | 否 | 已有品牌 ID；若提供可从 DB 合并/校验归属 |
| `brandName` | 是 | 品牌名称 |
| `industry` | 是 | 行业 |
| `targetAudience` | 否 | 目标受众 |
| `brandDescription` | 否 | 品牌描述 |
| `analysisType` | 否 | `full` \| `positioning` \| `visual`，默认 `full` |

### Zod 4 验证 Schema（实现参考）

```typescript
import { z } from 'zod'

export const brandAnalyzeRequestSchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().min(1).max(100),
  industry: z.string().min(1).max(100),
  targetAudience: z.string().max(500).optional(),
  brandDescription: z.string().max(2000).optional(),
  analysisType: z.enum(['full', 'positioning', 'visual']).default('full'),
})

export type BrandAnalyzeRequest = z.infer<typeof brandAnalyzeRequestSchema>
```

---

## 2. Next.js API Route → Dify Workflow

### 字段映射（Next → Dify 输入变量）

| Next.js 字段 | Dify 变量名 |
|--------------|-------------|
| `brandName` | `brand_name` |
| `industry` | `industry` |
| `targetAudience` | `target_audience` |
| `brandDescription` | `brand_description` |

### Dify API 调用（服务端）

```
POST {DIFY_BASE_URL}/workflows/run
Authorization: Bearer <DIFY_BRAND_ANALYSIS_KEY 或统一 DIFY_API_KEY>
Content-Type: application/json
```

```json
{
  "inputs": {
    "brand_name": "...",
    "industry": "...",
    "target_audience": "...",
    "brand_description": "..."
  },
  "response_mode": "blocking",
  "user": "<nextauth-user-id>"
}
```

**环境变量**：`DIFY_BASE_URL`（如 `https://api.dify.ai/v1`）、密钥仅存服务端（`.env.local`，已 `.gitignore`）。可与现有 `src/lib/dify.ts` 的 `DIFY_API_KEY` 分 Key（`DIFY_BRAND_ANALYSIS_KEY`）或复用一把 Key，由运维在附录 C 修订记录中注明。

---

## 3. 响应体（Response Body）

### 成功（HTTP 200）

```json
{
  "success": true,
  "data": {
    "analysisId": "ana_xxxx",
    "brandId": "clxxx...",
    "result": {
      "brand_positioning": {
        "core_value": "...",
        "differentiation": "...",
        "personality_traits": ["...", "...", "..."]
      },
      "target_audience_analysis": {
        "primary_demographic": "...",
        "pain_points": ["...", "..."],
        "aspirations": ["...", "..."]
      },
      "brand_voice": {
        "tone": "...",
        "communication_style": "...",
        "sample_tagline": "..."
      },
      "visual_direction": {
        "color_palette_suggestion": ["...", "...", "..."],
        "style_keywords": ["...", "..."],
        "typography_suggestion": "..."
      },
      "confidence_score": 0.85
    },
    "model": "gpt-4o-mini",
    "tokensUsed": 1250,
    "createdAt": "2026-03-28T12:00:00.000Z"
  }
}
```

### Zod 4 响应校验（`result` 主体，实现参考）

```typescript
export const brandAnalysisResultSchema = z.object({
  brand_positioning: z.object({
    core_value: z.string(),
    differentiation: z.string(),
    personality_traits: z.array(z.string()),
  }),
  target_audience_analysis: z.object({
    primary_demographic: z.string(),
    pain_points: z.array(z.string()),
    aspirations: z.array(z.string()),
  }),
  brand_voice: z.object({
    tone: z.string(),
    communication_style: z.string(),
    sample_tagline: z.string(),
  }),
  visual_direction: z.object({
    color_palette_suggestion: z.array(z.string()),
    style_keywords: z.array(z.string()),
    typography_suggestion: z.string(),
  }),
  confidence_score: z.number().min(0).max(1),
})
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "brandName is required",
    "details": []
  }
}
```

| HTTP | `error.code` | 说明 |
|------|----------------|------|
| 400 | `VALIDATION_ERROR` | Zod / 参数校验失败 |
| 401 | `UNAUTHORIZED` | 未登录或 Session 无效 |
| 429 | `RATE_LIMITED` | 超过频率限制，`retryAfter` 秒（可选） |
| 502 | `AI_SERVICE_ERROR` | Dify 超时或不可用，`retryAfter` 建议（可选） |

示例：

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Please sign in to use AI features"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "Brand analysis service temporarily unavailable",
    "retryAfter": 30
  }
}
```

---

## 4. 安全与限制

| 规则 | Phase 1 建议值 |
|------|----------------|
| 认证 | NextAuth session 有效 |
| 频率限制 | 10 次 / 用户 / 小时（可配置） |
| 请求超时 | 30s（blocking） |
| `brandDescription` 最大长度 | 2000 字符 |
| Dify / 模型 Key | 仅服务端环境变量 |

---

## 5. 数据流图

```
┌──────────┐     POST /api/ai/brand-analyze     ┌──────────────┐
│  浏览器   │ ─────────────────────────────────→ │ Next.js API  │
│  (Cookie) │     { brandName, industry, ... }   │ Route        │
│          │ ←────────────────────────────────── │ auth() + Zod │
└──────────┘     { success, data: { result } }   └──────┬───────┘
                                                        │
                                             workflows/run │
                                             (server-side) │
                                                        ▼
                                                 ┌──────────────┐
                                                 │ Dify Cloud   │
                                                 │ Workflow     │
                                                 └──────────────┘
```

---

## 6. Phase 1 范围

| 范围 | Phase 1 |
|------|---------|
| 单次分析（blocking） | ✅ |
| 基础错误处理与 401/502 | ✅ |
| 用户认证（Session） | ✅ |
| 流式输出 | ❌ Phase 2 |
| 分析历史落库 | ❌ Phase 2 |
| 多工作流串联 | ❌ Phase 2+ |

---

## 7. 与现有代码的关系

- 当前仓库已有 **`/api/dify`** 与 **`DifyClient`**（`src/lib/dify.ts`），偏 **Chat** 路径；本契约描述 **Workflow** 路径，实现时可新增专用客户端方法或独立轻量 `fetch`，避免与 Chat 混淆。

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03 | 初稿，仅文档无实现 |
