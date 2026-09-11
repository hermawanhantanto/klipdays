import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignFormStep2 } from '../../components';

/**
 * Step 2 orchestrator: Materi & Aset Kampanye.
 * Pure shell rendering the campaign materials form inside a structured card container.
 *
 * @returns The rendered step 2 card shell.
 */
function CampaignStep2() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 2: Materi & Aset</CardTitle>
        <CardDescription>Sediakan materi dan aset yang akan digunakan oleh kreator (clippers) untuk membuat video promosi.</CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep2 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep2;
