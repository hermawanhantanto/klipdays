import { AUTH_MESSAGES } from './auth.constants.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import type { LoginInput, RegisterInput } from './auth.types.js';

/**
 * Validates the register request body against the role-based register schema.
 *
 * @param body - Raw request body (`req.body`).
 * @returns The first validation error message when invalid, otherwise the parsed input.
 */
export function ValidateRegisterBody(body: unknown): RegisterInput | string {
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const message = firstIssue?.message;

    if (!message || message.startsWith('Invalid discriminator') || message.startsWith('Invalid input')) {
      return AUTH_MESSAGES.INVALID_REQUEST;
    }

    return message;
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
    const firstIssue = result.error.issues[0];
    const message = firstIssue?.message;

    if (!message || message.startsWith('Invalid input')) {
      return AUTH_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED;
    }

    return message;
  }

  return result.data;
}
