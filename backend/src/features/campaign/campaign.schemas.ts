import { z } from 'zod';
import { CampaignStatus, CampaignType, Category, MaterialType, Platform } from '../../generated/prisma/enums.js';
import { CAMPAIGN_MESSAGES, CAMPAIGN_SORT_OPTIONS } from './campaign.constants.js';

export { CAMPAIGN_SORT_OPTIONS };
export type CampaignSortOption = (typeof CAMPAIGN_SORT_OPTIONS)[number];

const titleField = z
  .string({ error: CAMPAIGN_MESSAGES.TITLE_REQUIRED })
  .trim()
  .min(1, CAMPAIGN_MESSAGES.TITLE_REQUIRED);

const descriptionField = z
  .string({ error: CAMPAIGN_MESSAGES.DESCRIPTION_REQUIRED })
  .trim()
  .min(1, CAMPAIGN_MESSAGES.DESCRIPTION_REQUIRED);

const thumbnailUrlField = z
  .string({ error: CAMPAIGN_MESSAGES.THUMBNAIL_URL_INVALID })
  .trim()
  .pipe(z.url({ error: CAMPAIGN_MESSAGES.THUMBNAIL_URL_INVALID }));

const mainMediaUrlField = z
  .string({ error: CAMPAIGN_MESSAGES.MAIN_MEDIA_URL_INVALID })
  .trim()
  .pipe(z.url({ error: CAMPAIGN_MESSAGES.MAIN_MEDIA_URL_INVALID }));

const cpmField = z
  .number({ error: CAMPAIGN_MESSAGES.CPM_NUMBER_REQUIRED })
  .positive(CAMPAIGN_MESSAGES.CPM_POSITIVE);

const minViewsField = z
  .number({ error: CAMPAIGN_MESSAGES.MIN_VIEWS_NUMBER_REQUIRED })
  .int(CAMPAIGN_MESSAGES.MIN_VIEWS_INTEGER)
  .positive(CAMPAIGN_MESSAGES.MIN_VIEWS_POSITIVE);

const maxViewsField = z
  .number({ error: CAMPAIGN_MESSAGES.MAX_VIEWS_NUMBER_REQUIRED })
  .int(CAMPAIGN_MESSAGES.MAX_VIEWS_INTEGER)
  .positive(CAMPAIGN_MESSAGES.MAX_VIEWS_POSITIVE);

const budgetField = z
  .number({ error: CAMPAIGN_MESSAGES.BUDGET_NUMBER_REQUIRED })
  .positive(CAMPAIGN_MESSAGES.BUDGET_POSITIVE);

const startDateField = z.union(
  [
    z.date(),
    z
      .string({ error: CAMPAIGN_MESSAGES.START_DATE_REQUIRED })
      .trim()
      .min(1, CAMPAIGN_MESSAGES.START_DATE_EMPTY)
      .pipe(z.coerce.date({ error: CAMPAIGN_MESSAGES.START_DATE_REQUIRED })),
  ],
  { error: CAMPAIGN_MESSAGES.START_DATE_REQUIRED }
);

const endDateField = z.union(
  [
    z.date(),
    z
      .string({ error: CAMPAIGN_MESSAGES.END_DATE_REQUIRED })
      .trim()
      .min(1, CAMPAIGN_MESSAGES.END_DATE_EMPTY)
      .pipe(z.coerce.date({ error: CAMPAIGN_MESSAGES.END_DATE_REQUIRED })),
  ],
  { error: CAMPAIGN_MESSAGES.END_DATE_REQUIRED }
);

export const campaignMaterialItemSchema = z.object({
  type: z.enum(MaterialType, { error: CAMPAIGN_MESSAGES.MATERIAL_TYPE_INVALID }),
  name: z.string({ error: CAMPAIGN_MESSAGES.MATERIAL_NAME_REQUIRED }).trim().min(1, CAMPAIGN_MESSAGES.MATERIAL_NAME_REQUIRED),
  url: z
    .string({ error: CAMPAIGN_MESSAGES.MATERIAL_URL_INVALID })
    .trim()
    .pipe(z.url({ error: CAMPAIGN_MESSAGES.MATERIAL_URL_INVALID })),
});

export const campaignMaterialsSchema = z
  .array(campaignMaterialItemSchema)
  .min(1, CAMPAIGN_MESSAGES.MATERIALS_REQUIRED);

export const campaignBriefSchema = z.object({
  purpose: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_PURPOSE_EMPTY).optional(),
  keyMessage: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_KEY_MESSAGE_EMPTY).optional(),
  narration: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_NARRATION_EMPTY).optional(),
  impression: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_IMPRESSION_EMPTY).optional(),
  callToAction: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_CALL_TO_ACTION_EMPTY).optional(),
  requiredCaption: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_REQUIRED_CAPTION_EMPTY).optional(),
  hashtags: z.array(z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_HASHTAG_EMPTY)).optional(),
  mentionTags: z.array(z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_MENTION_TAG_EMPTY)).optional(),
  dos: z.array(z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_DO_GUIDELINE_EMPTY)).optional(),
  donts: z.array(z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_DONT_GUIDELINE_EMPTY)).optional(),
  guidelines: z.string().trim().min(1, CAMPAIGN_MESSAGES.BRIEF_GUIDELINES_EMPTY).optional(),
});

// Single edit schema for the creation wizard: every field is optional, so a
// PATCH only needs the fields of the current wizard step. materials, when
// present, must be a non-empty list and replaces the current set; an empty
// array is rejected so materials cannot be wiped by accident.
export const campaignEditSchema = z.object({
  title: titleField.optional(),
  description: descriptionField.optional(),
  campaignType: z.enum(CampaignType, { error: CAMPAIGN_MESSAGES.CAMPAIGN_TYPE_INVALID }).optional(),
  campaignCategory: z.enum(Category, { error: CAMPAIGN_MESSAGES.CAMPAIGN_CATEGORY_INVALID }).optional(),
  thumbnailUrl: thumbnailUrlField.optional(),
  platform: z.enum(Platform, { error: CAMPAIGN_MESSAGES.PLATFORM_INVALID }).optional(),
  mainMediaUrl: mainMediaUrlField.optional(),
  materials: campaignMaterialsSchema.optional(),
  brief: campaignBriefSchema.optional(),
  cpm: cpmField.optional(),
  minViews: minViewsField.optional(),
  maxViews: maxViewsField.optional(),
  budget: budgetField.optional(),
  startDate: startDateField.optional(),
  endDate: endDateField.optional(),
});

const pageQueryField = z.coerce
  .number({ error: CAMPAIGN_MESSAGES.PAGE_NUMBER_REQUIRED })
  .int(CAMPAIGN_MESSAGES.PAGE_INTEGER)
  .positive(CAMPAIGN_MESSAGES.PAGE_POSITIVE)
  .optional();

const limitQueryField = z.coerce
  .number({ error: CAMPAIGN_MESSAGES.LIMIT_NUMBER_REQUIRED })
  .int(CAMPAIGN_MESSAGES.LIMIT_INTEGER)
  .positive(CAMPAIGN_MESSAGES.LIMIT_POSITIVE)
  .max(100, CAMPAIGN_MESSAGES.LIMIT_MAX_EXCEEDED)
  .optional();

const searchQueryField = z
  .string()
  .trim()
  .max(100, CAMPAIGN_MESSAGES.SEARCH_MAX_EXCEEDED)
  .optional();

export const campaignQuerySortEnum = z.enum(CAMPAIGN_SORT_OPTIONS, {
  error: CAMPAIGN_MESSAGES.SORT_INVALID,
});

export const campaignQuerySchema = z.object({
  page: pageQueryField,
  limit: limitQueryField,
  search: searchQueryField,
  category: z.enum(Category, { error: CAMPAIGN_MESSAGES.CATEGORY_FILTER_INVALID }).optional(),
  campaignType: z.enum(CampaignType, { error: CAMPAIGN_MESSAGES.CAMPAIGN_TYPE_FILTER_INVALID }).optional(),
  platform: z.enum(Platform, { error: CAMPAIGN_MESSAGES.PLATFORM_FILTER_INVALID }).optional(),
  campaignStatus: z.enum(CampaignStatus, { error: CAMPAIGN_MESSAGES.CAMPAIGN_STATUS_FILTER_INVALID }).optional(),
  sort: campaignQuerySortEnum.optional(),
});

export type CampaignMaterialItemInput = z.infer<typeof campaignMaterialItemSchema>;
export type CampaignMaterialsInput = z.infer<typeof campaignMaterialsSchema>;
export type CampaignBriefInput = z.infer<typeof campaignBriefSchema>;
export type CampaignEditInput = z.infer<typeof campaignEditSchema>;
export type CampaignQueryInput = z.infer<typeof campaignQuerySchema>;
