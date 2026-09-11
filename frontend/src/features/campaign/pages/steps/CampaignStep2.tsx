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
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">Materi & Aset Promosi</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          Sediakan materi dan aset yang akan digunakan oleh kreator (clippers) untuk membuat video promosi.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CampaignFormStep2 />
      </CardContent>
    </Card>
  );
}

export default CampaignStep2;
