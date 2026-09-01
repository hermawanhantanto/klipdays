import { z } from 'zod';

import { CampaignType, Category, Platform } from '../../generated/prisma/enums.js';

const titleField = z.string().trim().min(1, 'Title is required.');

const descriptionField = z.string().trim().min(1, 'Description is required.');

const thumbnailUrlField = z
  .string()
  .trim()
  .pipe(z.url({ error: 'A valid thumbnail URL is required.' }))
  .optional();

// Step 1 of the creation wizard. thumbnailUrl is the only optional field;
// the frontend omits it when the brand has not picked a thumbnail yet.
export const campaignStep1Schema = z.object({
  title: titleField,
  description: descriptionField,
  campaignType: z.enum(CampaignType, { error: 'Invalid campaign type selected.' }),
  campaignCategory: z.enum(Category, { error: 'Invalid campaign category selected.' }),
  thumbnailUrl: thumbnailUrlField,
  platform: z.enum(Platform, { error: 'Invalid platform selected.' }),
});
