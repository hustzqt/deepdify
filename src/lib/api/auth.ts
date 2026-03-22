/**
 * Client-side auth API helpers (browser fetch to Next.js route handlers).
 */
import type {
  RegisterDTO,
  RegisterSuccessResponse,
  RegisteredUser,
} from '@/types/user'

/** Thrown when registration fails with a known API error payload */
export class RegisterApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown
  ) {
    super(message)
    this.name = 'RegisterApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseRegisterSuccess(json: unknown): RegisterSuccessResponse {
  if (!isRecord(json)) {
    throw new RegisterApiError('无效的响应格式', 'PARSE_ERROR', 500)
  }
  if (json.success !== true) {
    throw new RegisterApiError('无效的响应格式', 'PARSE_ERROR', 500)
  }
  const data = json.data
  if (!isRecord(data)) {
    throw new RegisterApiError('无效的响应格式', 'PARSE_ERROR', 500)
  }
  const id = data.id
  const name = data.name
  const email = data.email
  const role = data.role
  const createdAt = data.createdAt
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof createdAt !== 'string' ||
    (role !== 'ADMIN' && role !== 'SELLER' && role !== 'VIEWER')
  ) {
    throw new RegisterApiError('无效的响应格式', 'PARSE_ERROR', 500)
  }
  const user: RegisteredUser = {
    id,
    name,
    email,
    role,
    createdAt,
  }
  const message =
    typeof json.message === 'string' ? json.message : '注册成功'
  return { success: true, data: user, message }
}

function parseRegisterError(
  json: unknown,
  status: number
): RegisterApiError {
  if (!isRecord(json) || json.success !== false) {
    return new RegisterApiError('注册失败', 'INTERNAL_ERROR', status)
  }
  const err = json.error
  if (!isRecord(err)) {
    return new RegisterApiError('注册失败', 'INTERNAL_ERROR', status)
  }
  const code =
    typeof err.code === 'string' ? err.code : 'INTERNAL_ERROR'
  const message =
    typeof err.message === 'string' ? err.message : '注册失败'
  const details = err.details
  return new RegisterApiError(message, code, status, details)
}

/**
 * Registers a new user via POST /api/auth/register.
 *
 * @param dto - Validated registration fields
 * @returns Created user and server message on success
 * @throws RegisterApiError on business or transport errors
 */
export async function registerUser(
  dto: RegisterDTO
): Promise<RegisterSuccessResponse> {
  let response: Response
  try {
    response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'same-origin',
    })
  } catch (cause: unknown) {
    const msg =
      cause instanceof Error ? cause.message : '网络异常，请稍后重试'
    throw new RegisterApiError(msg, 'NETWORK_ERROR', 0)
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new RegisterApiError('无法解析服务器响应', 'PARSE_ERROR', response.status)
  }

  if (response.ok && isRecord(json) && json.success === true) {
    return parseRegisterSuccess(json)
  }

  throw parseRegisterError(json, response.status)
}
