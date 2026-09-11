import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ReviewSummary } from '../../components';
import { GetWizardStepPath } from '../../config/wizard-steps';
import { UseCampaignQuery, UseSubmitCampaignMutation } from '../../hooks';

/**
 * Step 5 orchestrator: Review & Submit Kampanye.
 * Entry point for summarizing all campaign details across previous wizard steps
 * and submitting the campaign for admin approval via POST /campaigns/:id/submit.
 *
 * @returns The rendered step 5 card container.
 */
function Step5Review() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  const submitMutation = UseSubmitCampaignMutation(id);

  /**
   * Submits the campaign for administrative review.
   */
  function HandleSubmit() {
    if (!id) return;
    submitMutation.mutate();
  }

  /**
   * Navigates back to Step 4 (Hadiah & Anggaran).
   */
  function HandleBack() {
    const targetPath = GetWizardStepPath('step-4', id);
    navigate(targetPath);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 5: Review & Submit</CardTitle>
        <CardDescription>
          Tinjau kembali seluruh rincian kampanye Anda sebelum mengajukannya untuk proses review admin.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data kampanye...</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Gagal memuat informasi kampanye</p>
              <p className="text-sm text-muted-foreground">{error?.message ?? 'Terjadi kesalahan sistem.'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </div>
        ) : campaign ? (
          <ReviewSummary
            campaign={campaign}
            onSubmit={HandleSubmit}
            onBack={HandleBack}
            isPending={submitMutation.isPending}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default Step5Review;
