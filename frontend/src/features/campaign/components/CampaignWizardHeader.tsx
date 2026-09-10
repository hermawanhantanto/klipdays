import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

/**
 * Top header component for the Campaign Creation Wizard.
 * Displays the back navigation button linking to the campaigns directory,
 * alongside the wizard's title and description.
 *
 * @returns The rendered campaign wizard header.
 */
export function CampaignWizardHeader() {
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
