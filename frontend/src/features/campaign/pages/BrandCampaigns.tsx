import { BrandCampaignsList } from '../components/BrandCampaignsList';
import { CampaignsHeader } from '../components/CampaignsHeader';

/**
 * Brand campaigns list page orchestrator.
 * Renders the Kampanye header with creation action button, and the brand campaigns list.
 *
 * @returns The rendered Brand Kampanye page.
 */
function BrandCampaignsPage() {
  return (
    <div className="space-y-6">
      <CampaignsHeader />
      <BrandCampaignsList />
    </div>
  );
}

export default BrandCampaignsPage;
