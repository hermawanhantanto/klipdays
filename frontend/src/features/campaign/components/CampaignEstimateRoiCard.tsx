import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CampaignEstimateRoiCardProps } from '../types';
import { FormatNumber, FormatRupiah } from '../utils';

/**
 * Calculates adaptive font size based on numeric text length to prevent overflow in constrained cards.
 *
 * @param value - The formatted text string.
 * @returns Tailwind typography CSS classes.
 */
function GetAdaptiveMetricFontSize(value: string): string {
  if (value.length > 15) {
    return 'text-sm sm:text-base';
  }
  if (value.length > 12) {
    return 'text-base sm:text-lg';
  }
  return 'text-lg';
}

/**
 * Displays live performance projections and estimated ROI metrics for campaign rewards and budget.
 *
 * @param props - Component properties containing calculated projections and optional className.
 * @returns The rendered estimated ROI projections card element.
 */
export function CampaignEstimateRoiCard({ projections, className }: CampaignEstimateRoiCardProps) {
  const totalViewsFormatted = FormatNumber(projections.totalEstimatedViews);
  const maxEarningsFormatted = FormatRupiah(projections.maxEarningsPerVideo);
  const fundedVideosLabel = projections.minFundedVideos > 0 ? `~${projections.minFundedVideos} video` : '-';
  const durationLabel = projections.durationDays > 0 ? `${projections.durationDays} hari` : '-';

  const stats = [
    {
      label: 'Estimasi Penayangan',
      value: totalViewsFormatted,
      subtext: 'potensi views dari budget',
    },
    {
      label: 'Maks. Imbalan / Video',
      value: maxEarningsFormatted,
      subtext: 'cap tembus batas atas',
    },
    {
      label: 'Kapasitas Video',
      value: fundedVideosLabel,
      subtext: 'video terdanai maksimal',
    },
    {
      label: 'Durasi Kampanye',
      value: durationLabel,
      subtext: 'periode aktif promosi',
    },
  ];

  return (
    <Card className={cn('border-border/60 bg-muted/20 shadow-xs', className)}>
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Estimasi Performa & ROI Kampanye
          </h4>
          <span className="text-[11px] text-muted-foreground/70">Kalkulasi Otomatis</span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 overflow-hidden space-y-1 rounded-lg border border-border/40 bg-background/80 p-3">
              <span className="text-xs text-muted-foreground block truncate">{stat.label}</span>
              <p
                className={cn('font-semibold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(stat.value))}
                title={stat.value}>
                {stat.value}
              </p>
              <span className="text-[11px] text-muted-foreground/80 block truncate">{stat.subtext}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
