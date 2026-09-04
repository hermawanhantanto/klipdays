import type { Prisma } from '../../generated/prisma/client.js';
import { Status } from '../../generated/prisma/enums.js';

import type { CampaignBriefInput, CampaignEditInput, CampaignMaterialsInput } from './campaign.types.js';


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
  'cpm',
  'minViews',
  'maxViews',
  'budget',
] as const;

/**
 * Copies `value` into `target[key]` when it is defined, so only the fields
 * the request actually sent end up in the update.
 */
function SetField<Target, Key extends keyof Target>(target: Target, key: Key, value: Target[Key] | undefined): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

/**
 * Builds the nested Prisma upsert object for the campaign brief relation.
 * When a campaign has no brief yet, all sent fields are created. When a brief
 * already exists, only the sent fields are updated.
 *
 * @param brief - The validated campaign brief input.
 * @returns The Prisma nested upsert input for the campaign brief relation.
 */
export function BuildCampaignBriefUpsert(brief: CampaignBriefInput): Prisma.CampaignBriefUpsertWithoutCampaignInput {
  const createData: Prisma.CampaignBriefCreateWithoutCampaignInput = {
    purpose: brief.purpose,
    keyMessage: brief.keyMessage,
    narration: brief.narration,
    impression: brief.impression,
    callToAction: brief.callToAction,
    requiredCaption: brief.requiredCaption,
    hashtags: brief.hashtags,
    mentionTags: brief.mentionTags,
    dos: brief.dos,
    donts: brief.donts,
    guidelines: brief.guidelines,
  };

  const updateData: Prisma.CampaignBriefUpdateWithoutCampaignInput = {};

  for (const [key, value] of Object.entries(createData)) {
    SetField(updateData, key as keyof Prisma.CampaignBriefUpdateWithoutCampaignInput, value);
  }

  const upsert: Prisma.CampaignBriefUpsertWithoutCampaignInput = {
    create: createData,
    update: updateData,
  };

  return upsert;
}

/**
 * Builds the nested Prisma update object for campaign materials.
 * Soft-deletes all existing active materials by marking them DELETED, then
 * creates the new replacement materials in the same atomic operation.
 *
 * @param materials - The list of campaign materials to set.
 * @returns The Prisma nested update input for the campaign materials relation.
 */
export function BuildCampaignMaterialsUpdate(
  materials: CampaignMaterialsInput
): Prisma.CampaignMaterialUpdateManyWithoutCampaignNestedInput {
  const materialsQuery: Prisma.CampaignMaterialUpdateManyWithoutCampaignNestedInput = {
    updateMany: {
      where: { status: Status.ACTIVE },
      data: { status: Status.DELETED },
    },
    create: materials.map((material) => ({
      type: material.type,
      name: material.name,
      url: material.url,
    })),
  };

  return materialsQuery;
}

/**
 * Builds the Prisma update object for the edit endpoint. Fields the body did
 * not send stay absent, so only the sent fields are written. Scalar attributes
 * (such as basic campaign info, CPM, minViews, maxViews, and budget) are copied
 * directly. When materials is sent, the current active materials are soft deleted
 * (status DELETED) and the new list is created, all inside the same campaign
 * update so the replacement is atomic. When brief is sent, it is upserted into the
 * campaign brief relation.
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
    const materialsUpdate = BuildCampaignMaterialsUpdate(input.materials);
    campaignQuery.materials = materialsUpdate;
  }

  if (input.brief) {
    const briefUpsert = BuildCampaignBriefUpsert(input.brief);
    campaignQuery.brief = {
      upsert: briefUpsert,
    };
  }

  return campaignQuery;
}
