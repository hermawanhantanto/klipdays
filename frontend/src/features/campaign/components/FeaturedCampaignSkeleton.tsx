import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { FeaturedCampaignSkeletonProps } from '../types';

/**
 * Geometric skeleton placeholder for the featured campaign hero carousel.
 * Prevents layout shift during initial carousel data fetching.
 *
 * @param props - Component properties containing optional custom CSS classes.
 * @returns The rendered carousel skeleton element.
 */
export function FeaturedCampaignSkeleton({ className }: FeaturedCampaignSkeletonProps) {
  return (
    <div
      className={cn(
        'relative flex h-[340px] w-full flex-col justify-between overflow-hidden bg-background px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 sm:h-[380px] lg:h-[420px]',
        className
      )}>
      {/* Content stack skeleton (vertically centered) */}
      <div className="space-y-3.5 sm:space-y-4">
        {/* "FEATURED" tag skeleton */}
        <Skeleton className="h-4 w-20 rounded-md bg-zinc-800/70" />

        {/* Title skeleton lines */}
        <div className="space-y-2 pt-0.5">
          <Skeleton className="h-7 w-3/4 max-w-md rounded-lg bg-zinc-800/80 sm:h-9" />
          <Skeleton className="h-6 w-1/2 max-w-xs rounded-lg bg-zinc-800/60 sm:h-7" />
        </div>

        {/* Brand row skeleton */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="size-7 rounded-full bg-zinc-800/80 sm:size-8" />
          <Skeleton className="h-4 w-24 rounded-md bg-zinc-800/80" />
          <Skeleton className="h-5 w-20 rounded-full bg-zinc-800/60" />
        </div>

        {/* CPM rate display skeleton */}
        <div className="flex items-baseline gap-2 pt-1">
          <Skeleton className="h-8 w-32 rounded-lg bg-zinc-800/80" />
          <Skeleton className="h-4 w-16 rounded-md bg-zinc-800/50" />
        </div>

        {/* CTA Button skeleton */}
        <div className="pt-2">
          <Skeleton className="h-10 w-36 rounded-xl bg-zinc-800/80 sm:h-11 sm:w-40" />
        </div>
      </div>

      {/* Bottom controls skeleton */}
      <div className="flex items-center justify-between pt-4">
        {/* Empty left spacer */}
        <div className="w-10" />

        {/* Pagination indicators skeleton */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-1.5 w-7 rounded-full bg-zinc-700" />
          <Skeleton className="size-1.5 rounded-full bg-zinc-800" />
          <Skeleton className="size-1.5 rounded-full bg-zinc-800" />
        </div>

        {/* Micro-nav buttons skeleton */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-8 rounded-lg bg-zinc-800/80" />
          <Skeleton className="size-8 rounded-lg bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}
