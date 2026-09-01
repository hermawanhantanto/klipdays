import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { prisma } from '../../utils/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import { Role, Status } from '../../generated/prisma/enums.js';

import { SendError, SendSuccess } from '../../utils/api-response.js';

import { ValidateLoginBody, ValidateRegisterBody } from './auth.validators.js';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Handles `POST /auth/register`: validates the body, hashes the password, and
 * creates the account together with its brand or creator profile in one write.
 * Email verification is skipped for now and will be added later.
 *
 * @param req - Express request with the register body.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function RegisterAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = ValidateRegisterBody(req.body);

    // The validator returns the error message as a string on failure and the
    // parsed input object on success, so the typeof check tells the two apart.
    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    // findFirst instead of findUnique so the filter can also exclude
    // soft-deleted accounts; only active accounts count as registered.
    const existingAccount = await prisma.account.findFirst({
      where: { email: input.email, status: Status.ACTIVE },
    });

    if (existingAccount) {
      SendError(res, 'Email is already registered.', 409);
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Nested create keeps account + profile in a single atomic write, so a
    // failed profile insert can never leave an orphaned account behind.
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

    const account = await prisma.account.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        ...profileData,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    SendSuccess(res, account, 'Account registered successfully.', 201);
  } catch (err) {
    // A soft-deleted account still holds its email, so the unique index can
    // fire even after the findFirst check above; map it to the same 409.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      SendError(res, 'Email is already registered.', 409);
      return;
    }

    next(err);
  }
}

/**
 * Handles `POST /auth/login`: validates the credentials, compares the password
 * against the stored bcrypt hash, requires a verified email, and issues a JWT
 * in an httpOnly cookie.
 *
 * @param req - Express request with the login body.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function LoginAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = ValidateLoginBody(req.body);

    // The validator returns the error message as a string on failure and the
    // parsed input object on success, so the typeof check tells the two apart.
    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    // Only active accounts can log in; soft-deleted accounts get the same
    // generic response as unknown emails.
    const account = await prisma.account.findFirst({
      where: { email: input.email, status: Status.ACTIVE },
    });

    if (!account) {
      SendError(res, 'Invalid email or password.', 401);
      return;
    }

    // Same message for unknown email and wrong password, so the response does
    // not reveal whether the email is registered.
    const passwordMatches = await bcrypt.compare(input.password, account.passwordHash);

    if (!passwordMatches) {
      SendError(res, 'Invalid email or password.', 401);
      return;
    }

    if (!account.isEmailVerified) {
      SendError(res, 'Please verify your email before logging in.', 403);
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      SendError(res, 'Authentication is not configured.', 500);
      return;
    }

    const token = jwt.sign({ sub: account.id, role: account.role }, jwtSecret, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    SendSuccess(res, { id: account.id, email: account.email, role: account.role }, 'Logged in successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /auth/logout`: clears the JWT cookie. The cookie options must
 * match the ones used when it was set, otherwise the browser keeps it.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function LogoutAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    SendSuccess(res, null, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
}
