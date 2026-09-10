import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Animated skeleton placeholder for the Campaign Wizard layout.
 * Mirrors the header navigation, multi-step progress stepper, and card form body
 * during asynchronous campaign data loading to eliminate Cumulative Layout Shift (CLS).
 *
 * @returns The rendered wizard loading skeleton.
 */
export function CampaignWizardSkeleton() {
  return (
    <div className="w-full max-w-5xl space-y-6 pb-12">
      {/* Top Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-8 w-44 rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md sm:h-9 sm:w-72" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>

        {/* Stepper Skeleton */}
        <div className="pt-2">
          {/* Mobile progress skeleton */}
          <div className="block space-y-2 sm:hidden">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>

          {/* Desktop steps skeleton */}
          <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const isLast = index === 4;
              return (
                <div key={index} className={cn('flex items-center gap-3', !isLast ? 'flex-1' : '')}>
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="hidden space-y-1 md:block">
                    <Skeleton className="h-3.5 w-20 lg:w-24 rounded-md" />
                    <Skeleton className="h-2.5 w-16 lg:w-20 rounded-md" />
                  </div>
                  {!isLast && <Skeleton className="mx-2 hidden h-0.5 flex-1 sm:block lg:mx-4" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content Card Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-56 rounded-md" />
          <Skeleton className="h-4 w-full max-w-md rounded-md" />
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
