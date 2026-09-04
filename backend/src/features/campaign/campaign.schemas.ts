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

const cpmField = z
  .number({ error: 'CPM must be a number.' })
  .positive('CPM must be greater than 0.');

const minViewsField = z
  .number({ error: 'Min views must be a number.' })
  .int('Min views must be an integer.')
  .positive('Min views must be greater than 0.');

const maxViewsField = z
  .number({ error: 'Max views must be a number.' })
  .int('Max views must be an integer.')
  .positive('Max views must be greater than 0.');

const budgetField = z
  .number({ error: 'Budget must be a number.' })
  .positive('Budget must be greater than 0.');

export const campaignMaterialItemSchema = z.object({
  type: z.enum(MaterialType, { error: 'Invalid material type selected.' }),
  name: z.string().trim().min(1, 'Material name is required.'),
  url: z.string().trim().pipe(z.url({ error: 'A valid material URL is required.' })),
});

export const campaignMaterialsSchema = z
  .array(campaignMaterialItemSchema)
  .min(1, 'At least one material is required.');

export const campaignBriefSchema = z.object({
  purpose: z.string().trim().min(1, 'Purpose cannot be empty.').optional(),
  keyMessage: z.string().trim().min(1, 'Key message cannot be empty.').optional(),
  narration: z.string().trim().min(1, 'Narration cannot be empty.').optional(),
  impression: z.string().trim().min(1, 'Impression cannot be empty.').optional(),
  callToAction: z.string().trim().min(1, 'Call to action cannot be empty.').optional(),
  requiredCaption: z.string().trim().min(1, 'Required caption cannot be empty.').optional(),
  hashtags: z.array(z.string().trim().min(1, 'Hashtag item cannot be empty.')).optional(),
  mentionTags: z.array(z.string().trim().min(1, 'Mention tag cannot be empty.')).optional(),
  dos: z.array(z.string().trim().min(1, 'Do guideline cannot be empty.')).optional(),
  donts: z.array(z.string().trim().min(1, 'Don\'t guideline cannot be empty.')).optional(),
  guidelines: z.string().trim().min(1, 'Guidelines cannot be empty.').optional(),
});

// Single edit schema for the creation wizard: every field is optional, so a
// PATCH only needs the fields of the current wizard step. materials, when
// present, must be a non-empty list and replaces the current set; an empty
// array is rejected so materials cannot be wiped by accident.
export const campaignEditSchema = z.object({
  title: titleField.optional(),
  description: descriptionField.optional(),
  campaignType: z.enum(CampaignType, { error: 'Invalid campaign type selected.' }).optional(),
  campaignCategory: z.enum(Category, { error: 'Invalid campaign category selected.' }).optional(),
  thumbnailUrl: thumbnailUrlField.optional(),
  platform: z.enum(Platform, { error: 'Invalid platform selected.' }).optional(),
  mainMediaUrl: mainMediaUrlField.optional(),
  materials: campaignMaterialsSchema.optional(),
  brief: campaignBriefSchema.optional(),
  cpm: cpmField.optional(),
  minViews: minViewsField.optional(),
  maxViews: maxViewsField.optional(),
  budget: budgetField.optional(),
});

