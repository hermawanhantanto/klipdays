import { z } from 'zod';

export const RequestCodeSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username TikTok tidak boleh kosong.')
    .max(50, 'Username TikTok terlalu panjang.')
    .regex(/^[a-zA-Z0-9._]+$/, 'Format username TikTok hanya boleh huruf, angka, titik, dan garis bawah.'),
});

export const VerifyBioSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username TikTok tidak boleh kosong.')
    .max(50, 'Username TikTok terlalu panjang.')
    .regex(/^[a-zA-Z0-9._]+$/, 'Format username TikTok hanya boleh huruf, angka, titik, dan garis bawah.'),
});

export const ValidateVideoUrlSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .url('Format URL video TikTok tidak valid.')
    .refine(
      (url) => url.includes('tiktok.com/'),
      'URL harus berupa tautan video TikTok yang valid (tiktok.com).',
    ),
});
