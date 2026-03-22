/**
 * User and registration-related shared types (aligned with API routes).
 */
import type { z } from 'zod'
import { registerSchema } from '@/lib/validations/auth'

/** Payload sent to POST /api/auth/register */
export type RegisterDTO = z.infer<typeof registerSchema>

/** User fields returned on successful registration */
export interface RegisteredUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SELLER' | 'VIEWER'
  createdAt: string
}

/** Successful JSON body from POST /api/auth/register */
export interface RegisterSuccessResponse {
  success: true
  data: RegisteredUser
  message: string
}

/** Error codes emitted by POST /api/auth/register */
export type RegisterErrorCode =
  | 'VALIDATION_ERROR'
  | 'EMAIL_EXISTS'
  | 'INTERNAL_ERROR'
  | 'PARSE_ERROR'
  | 'NETWORK_ERROR'

/** Error JSON body from POST /api/auth/register */
export interface RegisterErrorResponse {
  success: false
  error: {
    code: RegisterErrorCode | string
    message: string
    details?: unknown
  }
}
