import type { Control } from 'react-hook-form';

import type { BriefFormValues, MaterialsFormValues, RewardFormValues } from './schemas';

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

export interface MaterialFieldGroupProps {
  index: number;
  control: Control<MaterialsFormValues>;
  canRemove: boolean;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export interface BriefFormProps {
  initialData?: Partial<Campaign> | null;
  onSubmit: (values: BriefFormValues) => void;
  isPending?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onBack?: () => void;
}

export interface BriefDynamicListFieldProps {
  label: string;
  description?: string;
  placeholder?: string;
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
  disabled?: boolean;
  prefix?: string;
  variant?: 'pills' | 'rows';
  tone?: 'positive' | 'negative' | 'neutral';
  error?: string;
}

export interface CampaignProjections {
  totalEstimatedViews: number;
  maxEarningsPerVideo: number;
  minFundedVideos: number;
  durationDays: number;
}

export interface RewardFormProps {
  initialData?: Partial<Campaign> | null;
  onSubmit: (values: RewardFormValues) => void;
  isPending?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onBack?: () => void;
}

export interface ReviewSummaryProps {
  campaign: Campaign;
  onSubmit: () => void;
  onBack: () => void;
  isPending?: boolean;
}

export interface CampaignWizardStepperProps {
  className?: string;
  campaign?: Campaign | null;
}

export interface CampaignWizardContext {
  campaign?: Campaign;
}

export interface CampaignWizardErrorProps {
  message?: string;
  onRetry?: () => void;
}

export interface CampaignThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
  campaignId: string;
  disabled?: boolean;
}

export interface WizardFormActionsProps {
  onBack?: () => void;
  isPending?: boolean;
  submitText?: string;
  backText?: string;
  className?: string;
}
