/**
 * Best-effort extraction of token / price fields from Dify workflows/run JSON.
 * Shape varies by Dify version and workflow; missing fields become 0 / null.
 */
export type DifyUsageMetrics = {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  costUsd: number | null
}

export function extractDifyUsageMetrics(difyJson: unknown): DifyUsageMetrics {
  if (typeof difyJson !== 'object' || difyJson === null) {
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: null }
  }
  const root = difyJson as {
    data?: {
      usage?: {
        prompt_tokens?: number
        completion_tokens?: number
        total_tokens?: number
        total_price?: number
      }
    }
    usage?: {
      prompt_tokens?: number
      completion_tokens?: number
      total_tokens?: number
      total_price?: number
    }
  }
  const u = root.data?.usage ?? root.usage
  if (!u || typeof u !== 'object') {
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: null }
  }
  const input =
    typeof u.prompt_tokens === 'number' ? u.prompt_tokens : 0
  const output =
    typeof u.completion_tokens === 'number' ? u.completion_tokens : 0
  const total =
    typeof u.total_tokens === 'number'
      ? u.total_tokens
      : input + output
  const price =
    typeof u.total_price === 'number' ? u.total_price : null
  return {
    inputTokens: input,
    outputTokens: output,
    totalTokens: total,
    costUsd: price,
  }
}
