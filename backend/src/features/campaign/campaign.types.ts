import type { Prisma } from '../../generated/prisma/client.js';
import type { CampaignStatus } from '../../generated/prisma/enums.js';
import type {
  CampaignBriefInput,
  CampaignEditInput,
  CampaignMaterialItemInput,
  CampaignMaterialsInput,
  CampaignQueryInput,
  CampaignSortOption,
} from './campaign.schemas.js';

export type {
  CampaignBriefInput,
  CampaignEditInput,
  CampaignMaterialItemInput,
  CampaignMaterialsInput,
  CampaignQueryInput,
  CampaignSortOption,
};

export interface CampaignPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CampaignCardBrand {
  id: string;
  companyName: string;
  industry: string | null;
}

export interface CampaignCardCount {
  submissions: number;
}

export interface CampaignCardMaterialItem {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
}

export interface CampaignCardBriefItem {
  id: string;
  purpose: string | null;
  keyMessage: string | null;
  callToAction: string | null;
  status: string;
}

export interface CampaignCardItem {
  id: string;
  title: string | null;
  description: string | null;
  campaignType: string;
  campaignCategory: string;
  thumbnailUrl: string | null;
  platform: string;
  mainMediaUrl: string | null;
  cpm: Prisma.Decimal | number | null;
  minViews: number | null;
  maxViews: number | null;
  budget: Prisma.Decimal | number | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  campaignStatus: string;
  createdAt: Date;
  updatedAt: Date;
  brandId: string;
  brand: CampaignCardBrand;
  materials?: CampaignCardMaterialItem[];
  brief?: CampaignCardBriefItem | null;
  _count?: CampaignCardCount;
}

export interface CampaignsPaginatedData {
  items: CampaignCardItem[];
  pagination: CampaignPaginationMeta;
}

export type CampaignStatusCounts = Record<CampaignStatus, number>;
