import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignFormStep4 } from '../../components';

/**
 * Step 4 orchestrator: Hadiah & Anggaran Kampanye.
 * Pure shell rendering the campaign reward and budget form inside a structured card container.
 *
 * @returns The rendered step 4 card shell.
 */
function CampaignStep4() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 4: Hadiah & Anggaran</CardTitle>
        <CardDescription>Tentukan tarif CPM, ambang batas penayangan minimum dan maksimum, serta total anggaran kampanye.</CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep4 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep4;
