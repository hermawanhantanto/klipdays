import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { MaterialsForm } from '../../components';
import { GetWizardStepPath } from '../../config/wizard-steps';
import { UseCampaignQuery, UseEditCampaignMutation } from '../../hooks';
import type { MaterialsFormValues } from '../../schemas';

/**
 * Step 2 orchestrator: Materi & Aset Kampanye.
 * Entry point for managing campaign footage, images, and brand guidelines documents.
 * Fetches campaign details and orchestrates mutation when saving materials.
 *
 * @returns The rendered step 2 card container.
 */
function Step2Materials() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  const editMutation = UseEditCampaignMutation(id, {
    successMessage: 'Materi & aset berhasil disimpan.',
  });

  /**
   * Dispatches the validated materials form values to the edit campaign mutation.
   *
   * @param values - Validated materials form values.
   */
  function HandleSubmit(values: MaterialsFormValues) {
    if (!id) return;
    editMutation.mutate({ materials: values.materials });
  }

  /**
   * Navigates back to Step 1 (Basic Info).
   */
  function HandleBack() {
    const targetPath = GetWizardStepPath('step-1', id);
    navigate(targetPath);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 2: Materi & Aset</CardTitle>
        <CardDescription>
          Sediakan materi dan aset yang akan digunakan oleh kreator (clippers) untuk membuat video promosi.
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
          <MaterialsForm
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

export default Step2Materials;
