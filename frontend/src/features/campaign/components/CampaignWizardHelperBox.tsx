import { Lightbulb } from 'lucide-react';
import type { CampaignWizardHelperBoxProps } from '../types';

/**
 * Reusable contextual guidance callout box for campaign wizard steps.
 * Displays a standardized icon badge, header, description, and optional tip.
 *
 * @param props - Component properties including title, description, tip, icon, and className.
 * @returns The rendered helper box element.
 */
export function CampaignWizardHelperBox({ title, description, tip, icon: Icon = Lightbulb, className = '' }: CampaignWizardHelperBoxProps) {
  const containerClass =
    `flex items-start gap-3.5 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 sm:p-5 text-sm ${className}`.trim();

  return (
    <div className={containerClass}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500 dark:text-orange-400">
        <Icon className="size-4" />
      </div>

      <div className="space-y-1.5 flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{title}</p>

        {description && <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>}

        {tip && (
          <p className="text-xs text-muted-foreground/90 leading-relaxed pt-0.5">
            <strong className="text-orange-600 dark:text-orange-400 font-semibold">Tips: </strong>
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}
