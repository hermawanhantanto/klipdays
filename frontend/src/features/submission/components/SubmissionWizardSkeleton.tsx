import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loading state for the submission wizard during initial campaign & submission data fetch.
 *
 * @returns Rendered skeleton placeholder layout.
 */
export function SubmissionWizardSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="h-8 w-32 bg-muted/60 rounded-lg" />
        <div className="h-4 w-48 bg-muted/50 rounded" />
      </div>

      {/* Stepper skeleton */}
      <div className="h-14 w-full bg-muted/40 rounded-xl border border-border/60" />

      {/* Main card skeleton */}
      <Card className="border-border/60">
        <CardHeader className="space-y-2">
          <div className="h-6 w-48 bg-muted/70 rounded" />
          <div className="h-4 w-80 bg-muted/50 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 w-full bg-muted/40 rounded-xl" />
          <div className="h-10 w-40 bg-muted/60 rounded-lg ml-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Skeleton loading state rendered inside the outlet when navigating between wizard steps.
 * Prevents Cumulative Layout Shift (CLS).
 *
 * @returns Rendered step skeleton placeholder.
 */
export function SubmissionStepSkeleton() {
  return (
    <Card className="border-border/60 animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-6 w-48 bg-muted/70 rounded" />
        <div className="h-4 w-72 bg-muted/50 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 w-full bg-muted/30 rounded-xl" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-9 w-24 bg-muted/50 rounded-lg" />
          <div className="h-9 w-36 bg-muted/60 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
