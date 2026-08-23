import { z } from 'zod';

import { Industry, Role } from '../../generated/prisma/enums.js';

export const INDUSTRY_OPTIONS = [
  'E-Commerce',
  'Food & Beverage',
  'Fashion & Beauty',
  'Technology',
  'Finance',
  'Health & Wellness',
  'Entertainment',
  'Education',
  'Travel & Hospitality',
  'Other',
] as const;

export type IndustryLabel = (typeof INDUSTRY_OPTIONS)[number];

// Frontend submits display labels; Prisma stores the enum member names.
const INDUSTRY_ENUM_BY_LABEL: Record<IndustryLabel, Industry> = {
  'E-Commerce': Industry.E_COMMERCE,
  'Food & Beverage': Industry.FOOD_AND_BEVERAGE,
  'Fashion & Beauty': Industry.FASHION_AND_BEAUTY,
  Technology: Industry.TECHNOLOGY,
  Finance: Industry.FINANCE,
  'Health & Wellness': Industry.HEALTH_AND_WELLNESS,
  Entertainment: Industry.ENTERTAINMENT,
  Education: Industry.EDUCATION,
  'Travel & Hospitality': Industry.TRAVEL_AND_HOSPITALITY,
  Other: Industry.OTHER,
};

/**
 * Regex for validating Indonesian mobile phone numbers.
 * Validates prefixes 08, +628, or 628 followed by a non-zero digit and 7-10 trailing digits.
 * Supports total length of 10-13 digits for 08xx format.
 */
export const INDONESIAN_PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;

const MIN_PASSWORD_LENGTH = 8;

// Register-only strength rules; login uses min(1) so old or weaker passwords
// can still be checked against their stored hash.
const passwordField = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol.');

// Trim and lowercase run before the email format check, otherwise an email
// with surrounding whitespace would be rejected instead of normalized.
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'A valid email is required.' }));

const phoneNumberField = z
  .string()
  .trim()
  .min(1, 'Phone number is required for brand accounts.')
  .refine((val) => INDONESIAN_PHONE_REGEX.test(val.replace(/[\s-]/g, '')), {
    message:
      'Invalid phone number. Must be a valid Indonesian phone number (e.g. 08123456789 or +628123456789).',
  })
  .transform((val) => val.replace(/[\s-]/g, ''));

const industryField = z
  .string()
  .trim()
  .min(1, 'Industry is required for brand accounts.')
  .refine((val): val is IndustryLabel => INDUSTRY_OPTIONS.includes(val as IndustryLabel), {
    message: 'Invalid industry selected.',
  })
  .transform((val) => INDUSTRY_ENUM_BY_LABEL[val]);

const credentialFields = {
  email: emailField,
  password: passwordField,
};

const registerBrandSchema = z.object({
  role: z.literal(Role.BRAND),
  ...credentialFields,
  companyName: z.string().trim().min(1, 'Company name is required for brand accounts.'),
  phoneNumber: phoneNumberField,
  industry: industryField,
});

const registerCreatorSchema = z.object({
  role: z.literal(Role.CREATOR),
  ...credentialFields,
  fullName: z.string().trim().min(1, 'Full name is required for creator accounts.'),
});

const registerSchema = z.discriminatedUnion('role', [
  registerBrandSchema,
  registerCreatorSchema,
]);

export type RegisterInput = z.infer<typeof registerSchema>;

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

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
