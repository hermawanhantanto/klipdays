import { Check } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router';

import { cn } from '@/lib/utils';
import { CAMPAIGN_WIZARD_STEPS, GetWizardStepPath } from '../config/wizard-steps';

interface CampaignWizardStepperProps {
  className?: string;
}

/**
 * Stepper navigation component for the campaign creation workflow.
 * Renders numbered indicators with titles and descriptions,
 * highlighting the active step and completed steps based on the current URL path.
 *
 * @param props - Component properties including optional custom className.
 * @returns The rendered wizard stepper navigation bar.
 */
export function CampaignWizardStepper({ className }: CampaignWizardStepperProps) {
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();

  const activeIndex = CAMPAIGN_WIZARD_STEPS.findIndex((step) => location.pathname.includes(step.slug));
  const currentStepNumber = activeIndex >= 0 ? activeIndex + 1 : 1;

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile Step Counter & Progress */}
      <div className="mb-4 block sm:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Langkah {currentStepNumber} dari {CAMPAIGN_WIZARD_STEPS.length}
          </span>
          <span className="font-semibold text-foreground">{CAMPAIGN_WIZARD_STEPS[currentStepNumber - 1]?.title}</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStepNumber / CAMPAIGN_WIZARD_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper Indicator */}
      <nav aria-label="Langkah Pembuatan Kampanye" className="hidden sm:block">
        <ol className="flex items-center justify-between gap-2 lg:gap-4">
          {CAMPAIGN_WIZARD_STEPS.map((step, index) => {
            const isCompleted = step.stepNumber < currentStepNumber;
            const isCurrent = step.stepNumber === currentStepNumber;
            const isLast = index === CAMPAIGN_WIZARD_STEPS.length - 1;

            const targetPath = GetWizardStepPath(step.slug, id);

            const circleClass = isCompleted
              ? 'bg-primary text-primary-foreground'
              : isCurrent
                ? 'border-2 border-primary bg-background text-primary font-bold shadow-xs'
                : 'border border-border bg-muted/50 text-muted-foreground';

            const titleClass = isCurrent
              ? 'font-semibold text-foreground'
              : isCompleted
                ? 'font-medium text-foreground'
                : 'text-muted-foreground';

            return (
              <li key={step.id} className={cn('flex items-center', !isLast ? 'flex-1' : '')}>
                <Link
                  to={targetPath}
                  className="group flex items-center gap-3 text-left outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1">
                  <div
                    className={cn('flex size-9 shrink-0 items-center justify-center rounded-full text-xs transition-colors', circleClass)}>
                    {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : step.stepNumber}
                  </div>
                  <div className="hidden min-w-0 md:block">
                    <p className={cn('truncate text-xs tracking-tight lg:text-sm', titleClass)}>{step.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{step.description}</p>
                  </div>
                </Link>

                {!isLast && (
                  <div
                    className={cn('mx-2 hidden h-0.5 flex-1 transition-colors sm:block lg:mx-4', isCompleted ? 'bg-primary' : 'bg-border')}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
