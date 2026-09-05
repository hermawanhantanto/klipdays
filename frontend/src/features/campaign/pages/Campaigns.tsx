import { CampaignsHeader } from '../components/CampaignsHeader';

/**
 * Campaigns list page orchestrator.
 * Renders the Kampanye header with the creation action button on the right side.
 *
 * @returns The rendered Kampanye page.
 */
function CampaignsPage() {
  return (
    <div className="space-y-6">
      <CampaignsHeader />
    </div>
  );
}

export default CampaignsPage;
