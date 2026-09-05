import { useParams } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Step 1 orchestrator: Informasi Dasar Kampanye.
 * Entry point for entering campaign title, description, category, platform, and media.
 *
 * @returns The rendered step 1 card container.
 */
function Step1BasicInfo() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Langkah 1: Informasi Dasar</CardTitle>
          {id && <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">ID: {id}</span>}
        </div>
        <CardDescription>Tentukan identitas dasar kampanye seperti judul, kategori produk, platform, dan aset media utama.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-sm">
          Formulir langkah 1 (Judul, Kategori, Jenis Kampanye, Thumbnail, dan Tautan Media Utama) siap diintegrasikan di sini.
        </p>
      </CardContent>
    </Card>
  );
}

export default Step1BasicInfo;
