import { z } from 'zod'

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
] as const

export type Industry = (typeof INDUSTRY_OPTIONS)[number]

/**
 * Regex for validating Indonesian mobile phone numbers.
 * Validates prefixes 08, +628, or 628 followed by a non-zero digit and 7-10 trailing digits.
 * Supports total length of 10-13 digits for 08xx format.
 */
export const INDONESIAN_PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/

const MIN_PASSWORD_LENGTH = 8

// Mirrors the password strength rules enforced by the backend register schema,
// so invalid passwords are rejected before a request is ever sent.
const passwordField = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`)
  .regex(/[A-Z]/, 'Kata sandi harus mengandung huruf kapital.')
  .regex(/[0-9]/, 'Kata sandi harus mengandung angka.')
  .regex(/[^A-Za-z0-9]/, 'Kata sandi harus mengandung simbol.')

/**
 * Flat shape for every field the form can hold. Which fields are required
 * depends on the chosen role and is enforced by the refinement below.
 */
const signUpBaseSchema = z.object({
  role: z.enum(['CREATOR', 'BRAND']),
  email: z.string().trim().email('Email tidak valid.'),
  password: passwordField,
  fullName: z.string().trim(),
  companyName: z.string().trim(),
  phoneNumber: z.string().trim(),
  industry: z.string().trim(),
})

export const signUpSchema = signUpBaseSchema.superRefine((values, ctx) => {
  if (values.role === 'CREATOR') {
    if (!values.fullName || values.fullName.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['fullName'],
        message: 'Nama lengkap wajib diisi.',
      })
    }
    return
  }

  if (values.role === 'BRAND') {
    if (!values.companyName || values.companyName.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['companyName'],
        message: 'Nama perusahaan wajib diisi.',
      })
    }

    if (!values.phoneNumber || values.phoneNumber.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['phoneNumber'],
        message: 'Nomor telepon wajib diisi.',
      })
    } else {
      const sanitizedPhone = values.phoneNumber.replace(/[\s-]/g, '')
      if (!INDONESIAN_PHONE_REGEX.test(sanitizedPhone)) {
        ctx.addIssue({
          code: 'custom',
          path: ['phoneNumber'],
          message: 'Nomor telepon tidak valid. Gunakan format nomor Indonesia (contoh: 08123456789 atau +628123456789).',
        })
      }
    }

    if (!values.industry || values.industry.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['industry'],
        message: 'Industri wajib dipilih.',
      })
    } else if (!INDUSTRY_OPTIONS.includes(values.industry as Industry)) {
      ctx.addIssue({
        code: 'custom',
        path: ['industry'],
        message: 'Pilih industri yang valid dari daftar.',
      })
    }
  }
})

export type SignUpFormValues = z.infer<typeof signUpBaseSchema>
