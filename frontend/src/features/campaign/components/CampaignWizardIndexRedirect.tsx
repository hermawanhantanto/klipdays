import { Navigate, useParams } from 'react-router';
import { UseCampaignQuery } from '../hooks';
import { ResolveCampaignWizardStepPath } from '../utils';
import { CampaignWizardSkeleton } from './CampaignWizardSkeleton';

/**
 * CampaignWizardIndexRedirect handles index routing for an existing campaign creation wizard.
 * Instead of hardcoding a fallback to Step 1, it inspects campaign completeness
 * and redirects the user directly to their latest accessible wizard step.
 *
 * @returns The redirection component or loading skeleton.
 */
export function CampaignWizardIndexRedirect() {
  const { id } = useParams<{ id?: string }>();
  const { data: campaign, isLoading } = UseCampaignQuery(id);

  if (isLoading) {
    return <CampaignWizardSkeleton />;
  }

  const targetPath = ResolveCampaignWizardStepPath(campaign);
  return <Navigate to={targetPath} replace />;
}
