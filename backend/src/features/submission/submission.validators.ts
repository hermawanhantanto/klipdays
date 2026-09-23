import { z } from 'zod';

export const SaveDraftSubmissionSchema = z.object({
  liveVideoUrl: z.string().url('URL video tidak valid.').optional(),
  thumbnailUrl: z.string().url('URL thumbnail tidak valid.').optional(),
  videoCaption: z.string().max(2000, 'Caption terlalu panjang.').optional(),
  socialAccountId: z.string().uuid('ID akun sosial tidak valid.').optional(),
});

export const FinalSubmitVideoSchema = z.object({
  liveVideoUrl: z.string().url('URL video TikTok harus berupa URL yang valid.').optional(),
  thumbnailUrl: z.string().url('URL thumbnail tidak valid.').optional(),
  videoCaption: z.string().max(2000, 'Caption terlalu panjang.').optional(),
  socialAccountId: z.string().uuid('ID akun sosial tidak valid.').optional(),
});
