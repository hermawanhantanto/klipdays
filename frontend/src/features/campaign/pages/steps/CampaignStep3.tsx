import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignFormStep3 } from '../../components';

/**
 * Step 3 orchestrator: Brief & Panduan Kampanye.
 * Pure shell rendering the campaign brief and guidelines form inside a structured card container.
 *
 * @returns The rendered step 3 card shell.
 */
function CampaignStep3() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 3: Brief & Panduan</CardTitle>
        <CardDescription>
          Berikan arahan kreatif, pesan utama, instruksi caption, tagar, serta aturan pembuatan konten bagi kreator.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep3 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep3;
