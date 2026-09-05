import { type Industry } from '../schemas/sign-up-schema'

/**
 * Human-readable display labels for each industry option.
 */
export const INDUSTRY_LABELS: Record<Industry, string> = {
  E_COMMERCE: 'E-Commerce',
  FOOD_AND_BEVERAGE: 'Food & Beverage',
  FASHION_AND_BEAUTY: 'Fashion & Beauty',
  TECHNOLOGY: 'Technology',
  FINANCE: 'Finance',
  HEALTH_AND_WELLNESS: 'Health & Wellness',
  ENTERTAINMENT: 'Entertainment',
  EDUCATION: 'Education',
  TRAVEL_AND_HOSPITALITY: 'Travel & Hospitality',
  OTHER: 'Other',
}

/**
 * Formats an industry identifier into its normalized human-readable display label.
 *
 * @param industry - The raw industry identifier (e.g. 'FASHION_AND_BEAUTY').
 * @returns The formatted display label (e.g. 'Fashion & Beauty'), or the raw value if not mapped.
 */
export function FormatIndustryLabel(industry?: string | null): string {
  if (!industry) {
    return ''
  }

  const label = INDUSTRY_LABELS[industry as Industry]
  if (label) {
    return label
  }

  return industry
}
