export interface FilterOption {
  value: string;
  label: string;
}

export const FILTER_CATEGORY_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Semua Kategori' },
  { value: 'BEAUTY_SKINCARE', label: 'Beauty & Skincare' },
  { value: 'FASHION_STYLE', label: 'Fashion & Style' },
  { value: 'FOOD_BEVERAGE', label: 'Food & Beverage' },
  { value: 'HEALTH_FITNESS', label: 'Health & Fitness' },
  { value: 'TECHNOLOGY_GADGETS', label: 'Technology & Gadgets' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Lainnya' },
];

export const FILTER_CAMPAIGN_TYPE_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Semua Tipe' },
  { value: 'PRODUCT', label: 'Produk Fisik' },
  { value: 'SERVICE', label: 'Layanan / Jasa' },
  { value: 'CONTENT', label: 'Konten Digital' },
];

export const FILTER_SORT_OPTIONS: FilterOption[] = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'highest_cpm', label: 'CPM Tertinggi' },
  { value: 'lowest_cpm', label: 'CPM Terendah' },
  { value: 'highest_total_budget', label: 'Budget Terbesar' },
  { value: 'highest_maximum_views', label: 'Maksimal Views' },
];

/**
 * Returns the human-readable label for a selected category filter value.
 *
 * @param category - Category value or undefined.
 * @returns The category label string.
 */
export function GetFilterCategoryLabel(category?: string | null): string {
  if (!category || category === 'ALL') {
    return 'Kategori';
  }
  const match = FILTER_CATEGORY_OPTIONS.find((item) => item.value === category);
  return match?.label ?? 'Kategori';
}

/**
 * Returns the human-readable label for a selected campaign type filter value.
 *
 * @param campaignType - Campaign type value or undefined.
 * @returns The campaign type label string.
 */
export function GetFilterCampaignTypeLabel(campaignType?: string | null): string {
  if (!campaignType || campaignType === 'ALL') {
    return 'Tipe';
  }
  const match = FILTER_CAMPAIGN_TYPE_OPTIONS.find((item) => item.value === campaignType);
  return match?.label ?? 'Tipe';
}

/**
 * Returns the human-readable label for a selected sort strategy value.
 *
 * @param sort - Sort value or undefined.
 * @returns The sort strategy label string.
 */
export function GetFilterSortLabel(sort?: string | null): string {
  if (!sort || sort === 'latest') {
    return 'Terbaru';
  }
  const match = FILTER_SORT_OPTIONS.find((item) => item.value === sort);
  return match?.label ?? 'Terbaru';
}
