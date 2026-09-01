import { z } from 'zod';

import { CampaignType, Category, MaterialType, Platform } from '../../generated/prisma/enums.js';

const titleField = z.string().trim().min(1, 'Title is required.');

const descriptionField = z.string().trim().min(1, 'Description is required.');

const thumbnailUrlField = z
  .string()
  .trim()
  .pipe(z.url({ error: 'A valid thumbnail URL is required.' }));

const mainMediaUrlField = z
  .string()
  .trim()
  .pipe(z.url({ error: 'A valid main media URL is required.' }));

const materialField = z.object({
  type: z.enum(MaterialType, { error: 'Invalid material type selected.' }),
  name: z.string().trim().min(1, 'Material name is required.'),
  url: z.string().trim().pipe(z.url({ error: 'A valid material URL is required.' })),
});

// Single edit schema for the creation wizard: every field is optional, so a
// PATCH only needs the fields of the current wizard step. materials, when
// present, must be a non-empty list and replaces the current set; an empty
// array is rejected so materials cannot be wiped by accident.
export const campaignEditSchema = z
  .object({
    title: titleField.optional(),
    description: descriptionField.optional(),
    campaignType: z.enum(CampaignType, { error: 'Invalid campaign type selected.' }).optional(),
    campaignCategory: z.enum(Category, { error: 'Invalid campaign category selected.' }).optional(),
    thumbnailUrl: thumbnailUrlField.optional(),
    platform: z.enum(Platform, { error: 'Invalid platform selected.' }).optional(),
    mainMediaUrl: mainMediaUrlField.optional(),
    materials: z.array(materialField).min(1, 'At least one material is required.').optional(),
  })
  .refine((input) => Object.values(input).some((value) => value !== undefined), {
    message: 'At least one field is required.',
  });
