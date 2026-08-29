import { registerSchema, loginSchema } from './auth.schemas.js';
import type { RegisterInput, LoginInput } from './auth.types.js';

/**
 * Validates the register request body against the role-based register schema.
 *
 * @param body - Raw request body (`req.body`).
 * @returns The first validation error message when invalid, otherwise the parsed input.
 */
export function ValidateRegisterBody(body: unknown): RegisterInput | string {
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Invalid request body.';
  }

  return result.data;
}

/**
 * Validates the login request body against the login schema.
 *
 * @param body - Raw request body (`req.body`).
 * @returns The first validation error message when invalid, otherwise the parsed input.
 */
export function ValidateLoginBody(body: unknown): LoginInput | string {
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Invalid request body.';
  }

  return result.data;
}
