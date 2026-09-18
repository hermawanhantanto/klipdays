import { cn } from '@/lib/utils';
import type { CreatorCampaignsListProps } from '../types';
import { CampaignCard } from './CampaignCard';
import { CampaignCardSkeleton } from './CampaignCardSkeleton';
import { CreatorCampaignsEmptyState } from './CreatorCampaignsEmptyState';
import { CreatorCampaignsErrorState } from './CreatorCampaignsErrorState';

const SKELETON_COUNT = 6;

/**
 * Responsive grid component that renders creator marketplace campaign cards.
 * Handles loading skeletons, error states with retry, empty state fallback, and card selection.
 *
 * @param props - Component properties containing campaign items, loading state, error state, and selection handler.
 * @returns The rendered grid element.
 */
export function CreatorCampaignsList({
  campaigns = [],
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onSelectCampaign,
  className,
}: CreatorCampaignsListProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6', className)}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <CampaignCardSkeleton key={`creator-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <CreatorCampaignsErrorState error={error} onRetry={onRetry} className={className} />;
  }

  if (!campaigns.length) {
    return <CreatorCampaignsEmptyState onReset={onRetry} className={className} />;
  }

  return (
    <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6', className)}>
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} onClick={onSelectCampaign} />
      ))}
    </div>
  );
}
