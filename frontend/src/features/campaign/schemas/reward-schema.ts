import { z } from 'zod';

const cpmField = z
  .number({ error: 'Tarif CPM wajib diisi angka.' })
  .positive('Tarif CPM harus lebih besar dari Rp 0.');

const minViewsField = z
  .number({ error: 'Penayangan minimum wajib diisi angka.' })
  .int('Penayangan minimum harus berupa bilangan bulat.')
  .positive('Penayangan minimum harus lebih besar dari 0.');

const maxViewsField = z
  .number({ error: 'Batas penayangan maksimum wajib diisi angka.' })
  .int('Batas penayangan maksimum harus berupa bilangan bulat.')
  .positive('Batas penayangan maksimum harus lebih besar dari 0.');

const budgetField = z
  .number({ error: 'Total anggaran wajib diisi angka.' })
  .positive('Total anggaran harus lebih besar dari Rp 0.');

const startDateField = z
  .string()
  .trim()
  .min(1, 'Tanggal mulai kampanye wajib diisi.');

const endDateField = z
  .string()
  .trim()
  .min(1, 'Tanggal berakhir kampanye wajib diisi.');

/**
 * Validation schema for campaign creation wizard Step 4 (Hadiah & Anggaran).
 * Validates CPM, min/max views, total escrow budget, and campaign date range.
 */
export const rewardSchema = z
  .object({
    cpm: cpmField,
    minViews: minViewsField,
    maxViews: maxViewsField,
    budget: budgetField,
    startDate: startDateField,
    endDate: endDateField,
  })
  .refine((data) => data.maxViews >= data.minViews, {
    message: 'Batas penayangan maksimum tidak boleh lebih kecil dari penayangan minimum.',
    path: ['maxViews'],
  })
  .refine((data) => data.budget >= data.cpm, {
    message: 'Total anggaran tidak boleh lebih kecil dari tarif CPM.',
    path: ['budget'],
  })
  .refine(
    (data) => {
      if (!data.startDate) return true;
      const start = new Date(data.startDate);
      start.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return start >= today;
    },
    {
      message: 'Tanggal mulai tidak boleh lebih awal dari hari ini.',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'Tanggal berakhir harus lebih lambat dari tanggal mulai.',
      path: ['endDate'],
    }
  );

export type RewardFormValues = z.infer<typeof rewardSchema>;
