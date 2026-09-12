import { useNavigate } from 'react-router';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExtractApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { UseCampaignsQuery } from '../hooks';
import type { BrandCampaignsListProps, CampaignCardItem } from '../types';
import { CampaignCard } from './CampaignCard';
import { CampaignCardSkeleton } from './CampaignCardSkeleton';

/**
 * Brand campaigns list component.
 * Fetches and displays a responsive grid of campaign cards owned by the authenticated brand.
 * Handles loading skeleton, error with retry, empty state, and card interaction.
 *
 * @param props - Component properties containing optional click callbacks and class overrides.
 * @returns The rendered brand campaigns grid element.
 */
export function BrandCampaignsList({ onCardClick, className }: BrandCampaignsListProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = UseCampaignsQuery();

  const handleCardClick = (campaign: CampaignCardItem) => {
    if (onCardClick) {
      onCardClick(campaign);
      return;
    }

    if (campaign.campaignStatus === 'DRAFT') {
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
    const apiError = ExtractApiError(error, 'Gagal memuat kampanye. Silakan periksa koneksi internet Anda.');
    const errorMessage = apiError.message;

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center sm:p-12',
          className
        )}>
        <AlertCircle className="size-10 text-destructive/80 mb-3" />
        <h3 className="font-heading text-base font-semibold text-foreground">Gagal Memuat Kampanye</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">{errorMessage}</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()} className="mt-4 gap-2">
          <RotateCcw className="size-4" />
          <span>Coba Lagi</span>
        </Button>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-2', className)}>
      {items.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} onClick={handleCardClick} />
      ))}
    </div>
  );
}
