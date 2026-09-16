import { cn } from '@/lib/utils';
import { GetEmptyStateForStatus } from '../utils';
import type { CampaignStatusEmptyStateProps } from '../types';

/**
 * Contextual empty state component for the brand campaigns dashboard.
 * Renders a tailored title and descriptive helper message based on the active campaign lifecycle status.
 *
 * @param props - Component properties containing the active status filter and optional styling classes.
 * @returns The rendered empty state container element.
 */
export function CampaignStatusEmptyState({ status, className }: CampaignStatusEmptyStateProps) {
  const emptyStateInfo = GetEmptyStateForStatus(status);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center',
        className
      )}
      data-testid="brand-campaigns-empty">
      <h3 className="font-heading text-base font-semibold text-foreground">
        {emptyStateInfo.title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {emptyStateInfo.description}
      </p>
    </div>
  );
}
