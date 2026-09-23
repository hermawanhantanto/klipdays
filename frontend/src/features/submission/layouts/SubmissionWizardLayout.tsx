import { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { toast } from 'sonner';
import { UseCampaignQuery } from '@/features/campaign/hooks';
import {
  SubmissionStepSkeleton,
  SubmissionWizardHeader,
  SubmissionWizardSkeleton,
  SubmissionWizardStepper,
} from '../components';
import { GetSubmissionWizardStepPath, SUBMISSION_WIZARD_STEPS } from '../config/submission-wizard-steps';
import { UseMyCampaignSubmissionQuery } from '../hooks';
import type { SubmissionWizardOutletContext } from '../types';
import { GetHighestAccessibleSubmissionStepNumber } from '../utils/submission-utils';

/**
 * Layout orchestrator for the Creator Post-First video submission wizard.
 * Houses the wizard header with back navigation, progress stepper,
 * route guards ensuring creators cannot skip mandatory steps or submit without joining,
 * and the dynamic nested route outlet with CLS-safe Suspense fallbacks.
 *
 * @returns The rendered submission wizard layout shell.
 */
function SubmissionWizardLayout() {
  const { id: campaignId } = useParams<{ id?: string }>();
  const location = useLocation();

  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isError: isErrorCampaign,
  } = UseCampaignQuery(campaignId);

  const {
    data: submissionData,
    isLoading: isLoadingSubmission,
    isError: isErrorSubmission,
  } = UseMyCampaignSubmissionQuery(campaignId);

  const isLoading = isLoadingCampaign || isLoadingSubmission;
  const isError = isErrorCampaign || isErrorSubmission;

  const matchedStep = SUBMISSION_WIZARD_STEPS.find((step) =>
    location.pathname.includes(step.slug),
  );
  const currentStepNumber = matchedStep?.stepNumber ?? 1;

  const highestAccessibleStep = GetHighestAccessibleSubmissionStepNumber(submissionData);
  const isForbiddenStep = !isLoading && !isError && currentStepNumber > highestAccessibleStep;

  useEffect(() => {
    if (isForbiddenStep) {
      toast.warning('Harap selesaikan langkah sebelumnya terlebih dahulu.', {
        id: 'forbidden-submission-step',
      });
    } else {
      toast.dismiss('forbidden-submission-step');
    }
  }, [isForbiddenStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (!campaignId) {
    return <Navigate to="/creator-dashboard/creator-campaigns" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <SubmissionWizardSkeleton />
      </div>
    );
  }

  if (isError || !campaign) {
    return <Navigate to={`/campaigns/${campaignId}`} replace />;
  }

  // Guard: creator must join campaign first
  if (!submissionData?.submission) {
    toast.error('Anda harus bergabung dengan kampanye ini terlebih dahulu.');
    return <Navigate to={`/campaigns/${campaignId}`} replace />;
  }

  // If already submitted and reviewed/pending, direct back to campaign detail
  if (
    submissionData.submission.submissionStatus !== 'JOINED' &&
    submissionData.submission.submissionStatus !== 'REVISION_REQUESTED'
  ) {
    return <Navigate to={`/campaigns/${campaignId}`} replace />;
  }

  if (isForbiddenStep) {
    const fallbackStep =
      SUBMISSION_WIZARD_STEPS[highestAccessibleStep - 1] ?? SUBMISSION_WIZARD_STEPS[0];
    const fallbackPath = GetSubmissionWizardStepPath(fallbackStep.slug, campaignId);
    return <Navigate to={fallbackPath} replace />;
  }

  const outletContext: SubmissionWizardOutletContext = {
    campaign,
    submissionData,
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 pb-16">
      <div className="space-y-4">
        <SubmissionWizardHeader
          campaignTitle={campaign.title}
          campaignId={campaign.id}
        />
        <SubmissionWizardStepper
          currentStepNumber={currentStepNumber}
          highestAccessibleStep={highestAccessibleStep}
          campaignId={campaign.id}
        />
      </div>

      <main>
        <Suspense fallback={<SubmissionStepSkeleton />}>
          <Outlet context={outletContext} />
        </Suspense>
      </main>
    </div>
  );
}

export default SubmissionWizardLayout;
