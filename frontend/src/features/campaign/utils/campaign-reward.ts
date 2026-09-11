import type { RewardFormValues } from '../schemas';
import type { Campaign, CampaignProjections } from '../types';

/**
 * Formats a Date object or date string into an HTML date input format (YYYY-MM-DD).
 *
 * @param date - The Date or ISO string to format.
 * @returns Formatted date string or empty string if invalid.
 */
export function FormatDateForInput(date?: string | Date | null): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '';
  const formatted = parsed.toISOString().split('T')[0] ?? '';
  return formatted;
}

/**
 * Calculates a default start date (today) and end date (30 days from today) formatted as YYYY-MM-DD.
 *
 * @returns An object containing default startDate and endDate strings.
 */
export function GetDefaultCampaignDates(): { startDate: string; endDate: string } {
  const now = new Date();
  const startDate = FormatDateForInput(now);

  const thirtyDaysLater = new Date(now);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const endDate = FormatDateForInput(thirtyDaysLater);

  const dates = { startDate, endDate };
  return dates;
}

const defaultDates = GetDefaultCampaignDates();

/**
 * Default initial values for the reward and budget form.
 */
export const DEFAULT_EMPTY_REWARD: RewardFormValues = {
  cpm: 10000,
  minViews: 1000,
  maxViews: 50000,
  budget: 5000000,
  startDate: defaultDates.startDate,
  endDate: defaultDates.endDate,
};

/**
 * Maps campaign entity data into clean form values for Step 4 (Reward & Budget).
 * Handles Prisma Decimal strings for cpm and budget, as well as Date string parsing.
 *
 * @param campaign - Partial campaign entity retrieved from the backend.
 * @returns Clean form values conforming to RewardFormValues.
 */
export function GetInitialReward(campaign?: Partial<Campaign> | null): RewardFormValues {
  if (!campaign) {
    return DEFAULT_EMPTY_REWARD;
  }

  const cpm = campaign.cpm != null ? Number(campaign.cpm) : DEFAULT_EMPTY_REWARD.cpm;
  const minViews = campaign.minViews != null ? Number(campaign.minViews) : DEFAULT_EMPTY_REWARD.minViews;
  const maxViews = campaign.maxViews != null ? Number(campaign.maxViews) : DEFAULT_EMPTY_REWARD.maxViews;
  const budget = campaign.budget != null ? Number(campaign.budget) : DEFAULT_EMPTY_REWARD.budget;

  const startDate = campaign.startDate
    ? FormatDateForInput(campaign.startDate)
    : DEFAULT_EMPTY_REWARD.startDate;

  const endDate = campaign.endDate
    ? FormatDateForInput(campaign.endDate)
    : DEFAULT_EMPTY_REWARD.endDate;

  const initialValues: RewardFormValues = {
    cpm,
    minViews,
    maxViews,
    budget,
    startDate,
    endDate,
  };

  return initialValues;
}

/**
 * Calculates live projections and metrics for brand feedback:
 * - Total estimated views across all clips based on budget and CPM.
 * - Maximum reward potential per single video capped by maxViews.
 * - Minimum number of fully funded viral videos possible within total budget.
 * - Campaign active duration in days.
 *
 * @param values - Partial or active form values containing cpm, minViews, maxViews, budget, startDate, endDate.
 * @returns Calculated projection metrics.
 */
export function CalculateCampaignProjections(values: Partial<RewardFormValues>): CampaignProjections {
  const cpm = Number(values.cpm) || 0;
  const maxViews = Number(values.maxViews) || 0;
  const budget = Number(values.budget) || 0;

  const totalEstimatedViews = cpm > 0 && budget > 0 ? Math.round((budget / cpm) * 1000) : 0;
  const maxEarningsPerVideo = maxViews > 0 && cpm > 0 ? Math.round((maxViews / 1000) * cpm) : 0;
  const minFundedVideos = maxEarningsPerVideo > 0 && budget > 0 ? Math.floor(budget / maxEarningsPerVideo) : 0;

  let durationDays = 0;
  if (values.startDate && values.endDate) {
    const startMs = new Date(values.startDate).getTime();
    const endMs = new Date(values.endDate).getTime();
    if (!isNaN(startMs) && !isNaN(endMs) && endMs > startMs) {
      durationDays = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
    }
  }

  const projections: CampaignProjections = {
    totalEstimatedViews,
    maxEarningsPerVideo,
    minFundedVideos,
    durationDays,
  };

  return projections;
}

/**
 * Formats a numeric value as Indonesian Rupiah (IDR) currency.
 *
 * @param value - The number to format.
 * @returns Formatted currency string (e.g. "Rp 5.000.000").
 */
export function FormatRupiah(value?: number | null): string {
  if (value == null || isNaN(value)) return 'Rp 0';
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  const formatted = formatter.format(value);
  return formatted;
}

/**
 * Formats a numeric value with thousands separators.
 *
 * @param value - The number to format.
 * @returns Formatted number string (e.g. "50.000").
 */
export function FormatNumber(value?: number | null): string {
  if (value == null || isNaN(value)) return '0';
  const formatter = new Intl.NumberFormat('id-ID');
  const formatted = formatter.format(value);
  return formatted;
}
