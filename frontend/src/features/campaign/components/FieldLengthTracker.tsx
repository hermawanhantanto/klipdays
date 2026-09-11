import { cn } from '@/lib/utils';
import type { FieldLengthTrackerProps } from '../types';

/**
 * Visual character length indicator for text inputs and textareas.
 * Renders current versus maximum character count with responsive color states
 * (default muted -> warning amber at >=90% -> destructive at limit).
 *
 * @param props - Current character count, maximum threshold, and optional className.
 * @returns The rendered character count indicator.
 */
export function FieldLengthTracker({ current, max, className }: FieldLengthTrackerProps) {
  const isAtLimit = current >= max;
  const isNearLimit = current >= Math.floor(max * 0.9) && !isAtLimit;

  const statusColor = isAtLimit
    ? 'text-destructive font-semibold'
    : isNearLimit
      ? 'text-amber-600 dark:text-amber-400 font-medium'
      : 'text-muted-foreground/70';

  return (
    <span
      className={cn('text-[11px] tabular-nums transition-colors', statusColor, className)}
      aria-live="polite"
      aria-label={`${current} dari ${max} karakter terpakai`}>
      {current}/{max}
    </span>
  );
}
