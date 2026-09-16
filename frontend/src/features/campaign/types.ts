import type { ComponentType, ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import type { MaterialsFormValues } from './schemas';

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
  maxItemLength?: number;
}

export interface DynamicListInputProps {
  onAdd: (item: string) => void;
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
  maxLength?: number;
}

export interface DynamicListPillsProps {
  items: string[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export interface DynamicListRowsProps {
  items: string[];
  onRemove: (index: number) => void;
  tone?: 'positive' | 'negative' | 'neutral';
  disabled?: boolean;
}

export interface CampaignProjections {
  totalEstimatedViews: number;
  maxEarningsPerVideo: number;
  minFundedVideos: number;
  durationDays: number;
}

export interface MissingStepItem {
  stepNumber: number;
  slug: WizardStepSlug;
  title: string;
  reason: string;
}

export interface CampaignCompletenessResult {
  isComplete: boolean;
  missingSteps: MissingStepItem[];
}

export interface CampaignReviewCompletenessAlertProps {
  missingSteps: MissingStepItem[];
  onNavigateToStep: (stepSlug: WizardStepSlug) => void;
}

export interface CampaignReviewBasicInfoProps {
  campaign: Campaign;
  onEdit: () => void;
}

export interface CampaignReviewMaterialsProps {
  materials?: CampaignMaterial[];
  onEdit: () => void;
}

export interface CampaignReviewBriefProps {
  brief?: CampaignBrief | null;
  onEdit: () => void;
}

export interface CampaignReviewRewardProps {
  campaign: Campaign;
  projections: CampaignProjections;
  onEdit: () => void;
}

export interface CampaignDanaAmanNoticeProps {
  variant?: 'budget' | 'review';
  title?: string;
  description?: string;
  className?: string;
}

export type CampaignReviewEscrowNoticeProps = CampaignDanaAmanNoticeProps;

export interface CampaignReviewActionsProps {
  onBack: () => void;
  onSubmit: () => void;
  isPending?: boolean;
  isComplete?: boolean;
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

export interface CampaignWizardHelperBoxProps {
  title: string;
  description?: string;
  tip?: string;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

export interface CampaignEstimateRoiCardProps {
  projections: CampaignProjections;
  className?: string;
}

export interface UseUnsavedChangesGuardOptions {
  isDirty: boolean;
  isSaving?: boolean;
}

export interface UseUnsavedChangesGuardResult {
  isBlocked: boolean;
  ConfirmNavigation: () => void;
  CancelNavigation: () => void;
}

export interface CampaignUnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FieldLengthTrackerProps {
  current: number;
  max: number;
  className?: string;
}

export interface CampaignCardBrand {
  id: string;
  companyName: string;
  industry?: string | null;
}

export interface CampaignCardCount {
  submissions: number;
}

export interface CampaignCardItem {
  id: string;
  title: string | null;
  description: string | null;
  campaignType: string;
  campaignCategory: string;
  thumbnailUrl: string | null;
  platform: string;
  mainMediaUrl?: string | null;
  cpm: number | string | null;
  minViews?: number | null;
  maxViews?: number | null;
  budget: number | string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  campaignStatus: string;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  brand: CampaignCardBrand;
  _count?: CampaignCardCount;
}

export interface CampaignCardProps {
  campaign: CampaignCardItem;
  onClick?: (campaign: CampaignCardItem) => void;
  className?: string;
}

export interface CampaignStatusBadgeConfig {
  label: string;
  className: string;
}

export interface CampaignPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CampaignsPaginatedData {
  items: CampaignCardItem[];
  pagination: CampaignPaginationMeta;
}

export interface CampaignQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  campaignType?: string;
  platform?: string;
  campaignStatus?: string;
  sort?: string;
}

export interface CampaignCardSkeletonProps {
  className?: string;
}

export interface BrandCampaignsListProps {
  onCardClick?: (campaign: CampaignCardItem) => void;
  className?: string;
}

export interface CreateCampaignDialogProps {
  children: ReactNode;
}

export type CampaignLifecycleStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'REVISION'
  | 'REJECTED'
  | 'ACTIVE'
  | 'FINISHED';

export interface CampaignStatusCounts {
  DRAFT: number;
  IN_REVIEW: number;
  REVISION: number;
  REJECTED: number;
  ACTIVE: number;
  FINISHED: number;
}

export interface CampaignStatusTabsProps {
  counts?: CampaignStatusCounts;
  activeStatus?: string;
  onStatusChange?: (status: string) => void;
  className?: string;
}

export interface ResumeDraftBannerProps {
  draftCount: number;
  latestDraft?: CampaignCardItem | null;
  onContinueDraft?: (draft: CampaignCardItem) => void;
  onDeleteDraft?: (draft: CampaignCardItem) => void;
  onViewAllDrafts?: () => void;
  isDeleting?: boolean;
  className?: string;
}

export interface DraftsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  drafts?: CampaignCardItem[];
  isLoading?: boolean;
  onContinueDraft?: (draft: CampaignCardItem) => void;
  onDeleteDraft?: (draft: CampaignCardItem) => void;
  deletingDraftId?: string | null;
  className?: string;
}

export interface DraftItemRowProps {
  draft: CampaignCardItem;
  onContinue?: (draft: CampaignCardItem) => void;
  onDelete?: (draft: CampaignCardItem) => void;
  isDeleting?: boolean;
  className?: string;
}
