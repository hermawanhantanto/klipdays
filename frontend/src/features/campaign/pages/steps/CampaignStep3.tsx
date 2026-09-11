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
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">Brief & Panduan Kreator</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
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
