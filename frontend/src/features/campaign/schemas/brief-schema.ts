import { z } from 'zod';

export const briefSchema = z.object({
  purpose: z
    .string()
    .trim()
    .min(1, 'Tujuan kampanye wajib diisi.')
    .max(1000, 'Tujuan kampanye maksimal 1000 karakter.'),
  keyMessage: z
    .string()
    .trim()
    .min(1, 'Pesan utama wajib diisi.')
    .max(1000, 'Pesan utama maksimal 1000 karakter.'),
  callToAction: z
    .string()
    .trim()
    .min(1, 'Call to Action (CTA) wajib diisi.')
    .max(500, 'Call to Action maksimal 500 karakter.'),
  impression: z.string().trim().max(500, 'Kesan konten maksimal 500 karakter.').optional(),
  narration: z.string().trim().max(2000, 'Narasi maksimal 2000 karakter.').optional(),
  requiredCaption: z.string().trim().max(2000, 'Caption wajib maksimal 2000 karakter.').optional(),
  hashtags: z.array(z.string().trim().min(1, 'Tagar tidak boleh kosong.')),
  mentionTags: z.array(z.string().trim().min(1, 'Mention tag tidak boleh kosong.')),
  dos: z.array(z.string().trim().min(1, 'Panduan Do tidak boleh kosong.')),
  donts: z.array(z.string().trim().min(1, 'Panduan Don\'t tidak boleh kosong.')),
  guidelines: z.string().trim().max(3000, 'Panduan tambahan maksimal 3000 karakter.').optional(),
});

export type BriefFormValues = z.infer<typeof briefSchema>;
