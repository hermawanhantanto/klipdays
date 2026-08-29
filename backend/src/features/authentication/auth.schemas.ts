import { z } from 'zod';

import { Industry, Role } from '../../generated/prisma/enums.js';

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
    message: 'Invalid phone number. Must be a valid Indonesian phone number (e.g. 08123456789 or +628123456789).',
  })
  .transform((val) => val.replace(/[\s-]/g, ''));

const registerBrandSchema = z.object({
  role: z.literal(Role.BRAND),
  email: emailField,
  password: passwordField,
  companyName: z.string().trim().min(1, 'Company name is required for brand accounts.'),
  phoneNumber: phoneNumberField,
  industry: z.enum(Industry, { error: 'Invalid industry selected.' }),
});

const registerCreatorSchema = z.object({
  role: z.literal(Role.CREATOR),
  email: emailField,
  password: passwordField,
  fullName: z.string().trim().min(1, 'Full name is required for creator accounts.'),
});

// ***** EXPORTED SCHEMAS *****
export const registerSchema = z.discriminatedUnion('role', [registerBrandSchema, registerCreatorSchema]);

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required.'),
});


