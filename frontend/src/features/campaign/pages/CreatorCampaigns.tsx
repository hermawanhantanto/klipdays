import { useNavigate, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { CampaignFiltersToolbar } from '../components/CampaignFiltersToolbar';
import { FeaturedCampaignCarousel } from '../components/FeaturedCampaignCarousel';
import { FeaturedCampaignSkeleton } from '../components/FeaturedCampaignSkeleton';
import { CreatorCampaignsList } from '../components/CreatorCampaignsList';
import { UseCampaignsQuery, UseFeaturedCampaignsQuery } from '../hooks/queries';
import type { CampaignCardItem, CreatorCampaignsProps } from '../types';

/**
 * Creator campaign marketplace page orchestrator.
 * Displays the dark cinematic featured hero carousel at the top,
 * followed by the "Lihat Semua Campaign" marketplace grid with search, sort, and filters.
 *
 * @param props - Component properties containing optional custom CSS classes.
 * @returns The rendered creator campaigns marketplace page.
 */
function CreatorCampaignsPage({ className }: CreatorCampaignsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || undefined;
  const rawCategory = searchParams.get('category');
  const category = rawCategory && rawCategory !== 'ALL' ? rawCategory : undefined;
  const rawType = searchParams.get('campaignType');
  const campaignType = rawType && rawType !== 'ALL' ? rawType : undefined;
  const sort = searchParams.get('sort') || 'latest';

  const { data: featuredCampaigns, isLoading: isFeaturedLoading } = UseFeaturedCampaignsQuery();
  const {
    data: campaignsData,
    isLoading: isCampaignsLoading,
    isError: isCampaignsError,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = UseCampaignsQuery({
    limit: 30,
    search,
    category,
    campaignType,
    sort,
  });

  /**
   * Navigates to the campaign detail page for the selected campaign item.
   *
   * @param campaign - Selected campaign card item.
   */
  const HandleSelectCampaign = (campaign: CampaignCardItem) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  /**
   * Refetches the marketplace campaigns list after an error.
   */
  const HandleRetryCampaigns = () => {
    void refetchCampaigns();
  };

  const totalCount = campaignsData?.pagination?.total;

  return (
    <div className={cn('space-y-8 pb-12', className)}>
      {/* Featured Campaigns Hero Carousel Section (Full-bleed edge-to-edge, no outer padding, no border) */}
      <section
        aria-label="Featured Campaigns"
        className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] overflow-hidden">
        {isFeaturedLoading ? (
          <FeaturedCampaignSkeleton />
        ) : featuredCampaigns && featuredCampaigns.length > 0 ? (
          <FeaturedCampaignCarousel
            campaigns={featuredCampaigns}
            onSelectCampaign={HandleSelectCampaign}
          />
        ) : null}
      </section>

      {/* Explore All Campaigns Marketplace Section */}
      <section aria-label="Lihat Semua Campaign" className="space-y-6 pt-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="shrink-0 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Lihat Semua Campaign
            {totalCount !== undefined ? (
              <span className="ml-2 text-sm font-medium text-muted-foreground">({totalCount})</span>
            ) : null}
          </h2>

          <CampaignFiltersToolbar className="w-full lg:w-auto lg:justify-end" />
        </div>

        <CreatorCampaignsList
          campaigns={campaignsData?.items}
          isLoading={isCampaignsLoading}
          isError={isCampaignsError}
          error={campaignsError}
          onRetry={HandleRetryCampaigns}
          onSelectCampaign={HandleSelectCampaign}
        />
      </section>
    </div>
  );
}

export default CreatorCampaignsPage;
