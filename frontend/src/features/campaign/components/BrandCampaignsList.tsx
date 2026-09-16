import { useNavigate, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { UseCampaignsQuery } from '../hooks';
import type { BrandCampaignsListProps, CampaignCardItem } from '../types';
import { BrandCampaignsErrorState } from './BrandCampaignsErrorState';
import { CampaignCard } from './CampaignCard';
import { CampaignCardSkeleton } from './CampaignCardSkeleton';
import { CampaignStatusEmptyState } from './CampaignStatusEmptyState';

const VALID_STATUSES = ['ACTIVE', 'IN_REVIEW', 'REVISION', 'FINISHED'] as const;

/**
 * Brand campaigns list component.
 * Fetches and displays a responsive grid of campaign cards owned by the authenticated brand,
 * scoped to the active status filter read from the URL (?status=...).
 * Handles loading skeleton, error with retry, status-specific empty states, and card interaction.
 *
 * @param props - Component properties containing optional click callbacks and class overrides.
 * @returns The rendered brand campaigns grid element.
 */
export function BrandCampaignsList({ onCardClick, className }: BrandCampaignsListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawStatus = searchParams.get('status');
  const currentStatus = rawStatus && (VALID_STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : 'ACTIVE';

  const { data, isLoading, isError, error, refetch } = UseCampaignsQuery({
    campaignStatus: currentStatus,
  });

  const handleCardClick = (campaign: CampaignCardItem) => {
    if (onCardClick) {
      onCardClick(campaign);
      return;
    }

    if (campaign.campaignStatus === 'DRAFT' || campaign.campaignStatus === 'REVISION') {
      navigate(`/brand-dashboard/brand-campaigns/${campaign.id}/create/step-1`);
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5', className)}
        data-testid="brand-campaigns-loading">
        {Array.from({ length: 8 }).map((_, index) => (
          <CampaignCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <BrandCampaignsErrorState error={error} onRetry={() => void refetch()} className={className} />;
  }

  const items = data?.items ?? [];

  if (!items.length) {
    return <CampaignStatusEmptyState status={currentStatus} className={className} />;
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-2', className)}>
      {items.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} onClick={handleCardClick} />
      ))}
    </div>
  );
}
