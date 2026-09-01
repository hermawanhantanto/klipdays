import type { Prisma } from '../../generated/prisma/client.js';
import { Status } from '../../generated/prisma/enums.js';

import type { CampaignEditInput } from './campaign.types.js';

// Scalar fields copied 1:1 from the edit body into the update. This list is
// the whitelist: only fields named here can ever be written.
const SCALAR_FIELDS = [
  'title',
  'description',
  'campaignType',
  'campaignCategory',
  'thumbnailUrl',
  'platform',
  'mainMediaUrl',
] as const;

/**
 * Copies `value` into `target[key]` when it is defined, so only the fields
 * the request actually sent end up in the update.
 */
function SetField<Target, Key extends keyof Target>(
  target: Target,
  key: Key,
  value: Target[Key] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

/**
 * Builds the Prisma update object for the edit endpoint. Fields the body did
 * not send stay absent, so only the sent fields are written. When materials
 * is sent, the current active materials are soft deleted (status DELETED)
 * and the new list is created, all inside the same campaign update so the
 * replacement is atomic.
 *
 * @param input - The validated edit body.
 * @returns The fields to update on the campaign.
 */
export function BuildCampaignEditFields(input: CampaignEditInput): Prisma.CampaignUpdateInput {
  const campaignQuery: Prisma.CampaignUpdateInput = {};

  for (const key of SCALAR_FIELDS) {
    SetField(campaignQuery, key, input[key]);
  }

  if (input.materials?.length) {
    campaignQuery.materials = {
      updateMany: {
        where: { status: Status.ACTIVE },
        data: { status: Status.DELETED },
      },
      create: input.materials.map((material) => ({
        type: material.type,
        name: material.name,
        url: material.url,
      })),
    };
  }

  return campaignQuery;
}
