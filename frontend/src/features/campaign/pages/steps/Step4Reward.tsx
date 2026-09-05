import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 4 orchestrator: Hadiah & Anggaran Kampanye.
 * Entry point for setting CPM rewards, view thresholds, total escrow budget, and campaign dates.
 *
 * @returns The rendered step 4 card container.
 */
function Step4Reward() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 4: Hadiah & Anggaran</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Tentukan tarif CPM, ambang batas penayangan minimum dan maksimum, serta total anggaran kampanye.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-sm">
          Formulir langkah 4 (CPM, Min Views, Max Views, Anggaran Total, Tanggal Mulai dan Berakhir) siap diintegrasikan di sini.
        </p>
      </CardContent>
    </Card>
  );
}

export default Step4Reward;
