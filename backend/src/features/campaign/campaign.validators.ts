import { campaignEditSchema } from './campaign.schemas.js';
import type { CampaignEditInput } from './campaign.types.js';

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
