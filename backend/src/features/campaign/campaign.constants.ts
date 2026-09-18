import type { Prisma } from '../../generated/prisma/client.js';
import { Status } from '../../generated/prisma/enums.js';

/**
 * Whitelist of scalar fields copied 1:1 from the campaign edit payload into Prisma update queries.
 */
export const SCALAR_FIELDS = [
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
  'startDate',
  'endDate',
] as const;

/**
 * Lean select projection for campaign cards. Only fetches basic campaign info,
 * brand summary, and submissions count without pulling heavy brief or materials relations.
 */
export const CAMPAIGN_CARD_SELECT = {
  id: true,
  title: true,
  description: true,
  campaignType: true,
  campaignCategory: true,
  thumbnailUrl: true,
  platform: true,
  mainMediaUrl: true,
  cpm: true,
  minViews: true,
  maxViews: true,
  budget: true,
  startDate: true,
  endDate: true,
  status: true,
  campaignStatus: true,
  isFeatured: true,
  featuredBannerUrl: true,
  featuredOrder: true,
  featuredUntil: true,
  createdAt: true,
  updatedAt: true,
  brandId: true,
  brand: {
    select: {
      id: true,
      companyName: true,
      industry: true,
    },
  },
  materials: {
    where: { status: Status.ACTIVE },
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
      status: true,
    },
  },
  brief: {
    where: { status: Status.ACTIVE },
    select: {
      id: true,
      purpose: true,
      keyMessage: true,
      callToAction: true,
      status: true,
    },
  },
  _count: {
    select: {
      submissions: {
        where: { status: Status.ACTIVE },
      },
    },
  },
} as const satisfies Prisma.CampaignSelect;
