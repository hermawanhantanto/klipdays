import { ArrowLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import { Button } from '@/components/ui/button';
import { CampaignWizardStepper } from '../components/CampaignWizardStepper';

/**
 * Layout orchestrator for the campaign creation workflow wizard.
 * Houses the top navigation link back to the campaigns list,
 * the progress stepper showing current step completion,
 * and the dynamic nested route outlet for each individual step.
 *
 * @returns The rendered campaign wizard layout shell.
 */
function CampaignWizardLayout() {
  return (
    <div className="w-full max-w-5xl space-y-6 pb-12">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/dashboard/campaigns" className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Kampanye</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Buat Kampanye Baru</h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi formulir di bawah ini dalam beberapa langkah mudah untuk memulai kampanye promosi Anda.
          </p>
        </div>

        {/* Dynamic Stepper Bar */}
        <div className="pt-2">
          <CampaignWizardStepper />
        </div>
      </div>

      {/* Dynamic Active Step Content Outlet */}
      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
}

export default CampaignWizardLayout;
