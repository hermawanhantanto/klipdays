import { Check, Lock } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';
import { GetSubmissionWizardStepPath, SUBMISSION_WIZARD_STEPS } from '../config/submission-wizard-steps';
import type { SubmissionWizardStepperProps } from '../types';

/**
 * Stepper navigation component displaying the 4 stages of the video submission workflow.
 * Uses seamless edge-to-edge styling and disables navigation to locked upcoming steps.
 *
 * @param props - Stepper properties with current step, maximum accessible step, and campaign ID.
 * @returns Rendered horizontal stepper navigation element.
 */
export function SubmissionWizardStepper({
  currentStepNumber,
  highestAccessibleStep,
  campaignId,
  className,
}: SubmissionWizardStepperProps) {
  return (
    <nav
      aria-label="Progres Pengajuan Video"
      className={cn(
        'w-full overflow-hidden overflow-x-auto rounded-xl border border-border/60 bg-muted/20 p-0 shadow-xs',
        className,
      )}>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60 min-w-[540px] md:min-w-0">
        {SUBMISSION_WIZARD_STEPS.map((step) => {
          const isCurrent = step.stepNumber === currentStepNumber;
          const isCompleted = step.stepNumber < currentStepNumber || step.stepNumber < highestAccessibleStep;
          const isAccessible = step.stepNumber <= highestAccessibleStep;
          const stepPath = GetSubmissionWizardStepPath(step.slug, campaignId);

          if (!isAccessible) {
            return (
              <div
                key={step.slug}
                aria-disabled="true"
                className="flex items-center gap-3 px-4 py-3 opacity-40 cursor-not-allowed select-none bg-muted/10 md:first:rounded-l-xl md:last:rounded-r-xl">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-[11px] font-medium text-muted-foreground">
                  <Lock className="size-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{step.label}</p>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={step.slug}
              to={stepPath}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-primary md:first:rounded-l-xl md:last:rounded-r-xl',
                isCurrent
                  ? 'bg-background text-foreground font-medium shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )}>
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                  isCompleted && !isCurrent
                    ? 'bg-foreground/10 text-foreground border border-border/80'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border/70 text-muted-foreground',
                )}>
                {isCompleted && !isCurrent ? <Check className="size-3" /> : step.stepNumber}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-xs truncate',
                    isCurrent ? 'font-semibold text-foreground' : 'font-medium',
                  )}>
                  {step.label}
                </p>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
