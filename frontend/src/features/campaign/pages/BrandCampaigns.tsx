import { BrandCampaignsList } from '../components/BrandCampaignsList';
import { CampaignsHeader } from '../components/CampaignsHeader';
import { CampaignStatusTabs } from '../components/CampaignStatusTabs';

/**
 * Brand campaigns list page orchestrator.
 * Renders the Kampanye header with creation action button, status navigation tabs,
 * and the filtered brand campaigns list.
 *
 * @returns The rendered Brand Kampanye page.
 */
function BrandCampaignsPage() {
  return (
    <div className="space-y-6">
      <CampaignsHeader />
      <CampaignStatusTabs />
      <BrandCampaignsList />
    </div>
  );
}

export default BrandCampaignsPage;
