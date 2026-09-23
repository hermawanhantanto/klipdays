import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionFormStep2Account } from '../../components';
import type { SubmissionWizardOutletContext } from '../../types';

/**
 * Step 2 page orchestrator: TikTok Account Linkage & Verification.
 *
 * @returns Rendered step 2 container card.
 */
function SubmissionStep2() {
  const { campaign, submissionData } = useOutletContext<SubmissionWizardOutletContext>();

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium tracking-tight">Tautkan Akun</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Hubungkan akun media sosial kamu untuk memverifikasi kepemilikan video yang akan diajukan.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SubmissionFormStep2Account
          campaignId={campaign.id}
          connectedAccount={submissionData?.socialAccount}
        />
      </CardContent>
    </Card>
  );
}

export default SubmissionStep2;
