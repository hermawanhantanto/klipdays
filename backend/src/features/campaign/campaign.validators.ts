import type { Prisma } from '../../generated/prisma/client.js';

import { campaignEditSchema, campaignQuerySchema } from './campaign.schemas.js';

import type { CampaignEditInput, CampaignQueryInput } from './campaign.types.js';

export interface CampaignExistingFields {
  minViews?: number | null;
  maxViews?: number | null;
  budget?: Prisma.Decimal | number | null;
  cpm?: Prisma.Decimal | number | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}

export type CampaignExistingRewardFields = CampaignExistingFields;

/**
 * Validates the campaign edit request body against the edit schema.
 * Every field is optional: a PATCH carries only the fields of the current
 * wizard step, but at least one known field must be present.
 *
 * @param body - Raw request body (`req.body`).
 * @returns The first validation error message when invalid, otherwise the parsed input.
 */
export function ValidateCampaignEditBody(body: unknown): CampaignEditInput | string {
  const result = campaignEditSchema.safeParse(body);

  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Invalid request body.';
  }

  return result.data;
}

/**
 * Validates reward and pricing rules for campaign edit input.
 * Ensures that maxViews is not less than minViews, and budget is not less than CPM.
 *
 * @param input - The parsed campaign edit input.
 * @param existing - Optional existing campaign fields from the database.
 * @returns An error message string if a rule is violated, otherwise null.
 */
export function ValidateCampaignRewardLogic(input: CampaignEditInput, existing?: CampaignExistingFields): string | null {
  const effectiveMinViews = input.minViews ?? existing?.minViews ?? 0;
  const effectiveMaxViews = input.maxViews ?? existing?.maxViews ?? 0;

  if (effectiveMaxViews < effectiveMinViews) {
    return 'Max views cannot be less than min views.';
  }

  const effectiveBudget = input.budget ?? existing?.budget ?? 0;
  const effectiveCpm = input.cpm ?? existing?.cpm ?? 0;

  if (effectiveBudget < effectiveCpm) {
    return 'Budget cannot be less than CPM.';
  }

  return null;
}

/**
 * Validates campaign schedule and date rules for edit input.
 * Ensures that start date cannot be less than today, and end date must be strictly greater than start date.
 *
 * @param input - The parsed campaign edit input.
 * @param existing - Optional existing campaign fields from the database.
 * @returns An error message string if a rule is violated, otherwise null.
 */
export function ValidateCampaignDateLogic(input: CampaignEditInput, existing?: CampaignExistingFields): string | null {
  if (!input.startDate || !input.endDate) return null;

  const effectiveStartDate = new Date(input.startDate);
  const effectiveEndDate = new Date(input.endDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDateOnly = new Date(effectiveStartDate);
  startDateOnly.setHours(0, 0, 0, 0);

  if (startDateOnly < today) {
    return 'Start date cannot be less than today.';
  }

  if (effectiveEndDate <= effectiveStartDate) {
    return 'End date must be greater than start date.';
  }

  return null;
}

export interface CampaignSubmitCheckRecord {
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  mainMediaUrl?: string | null;
  campaignType?: string | null;
  campaignCategory?: string | null;
  platform?: string | null;
  cpm?: Prisma.Decimal | number | string | null;
  budget?: Prisma.Decimal | number | string | null;
  minViews?: number | null;
  maxViews?: number | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  materials?: Array<{ id: string; name: string; type: string; url: string; status: string }>;
  brief?: {
    purpose?: string | null;
    keyMessage?: string | null;
    callToAction?: string | null;
  } | null;
}

/**
 * Validates campaign completeness across all 4 creation wizard steps
 * before allowing final submission for review.
 *
 * @param campaign - The campaign entity with active materials and brief relations.
 * @returns Error string message if incomplete, or null if complete and valid.
 */
export function ValidateCampaignSubmitCompleteness(campaign: CampaignSubmitCheckRecord): string | null {
  // Step 1: Basic Info
  const hasTitle = Boolean(campaign.title && campaign.title.trim() !== '');
  const hasDesc = Boolean(campaign.description && campaign.description.trim() !== '');
  const hasThumb = Boolean(campaign.thumbnailUrl && campaign.thumbnailUrl.trim() !== '');
  const hasMedia = Boolean(campaign.mainMediaUrl && campaign.mainMediaUrl.trim() !== '');
  const hasType = Boolean(campaign.campaignType);
  const hasCat = Boolean(campaign.campaignCategory);
  const hasPlat = Boolean(campaign.platform);

  if (!hasTitle || !hasDesc || !hasThumb || !hasMedia || !hasType || !hasCat || !hasPlat) {
    return 'Langkah 1 belum lengkap: Judul, deskripsi, kategori, platform, tautan media utama, dan thumbnail wajib diisi.';
  }

  // Step 2: Materials & Assets
  const activeMaterials = campaign.materials?.filter((item) => item.status === 'ACTIVE') ?? [];
  if (activeMaterials.length === 0) {
    return 'Langkah 2 belum lengkap: Minimal 1 materi kampanye aktif wajib diunggah.';
  }

  const allMaterialsValid = activeMaterials.every((item) => {
    const hasName = Boolean(item.name && item.name.trim() !== '');
    const hasItemType = Boolean(item.type);
    const hasUrl = Boolean(item.url && item.url.trim() !== '');
    return hasName && hasItemType && hasUrl;
  });

  if (!allMaterialsValid) {
    return 'Langkah 2 belum lengkap: Semua materi kampanye harus memiliki nama, jenis, dan URL yang valid.';
  }

  // Step 3: Brief & Guidelines
  const brief = campaign.brief;
  if (!brief) {
    return 'Langkah 3 belum lengkap: Brief dan panduan kampanye wajib diisi.';
  }

  const hasPurpose = Boolean(brief.purpose && brief.purpose.trim() !== '');
  const hasKeyMsg = Boolean(brief.keyMessage && brief.keyMessage.trim() !== '');
  const hasCta = Boolean(brief.callToAction && brief.callToAction.trim() !== '');

  if (!hasPurpose || !hasKeyMsg || !hasCta) {
    return 'Langkah 3 belum lengkap: Tujuan, pesan utama, dan call-to-action wajib diisi.';
  }

  // Step 4: Reward & Budget
  const cpm = campaign.cpm != null ? Number(campaign.cpm) : 0;
  const budget = campaign.budget != null ? Number(campaign.budget) : 0;
  const minViews = campaign.minViews != null ? Number(campaign.minViews) : 0;
  const maxViews = campaign.maxViews != null ? Number(campaign.maxViews) : 0;

  if (cpm <= 0) {
    return 'Langkah 4 belum lengkap: Tarif CPM harus lebih besar dari 0.';
  }

  if (budget <= 0 || budget < cpm) {
    return 'Langkah 4 belum lengkap: Total anggaran harus lebih besar dari atau sama dengan tarif CPM.';
  }

  if (minViews <= 0 || maxViews < minViews) {
    return 'Langkah 4 belum lengkap: Batas penayangan minimum dan maksimum tidak valid.';
  }

  if (!campaign.startDate || !campaign.endDate) {
    return 'Langkah 4 belum lengkap: Jadwal tanggal mulai dan berakhir wajib diisi.';
  }

  const startDate = new Date(campaign.startDate).getTime();
  const endDate = new Date(campaign.endDate).getTime();

  if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
    return 'Langkah 4 belum lengkap: Tanggal berakhir harus lebih lambat dari tanggal mulai.';
  }

  return null;
}

/**
 * Validates the query parameters for retrieving the campaigns list.
 * Validates page, limit, keyword search, filters (category, type, platform, status),
 * and sorting strategy.
 *
 * @param query - Raw query object from `req.query`.
 * @returns The parsed and typed `CampaignQueryInput` or an error message string when validation fails.
 */
export function ValidateCampaignQuery(query: unknown): CampaignQueryInput | string {
  const parseResult = campaignQuerySchema.safeParse(query);

  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    const errorMessage = firstIssue?.message ?? 'Invalid query parameters.';
    return errorMessage;
  }

  const queryData = parseResult.data;
  return queryData;
}



