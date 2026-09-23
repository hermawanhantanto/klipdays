import { useOutletContext } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionFormStep1Brief } from '../../components';
import type { SubmissionWizardOutletContext } from '../../types';

/**
 * Step 1 page orchestrator: Campaign Brief & Compliance Agreement.
 *
 * @returns Rendered step 1 container card.
 */
function SubmissionStep1() {
  const { campaign } = useOutletContext<SubmissionWizardOutletContext>();

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium tracking-tight">Ketentuan & Panduan Kreatif</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Pastikan konten video kamu memenuhi seluruh ketentuan berikut sebelum dikirimkan.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SubmissionFormStep1Brief campaign={campaign} />
      </CardContent>
    </Card>
  );
}

export default SubmissionStep1;
