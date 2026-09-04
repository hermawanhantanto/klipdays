import type { Prisma } from '../../generated/prisma/client.js';

import { campaignEditSchema } from './campaign.schemas.js';

import type { CampaignEditInput } from './campaign.types.js';

export interface CampaignExistingRewardFields {
  minViews?: number | null;
  maxViews?: number | null;
  budget?: Prisma.Decimal | number | null;
  cpm?: Prisma.Decimal | number | null;
}

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
export function ValidateCampaignRewardLogic(input: CampaignEditInput, existing?: CampaignExistingRewardFields): string | null {
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
