import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { Role } from '../../generated/prisma/enums.js';
import { SendError } from '../../utils/api-response.js';

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
 * Express middleware that requires a valid login session: reads the JWT from
 * the `token` cookie, verifies it, and attaches the payload to `req.account`.
 * Responds 401 when the cookie is missing, invalid, or expired.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function, called when the session is valid.
 */
export function RequireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.cookies as Record<string, unknown>).token;

  if (!token || typeof token !== 'string') {
    SendError(res, 'Authentication required.', 401);
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    SendError(res, 'Authentication is not configured.', 500);
    return;
  }

  try {
    req.account = jwt.verify(token, jwtSecret) as AuthPayload;
    next();
  } catch {
    SendError(res, 'Session is invalid or has expired.', 401);
  }
}
