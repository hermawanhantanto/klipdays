import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client.js';
import { Role, Status } from '../../generated/prisma/enums.js';
import { SendError, SendSuccess } from '../../utils/api-response.js';
import { prisma } from '../../utils/prisma.js';
import {
  AUTH_CLEAR_COOKIE_OPTIONS,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  AUTH_MESSAGES,
  AUTH_SALT_ROUNDS,
  AUTH_TOKEN_EXPIRES_IN,
} from './auth.constants.js';
import type { CurrentAccountProfile } from './auth.types.js';
import { ValidateLoginBody, ValidateRegisterBody } from './auth.validators.js';

/**
 * Handles `POST /auth/register`: validates request payload, hashes password with
 * standard salt rounds, and creates account along with its profile atomically.
 *
 * @param req - Express request with the register body.
 * @param res - Express response object.
 * @param next - Express next function to forward unhandled errors.
 */
export async function RegisterAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = ValidateRegisterBody(req.body);

    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    const existingAccountQuery = {
      where: { email: input.email, status: Status.ACTIVE },
    };

    // findFirst instead of findUnique so the filter also excludes soft-deleted accounts
    const existingAccount = await prisma.account.findFirst(existingAccountQuery);

    if (existingAccount) {
      SendError(res, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, AUTH_SALT_ROUNDS);

    // Nested create keeps account + profile in a single atomic write
    const profileData =
      input.role === Role.BRAND
        ? {
            brand: {
              create: {
                companyName: input.companyName,
                phoneNumber: input.phoneNumber,
                industry: input.industry,
              },
            },
          }
        : {
            creator: {
              create: {
                fullName: input.fullName,
              },
            },
          };

    const createPayload = {
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        ...profileData,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    };

    const account = await prisma.account.create(createPayload);

    SendSuccess(res, account, AUTH_MESSAGES.REGISTER_SUCCESS, 201);
  } catch (err) {
    // Unique index on email still exists for soft-deleted accounts; map P2002 to 409
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      SendError(res, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
      return;
    }

    next(err);
  }
}

/**
 * Handles `POST /auth/login`: validates credentials, verifies bcrypt hash,
 * and issues a JWT token inside an httpOnly cookie.
 *
 * @param req - Express request with the login body.
 * @param res - Express response object.
 * @param next - Express next function to forward unhandled errors.
 */
export async function LoginAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = ValidateLoginBody(req.body);

    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    const findAccountQuery = {
      where: { email: input.email, status: Status.ACTIVE },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isEmailVerified: true,
      },
    };

    const account = await prisma.account.findFirst(findAccountQuery);

    if (!account) {
      SendError(res, AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
      return;
    }

    const passwordMatches = await bcrypt.compare(input.password, account.passwordHash);

    if (!passwordMatches) {
      SendError(res, AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
      return;
    }

    // Email verification requirement is bypassed during MVP while email service is configured.
    // When enabled in a later phase, accounts with !account.isEmailVerified will receive 403.
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      SendError(res, AUTH_MESSAGES.CONFIG_MISSING, 500);
      return;
    }

    const tokenPayload = { sub: account.id, role: account.role };
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: AUTH_TOKEN_EXPIRES_IN,
    });

    res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    const loginResponseData = {
      id: account.id,
      email: account.email,
      role: account.role,
    };

    SendSuccess(res, loginResponseData, AUTH_MESSAGES.LOGIN_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /auth/logout`: clears the authentication JWT cookie.
 *
 * @param _req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to forward unhandled errors.
 */
export async function LogoutAccount(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, AUTH_CLEAR_COOKIE_OPTIONS);
    SendSuccess(res, null, AUTH_MESSAGES.LOGOUT_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /auth/me`: retrieves the authenticated user's profile details
 * based on their active session token.
 *
 * @param req - Express request with `req.account` populated by `RequireAuth`.
 * @param res - Express response object.
 * @param next - Express next function to forward unhandled errors.
 */
export async function GetCurrentAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountPayload = req.account;

    if (!accountPayload?.sub) {
      SendError(res, AUTH_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    const accountQuery = {
      where: { id: accountPayload.sub, status: Status.ACTIVE },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        brand: {
          select: {
            id: true,
            companyName: true,
            phoneNumber: true,
            industry: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        admin: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    };

    const account = await prisma.account.findFirst(accountQuery);

    if (!account) {
      SendError(res, AUTH_MESSAGES.ACCOUNT_NOT_FOUND, 404);
      return;
    }

    let displayName = '';
    if (account.role === Role.BRAND && account.brand?.companyName) {
      displayName = account.brand.companyName;
    } else if (account.role === Role.CREATOR && account.creator?.fullName) {
      displayName = account.creator.fullName;
    } else if (account.role === Role.ADMIN && account.admin?.fullName) {
      displayName = account.admin.fullName;
    }

    const profileData: CurrentAccountProfile = {
      id: account.id,
      email: account.email,
      role: account.role,
      name: displayName,
      isEmailVerified: account.isEmailVerified,
      brand: account.brand,
      creator: account.creator,
      admin: account.admin,
    };

    SendSuccess(res, profileData, AUTH_MESSAGES.ACCOUNT_LOADED);
  } catch (err) {
    next(err);
  }
}
