import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  AUTH_COOKIE_NAME,
  AUTH_MESSAGES,
} from '../features/authentication/auth.constants.js';
import type { Role } from '../generated/prisma/enums.js';
import { SendError } from '../utils/api-response.js';

export interface AuthPayload {
  sub: string;
  role: Role;
}

declare module 'express-serve-static-core' {
  interface Request {
    account?: AuthPayload;
  }
}

/**
 * Express middleware that requires a valid login session:
 * 1. Checks the httpOnly cookie (`token`).
 * 2. Falls back to `Authorization: Bearer <token>` header if present.
 * 3. Verifies the token and attaches the decoded payload to `req.account`.
 * Responds 401 when the token is missing, invalid, or expired.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function, called when the session is valid.
 */
export function RequireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const cookieToken =
    typeof cookies?.[AUTH_COOKIE_NAME] === 'string'
      ? cookies[AUTH_COOKIE_NAME]
      : undefined;

  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : undefined;

  const token = cookieToken ?? bearerToken;

  if (!token) {
    SendError(res, AUTH_MESSAGES.AUTH_REQUIRED, 401);
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    SendError(res, AUTH_MESSAGES.CONFIG_MISSING, 500);
    return;
  }

  try {
    req.account = jwt.verify(token, jwtSecret) as AuthPayload;
    next();
  } catch {
    SendError(res, AUTH_MESSAGES.SESSION_EXPIRED, 401);
  }
}
