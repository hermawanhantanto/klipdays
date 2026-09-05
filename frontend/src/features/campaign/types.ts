export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export interface InitializeCampaignResponse {
  id: string;
}

export type WizardStepSlug = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5';

export interface WizardStepItem {
  id: string;
  slug: WizardStepSlug;
  stepNumber: number;
  title: string;
  description: string;
}

export interface CampaignMaterial {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  campaignId?: string;
}

export interface CampaignBrief {
  id: string;
  purpose?: string | null;
  keyMessage?: string | null;
  narration?: string | null;
  impression?: string | null;
  callToAction?: string | null;
  requiredCaption?: string | null;
  hashtags?: string[];
  mentionTags?: string[];
  dos?: string[];
  donts?: string[];
  guidelines?: string | null;
  createdAt?: string;
  updatedAt?: string;
  campaignId?: string;
}

export interface CampaignBrand {
  id: string;
  companyName: string;
  industry?: string | null;
}

export interface Campaign {
  id: string;
  title?: string | null;
  description?: string | null;
  campaignType?: string;
  campaignCategory?: string;
  thumbnailUrl?: string | null;
  platform?: string;
  mainMediaUrl?: string | null;
  cpm?: number | string | null;
  minViews?: number | null;
  maxViews?: number | null;
  budget?: number | string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
  campaignStatus?: string;
  adminNote?: string | null;
  createdAt?: string;
  updatedAt?: string;
  brandId?: string;
  materials?: CampaignMaterial[];
  brief?: CampaignBrief | null;
  brand?: CampaignBrand;
}
