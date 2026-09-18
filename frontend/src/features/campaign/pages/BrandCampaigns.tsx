import { BrandCampaignsList } from '../components/BrandCampaignsList';
import { CampaignFiltersToolbar } from '../components/CampaignFiltersToolbar';
import { CampaignsHeader } from '../components/CampaignsHeader';
import { CampaignStatusTabs } from '../components/CampaignStatusTabs';
import { ResumeDraftBanner } from '../components/ResumeDraftBanner';

/**
 * Brand campaigns list page orchestrator.
 * Renders the Kampanye header with creation action button, resume draft banner,
 * status navigation tabs, search/filters toolbar, and the filtered brand campaigns list.
 *
 * @returns The rendered Brand Kampanye page.
 */
function BrandCampaignsPage() {
  return (
    <div className="space-y-6">
      <CampaignsHeader />
      <ResumeDraftBanner />
      <CampaignStatusTabs />
      <CampaignFiltersToolbar placeholder="Cari kampanye Anda..." />
      <BrandCampaignsList />
    </div>
  );
}

export default BrandCampaignsPage;
