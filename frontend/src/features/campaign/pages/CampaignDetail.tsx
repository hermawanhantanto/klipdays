import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { cn } from '@/lib/utils';
import { UseCurrentAccountQuery } from '@/features/authentication/hooks';
import {
  CampaignDetailAbout,
  CampaignDetailBriefSections,
  CampaignDetailErrorState,
  CampaignDetailHeader,
  CampaignDetailRewardSidebar,
  CampaignDetailSkeleton,
  CampaignDetailSubmissionsPlaceholder,
  CampaignDetailTabs,
} from '../components';
import { UseCampaignQuery } from '../hooks';
import type { CampaignDetailPageProps } from '../types';
import { ResolveCampaignWizardStepPath } from '../utils';

/**
 * Campaign Detail Page Orchestrator.
 * Loads campaign details, verifies lifecycle status, redirects drafts/revisions back
 * to the step creation wizard for owning brands, and orchestrates the responsive 2-column detail layout.
 *
 * Adheres strictly to the single responsibility principle: composes components,
 * wires route parameters, and delegates UI implementation to dedicated subcomponents.
 *
 * @param props - Page properties containing optional class overrides.
 * @returns The rendered Campaign Detail view or redirect navigation.
 */
function CampaignDetailPage({ className }: CampaignDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('detail');

  const { data: userProfile } = UseCurrentAccountQuery();
  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  if (isLoading) {
    return <CampaignDetailSkeleton className={className} />;
  }

  if (isError || !campaign) {
    return (
      <CampaignDetailErrorState
        error={error}
        message={!campaign && !isLoading ? 'Kampanye tidak ditemukan.' : undefined}
        onRetry={() => void refetch()}
        className={className}
      />
    );
  }

  // Redirection guard: draft and revision campaigns must continue their creation wizard flow for owning brands
  if (
    userProfile?.role === 'BRAND' &&
    (campaign.campaignStatus === 'DRAFT' || campaign.campaignStatus === 'REVISION')
  ) {
    const wizardStepPath = ResolveCampaignWizardStepPath(campaign);
    return <Navigate to={wizardStepPath} replace />;
  }

  // Guard for creator: non-active and non-finished campaigns cannot be accessed
  if (
    userProfile?.role === 'CREATOR' &&
    campaign.campaignStatus !== 'ACTIVE' &&
    campaign.campaignStatus !== 'FINISHED'
  ) {
    return <Navigate to="/dashboard/campaigns" replace />;
  }

  return (
    <div className={cn('w-full pb-12', className)}>
      {/* Hero Banner Header - Full Width with Backdrop and Gradient Fade */}
      <CampaignDetailHeader
        campaign={campaign}
        userRole={userProfile?.role}
      />

      {/* Main Campaign Content Container spanning full available space */}
      <div className="w-full space-y-6 pt-2 sm:pt-4">
        {/* Dynamic Role-Aware Tabs */}
        <CampaignDetailTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={userProfile?.role}
        />

        {/* Active Tab View */}
        {activeTab === 'detail' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
            {/* Main Left Column (8 cols): About, Collapsible Brief & Materials Sections */}
            <div className="lg:col-span-8 space-y-6 min-w-0">
              <CampaignDetailAbout description={campaign.description} />
              <CampaignDetailBriefSections
                brief={campaign.brief}
                materials={campaign.materials}
              />
            </div>

            {/* Sticky Right Sidebar (4 cols): Budget burn, 2x2 rate grid, schedule */}
            <div className="lg:col-span-4 min-w-0">
              <CampaignDetailRewardSidebar campaign={campaign} />
            </div>
          </div>
        ) : (
          <CampaignDetailSubmissionsPlaceholder
            userRole={userProfile?.role}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
}

export default CampaignDetailPage;
