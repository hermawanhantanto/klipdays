import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { RewardForm } from '../../components';
import { GetWizardStepPath } from '../../config/wizard-steps';
import { UseCampaignQuery, UseEditCampaignMutation } from '../../hooks';
import type { RewardFormValues } from '../../schemas';

/**
 * Step 4 orchestrator: Hadiah & Anggaran Kampanye.
 * Entry point for setting CPM rewards, view thresholds, total escrow budget, and campaign dates.
 * Fetches campaign details and orchestrates mutation when saving reward and budget data.
 *
 * @returns The rendered step 4 card container.
 */
function Step4Reward() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  const editMutation = UseEditCampaignMutation(id, {
    successMessage: 'Hadiah & anggaran berhasil disimpan.',
  });

  /**
   * Dispatches the validated reward form values to the edit campaign mutation.
   *
   * @param values - Validated reward and budget form values.
   */
  function HandleSubmit(values: RewardFormValues) {
    if (!id) return;
    editMutation.mutate(values);
  }

  /**
   * Navigates back to Step 3 (Brief & Panduan).
   */
  function HandleBack() {
    const targetPath = GetWizardStepPath('step-3', id);
    navigate(targetPath);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 4: Hadiah & Anggaran</CardTitle>
        <CardDescription>
          Tentukan tarif CPM, ambang batas penayangan minimum dan maksimum, serta total anggaran kampanye.
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
        ) : (
          <RewardForm
            initialData={campaign}
            onSubmit={HandleSubmit}
            onBack={HandleBack}
            isPending={editMutation.isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default Step4Reward;
