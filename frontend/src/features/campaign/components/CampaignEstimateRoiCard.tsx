import { Sparkles } from 'lucide-react';
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
      label: 'Estimasi Total Penayangan',
      value: totalViewsFormatted,
      subtext: 'potensi views dari budget',
    },
    {
      label: 'Maks. Imbalan per Video',
      value: maxEarningsFormatted,
      subtext: 'cap jika tembus max views',
    },
    {
      label: 'Kapasitas Video Maksimal',
      value: fundedVideosLabel,
      subtext: 'video terdanai hingga batas atas',
    },
    {
      label: 'Durasi Kampanye',
      value: durationLabel,
      subtext: 'periode tayang & verifikasi',
    },
  ];

  return (
    <Card className={cn('border-border/60 bg-muted/30', className)}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Estimasi Performa & ROI Kampanye</h4>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 overflow-hidden space-y-1 rounded-md border border-border/50 bg-background/60 p-3">
              <span className="text-xs text-muted-foreground block truncate">{stat.label}</span>
              <p
                className={cn('font-bold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(stat.value))}
                title={stat.value}>
                {stat.value}
              </p>
              <span className="text-[11px] text-muted-foreground block truncate">{stat.subtext}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
