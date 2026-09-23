import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionFormStep3VideoPicker } from '../../components';
import type { SubmissionWizardOutletContext } from '../../types';

/**
 * Step 3 page orchestrator: Video Selection.
 *
 * @returns Rendered step 3 container card.
 */
function SubmissionStep3() {
  const { campaign, submissionData } = useOutletContext<SubmissionWizardOutletContext>();

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium tracking-tight">Pilih Video</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Pilih video yang telah kamu unggah di akun kamu atau masukkan tautan video secara manual.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SubmissionFormStep3VideoPicker
          campaignId={campaign.id}
          currentDraft={submissionData?.submission}
          connectedAccount={submissionData?.socialAccount}
        />
      </CardContent>
    </Card>
  );
}

export default SubmissionStep3;
