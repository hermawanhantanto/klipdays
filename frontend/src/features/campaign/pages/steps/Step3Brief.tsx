import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 3 orchestrator: Brief & Panduan Kampanye.
 * Entry point for defining creative guidelines, key messages, call-to-actions, and do/don't rules.
 *
 * @returns The rendered step 3 card container.
 */
function Step3Brief() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 3: Brief & Panduan</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Berikan arahan kreatif, pesan utama, instruksi caption, tagar, serta aturan pembuatan konten bagi kreator.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-sm">
          Formulir langkah 3 (Tujuan, Pesan Utama, Call to Action, Do & Don'ts, Hashtags) siap diintegrasikan di sini.
        </p>
      </CardContent>
    </Card>
  );
}

export default Step3Brief;
