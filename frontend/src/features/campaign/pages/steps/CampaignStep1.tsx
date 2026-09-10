import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignFormStep1 } from '../../components';

/**
 * Step 1 orchestrator: Campaign Basic Information.
 * Wraps the basic info form in a structured card container.
 *
 * @returns The rendered step 1 card shell.
 */
function CampaignStep1() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 1: Informasi Dasar</CardTitle>
        <CardDescription>
          Tentukan identitas dasar kampanye seperti judul, kategori produk, platform, dan aset media utama.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep1 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep1;
