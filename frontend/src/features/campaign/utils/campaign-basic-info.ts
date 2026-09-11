import type { BasicInfoFormValues, CampaignCategoryOption, CampaignPlatformOption, CampaignTypeOption } from '../schemas';
import type { Campaign } from '../types';

/**
 * Extracts and maps campaign basic info data into form initial values,
 * falling back to clean defaults when values are missing.
 *
 * @param campaign - Optional partial campaign entity.
 * @returns Initialized BasicInfoFormValues object.
 */
export function GetInitialBasicInfo(campaign?: Partial<Campaign> | null): BasicInfoFormValues {
  const initialValues: BasicInfoFormValues = {
    title: campaign?.title ?? '',
    description: campaign?.description ?? '',
    campaignType: (campaign?.campaignType as CampaignTypeOption) ?? 'PRODUCT',
    campaignCategory: (campaign?.campaignCategory as CampaignCategoryOption) ?? 'BEAUTY_SKINCARE',
    thumbnailUrl: campaign?.thumbnailUrl ?? '',
    platform: (campaign?.platform as CampaignPlatformOption) ?? 'TIKTOK',
    mainMediaUrl: campaign?.mainMediaUrl ?? '',
  };

  return initialValues;
}
