import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignFormStep5 } from '../../components';

/**
 * Step 5 orchestrator: Review & Submit Kampanye.
 * Pure shell rendering the campaign review and submission summary inside a structured card container.
 *
 * @returns The rendered step 5 card shell.
 */
function CampaignStep5() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Langkah 5: Review & Submit</CardTitle>
        <CardDescription>
          Tinjau kembali seluruh rincian kampanye Anda sebelum mengajukannya untuk proses review admin.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep5 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep5;
