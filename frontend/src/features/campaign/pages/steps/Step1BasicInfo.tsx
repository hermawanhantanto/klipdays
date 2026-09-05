import { AlertCircle, Loader2 } from 'lucide-react';
import { useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { BasicInfoForm } from '../../components';
import { UseCampaignQuery, UseEditCampaignMutation } from '../../hooks';
import type { BasicInfoFormValues } from '../../schemas';

/**
 * Step 1 orchestrator: Informasi Dasar Kampanye.
 * Entry point for entering campaign title, description, category, platform, and media.
 * Fetches campaign details and orchestrates mutation when saving basic info.
 *
 * @returns The rendered step 1 card container.
 */
function Step1BasicInfo() {
  const { id } = useParams<{ id?: string }>();

  const { data: campaign, isLoading, isError, error, refetch } = UseCampaignQuery(id);

  const editMutation = UseEditCampaignMutation(id);

  /**
   * Dispatches the validated basic info form values to the edit campaign mutation.
   *
   * @param values - Validated basic info form values.
   */
  function HandleSubmit(values: BasicInfoFormValues) {
    if (!id) return;
    editMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 1: Informasi Dasar</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Tentukan identitas dasar kampanye seperti judul, kategori produk, platform, dan aset media utama.</CardDescription>
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
          <BasicInfoForm initialData={campaign} onSubmit={HandleSubmit} isPending={editMutation.isPending} />
        )}
      </CardContent>
    </Card>
  );
}

export default Step1BasicInfo;
