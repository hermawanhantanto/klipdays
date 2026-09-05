import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 2 orchestrator: Materi & Aset Kampanye.
 * Entry point for managing campaign footage, images, and brand guidelines documents.
 *
 * @returns The rendered step 2 card container.
 */
function Step2Materials() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 2: Materi & Aset</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Unggah video kliping, foto produk, dan materi pendukung yang dapat digunakan oleh para kreator.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-sm">
          Formulir langkah 2 (Aset Video, Gambar, Dokumen, dan Link Eksternal) siap diintegrasikan di sini.
        </p>
      </CardContent>
    </Card>
  );
}

export default Step2Materials;
