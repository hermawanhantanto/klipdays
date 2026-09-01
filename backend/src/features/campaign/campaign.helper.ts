import type { Prisma } from '../../generated/prisma/client.js';

import type { CampaignStep1Input } from './campaign.types.js';

/**
 * Builds the Prisma update object for step 1 of the creation wizard.
 * Each wizard step adds its own builder here; the handler dispatches to the
 * right one based on the `?step=` query param and runs a single update.
 *
 * @param input - The validated step 1 body.
 * @returns The campaign fields step 1 is responsible for.
 */
export function BuildCampaignStep1Fields(input: CampaignStep1Input): Prisma.CampaignUpdateInput {
  return {
    title: input.title,
    description: input.description,
    campaignType: input.campaignType,
    campaignCategory: input.campaignCategory,
    thumbnailUrl: input.thumbnailUrl,
    platform: input.platform,
  };
}
