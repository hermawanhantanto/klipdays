import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionFormStep4Overview } from '../../components';
import type { SubmissionWizardOutletContext } from '../../types';

/**
 * Step 4 page orchestrator: Video Submission Overview & Final Confirmation.
 *
 * @returns Rendered step 4 container card.
 */
function SubmissionStep4() {
  const { campaign, submissionData } = useOutletContext<SubmissionWizardOutletContext>();

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium tracking-tight">Konfirmasi Pengajuan</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Periksa kembali rincian video kamu sebelum dikirimkan ke brand untuk ditinjau.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SubmissionFormStep4Overview
          campaign={campaign}
          submission={submissionData?.submission}
          connectedAccount={submissionData?.socialAccount}
        />
      </CardContent>
    </Card>
  );
}

export default SubmissionStep4;
