import { z } from 'zod'

/**
 * Validation schema for the sign in form.
 * Enforces a valid email format and a non-empty password.
 */
export const signInSchema = z.object({
  email: z.string().trim().email('Email tidak valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
})

export type SignInFormValues = z.infer<typeof signInSchema>
