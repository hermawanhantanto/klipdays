import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 3 orchestrator: Brief & Panduan Kampanye.
 * Entry point for defining creative guidelines, key messages, call-to-actions, and do/don't rules.
 *
 * @returns The rendered step 3 card container.
 */
function Step3Brief() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 3: Brief & Panduan</CardTitle>
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
