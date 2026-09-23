import { Navigate, useParams } from 'react-router';

/**
 * Index redirect orchestrator for legacy `/campaigns/:id/submit` paths.
 * Since video submission has been converted to an in-place modal dialog,
 * redirects creators directly to the main Campaign Detail page.
 *
 * @returns Redirection element to the campaign detail page.
 */
export function SubmissionWizardIndexRedirect() {
  const { id: campaignId } = useParams<{ id?: string }>();

  if (!campaignId) {
    return <Navigate to="/creator-dashboard/creator-campaigns" replace />;
  }

  return <Navigate to={`/campaigns/${campaignId}`} replace />;
}

