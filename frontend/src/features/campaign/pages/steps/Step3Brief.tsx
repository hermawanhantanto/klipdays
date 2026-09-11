import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { BriefForm } from '../../components';
import { GetWizardStepPath } from '../../config/wizard-steps';
import { UseCampaignQuery, UseEditCampaignMutation } from '../../hooks';
import type { BriefFormValues } from '../../schemas';

/**
 * Step 3 orchestrator: Brief & Panduan Kampanye.
 * Entry point for defining creative guidelines, key messages, call-to-actions, and do/don't rules.
 * Fetches campaign details and orchestrates mutation when saving the campaign brief.
 *
 * @returns The rendered step 3 card container.
 */
function Step3Brief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  const editMutation = UseEditCampaignMutation(id, {
    successMessage: 'Brief & panduan berhasil disimpan.',
  });

  /**
   * Dispatches the validated brief form values to the edit campaign mutation.
   *
   * @param values - Validated campaign brief form values.
   */
  function HandleSubmit(values: BriefFormValues) {
    if (!id) return;
    editMutation.mutate({ brief: values });
  }

  /**
   * Navigates back to Step 2 (Materials & Assets).
   */
  function HandleBack() {
    const targetPath = GetWizardStepPath('step-2', id);
    navigate(targetPath);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 3: Brief & Panduan</CardTitle>
        <CardDescription>
          Berikan arahan kreatif, pesan utama, instruksi caption, tagar, serta aturan pembuatan konten bagi kreator.
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
          <BriefForm
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

export default Step3Brief;
