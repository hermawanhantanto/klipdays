import { z } from 'zod';
import { SOCIAL_ACCOUNT_MESSAGES } from './social-account.constants.js';

const usernameSchema = z
  .string({ error: SOCIAL_ACCOUNT_MESSAGES.USERNAME_REQUIRED })
  .trim()
  .min(1, SOCIAL_ACCOUNT_MESSAGES.USERNAME_REQUIRED)
  .max(50, SOCIAL_ACCOUNT_MESSAGES.USERNAME_TOO_LONG)
  .regex(/^[a-zA-Z0-9._]+$/, SOCIAL_ACCOUNT_MESSAGES.USERNAME_INVALID_FORMAT);

export const RequestCodeSchema = z.object({
  username: usernameSchema,
});

export const VerifyBioSchema = z.object({
  username: usernameSchema,
});

export const ValidateVideoUrlSchema = z.object({
  videoUrl: z
    .string({ error: SOCIAL_ACCOUNT_MESSAGES.VIDEO_URL_INVALID })
    .trim()
    .url(SOCIAL_ACCOUNT_MESSAGES.VIDEO_URL_INVALID)
    .refine((url) => url.includes('tiktok.com/'), SOCIAL_ACCOUNT_MESSAGES.VIDEO_URL_MUST_BE_TIKTOK),
});
