import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CampaignReviewCompletenessAlertProps } from '../types';

/**
 * Renders a warning alert when one or more wizard steps are incomplete,
 * listing the missing requirements with quick-jump action buttons.
 *
 * @param props - Component properties containing missing steps and navigation callback.
 * @returns The rendered completeness alert banner element or null if all steps are complete.
 */
export function CampaignReviewCompletenessAlert({
  missingSteps,
  onNavigateToStep,
}: CampaignReviewCompletenessAlertProps) {
  if (missingSteps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="space-y-2">
          <h4 className="font-semibold text-destructive">Kampanye Belum Siap Diajukan</h4>
          <p className="text-xs text-muted-foreground">
            Terdapat beberapa langkah yang belum lengkap. Harap lengkapi sebelum mengajukan kampanye untuk direview.
          </p>
          <ul className="space-y-1.5 pt-1">
            {missingSteps.map((step) => {
              const stepPrefix = `Langkah ${step.stepNumber} (${step.title}):`;

              return (
                <li key={step.slug} className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-foreground">
                    <strong className="font-medium">{stepPrefix}</strong> {step.reason}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToStep(step.slug)}
                    className="h-7 text-xs">
                    Lengkapi
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
