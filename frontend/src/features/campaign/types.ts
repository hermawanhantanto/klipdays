import type { Control } from 'react-hook-form';

import type { BasicInfoFormValues, MaterialsFormValues } from './schemas';

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

export interface CampaignEditInput {
  title?: string;
  description?: string;
  campaignType?: string;
  campaignCategory?: string;
  thumbnailUrl?: string;
  platform?: string;
  mainMediaUrl?: string;
  materials?: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  brief?: Record<string, unknown>;
  cpm?: number;
  minViews?: number;
  maxViews?: number;
  budget?: number;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface BasicInfoFormProps {
  initialData?: Partial<Campaign> | null;
  onSubmit: (values: BasicInfoFormValues) => void;
  isPending?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export interface MaterialsFormProps {
  initialData?: Partial<Campaign> | null;
  onSubmit: (values: MaterialsFormValues) => void;
  isPending?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onBack?: () => void;
}

export interface MaterialFieldGroupProps {
  index: number;
  control: Control<MaterialsFormValues>;
  canRemove: boolean;
  onRemove: (index: number) => void;
  disabled?: boolean;
}
