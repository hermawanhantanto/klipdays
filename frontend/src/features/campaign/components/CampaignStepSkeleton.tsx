import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton placeholder for individual campaign wizard step pages.
 * Displays a structured skeleton replicating a wizard form card container
 * while route chunks are loaded dynamically via Suspense.
 *
 * @returns The rendered step form skeleton shell.
 */
export function CampaignStepSkeleton() {
  return (
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
  );
}
