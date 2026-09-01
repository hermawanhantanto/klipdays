import { campaignStep1Schema } from './campaign.schemas.js';
import type { CampaignStep1Input } from './campaign.types.js';

/**
 * Validates the campaign step 1 request body against the step 1 schema.
 *
 * @param body - Raw request body (`req.body`).
 * @returns The first validation error message when invalid, otherwise the parsed input.
 */
export function ValidateCampaignStep1Body(body: unknown): CampaignStep1Input | string {
  const result = campaignStep1Schema.safeParse(body);

  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Invalid request body.';
  }

  return result.data;
}
