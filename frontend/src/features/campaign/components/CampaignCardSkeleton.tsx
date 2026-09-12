import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CampaignCardSkeletonProps } from '../types';

/**
 * Skeleton placeholder for CampaignCard matching its geometry and spacing.
 * Prevents Cumulative Layout Shift (CLS) during campaign data fetching.
 *
 * @param props - Component properties containing optional custom CSS classes.
 * @returns The rendered campaign card skeleton element.
 */
export function CampaignCardSkeleton({ className }: CampaignCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card p-0 py-0 gap-0 shadow-xs',
        className
      )}>
      {/* Thumbnail Aspect Ratio Skeleton */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30 p-3 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full bg-muted/60" />
            <Skeleton className="h-4 w-20 rounded-md bg-muted/60" />
          </div>
          <Skeleton className="h-4 w-16 rounded-full bg-muted/60" />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <CardContent className="flex flex-1 flex-col justify-between p-4 space-y-3.5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-3/5 rounded-md" />
          <div className="flex items-baseline gap-2 pt-1">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md ml-auto" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-8 rounded-md" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
