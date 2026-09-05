import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 5 orchestrator: Review & Submit Kampanye.
 * Entry point for summarizing all campaign details and submitting for admin review.
 *
 * @returns The rendered step 5 card container.
 */
function Step5Review() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 5: Review & Submit</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Tinjau kembali seluruh rincian kampanye Anda sebelum mengajukannya untuk proses review admin.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-sm">
          Ringkasan kampanye dan tombol pengajuan (submit) siap diintegrasikan di sini.
        </p>
      </CardContent>
    </Card>
  );
}

export default Step5Review;
