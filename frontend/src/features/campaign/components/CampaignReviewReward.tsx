import { Calendar, Coins, Pencil, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CampaignReviewRewardProps } from '../types';
import { FormatDateRange, FormatNumber, FormatRupiah } from '../utils';

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
 * Section 4 review card: Displays CPM, budget, view boundaries, schedule, and live ROI projections.
 *
 * @param props - Component properties containing campaign data, calculated projections, and edit handler.
 * @returns The rendered reward and budget review card element.
 */
export function CampaignReviewReward({ campaign, projections, onEdit }: CampaignReviewRewardProps) {
  const cpmValue = campaign.cpm != null ? Number(campaign.cpm) : null;
  const budgetValue = campaign.budget != null ? Number(campaign.budget) : null;

  const formattedCpm = FormatRupiah(cpmValue);
  const formattedBudget = FormatRupiah(budgetValue);
  const formattedMinViews = FormatNumber(campaign.minViews);
  const formattedMaxViews = FormatNumber(campaign.maxViews);

  const dateRangeDisplay = FormatDateRange(campaign.startDate, campaign.endDate);
  const formattedEstimatedViews = FormatNumber(projections.totalEstimatedViews);
  const formattedMaxEarnings = FormatRupiah(projections.maxEarningsPerVideo);
  const fundedVideosDisplay = `~${projections.minFundedVideos} video`;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">4. Hadiah & Anggaran</CardTitle>
            <CardDescription>Tarif per tayangan, alokasi sistem dana aman, serta jadwal tayang</CardDescription>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
          Ubah
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 pt-1">
        {/* Key Metric Numbers */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
            <span className="text-xs text-muted-foreground block truncate">Tarif CPM</span>
            <p
              className={cn('font-bold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(formattedCpm))}
              title={formattedCpm}>
              {formattedCpm}
            </p>
            <span className="text-[11px] text-muted-foreground block truncate">per 1.000 views</span>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
            <span className="text-xs text-muted-foreground block truncate">Total Anggaran</span>
            <p
              className={cn('font-bold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(formattedBudget))}
              title={formattedBudget}>
              {formattedBudget}
            </p>
            <span className="text-[11px] text-muted-foreground block truncate">sistem dana aman</span>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
            <span className="text-xs text-muted-foreground block truncate">Ambang Min. Tayangan</span>
            <p
              className={cn('font-bold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(formattedMinViews))}
              title={formattedMinViews}>
              {formattedMinViews}
            </p>
            <span className="text-[11px] text-muted-foreground block truncate">views sebelum menghasilkan</span>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
            <span className="text-xs text-muted-foreground block truncate">Batas Maks. per Video</span>
            <p
              className={cn('font-bold text-foreground tracking-tight tabular-nums truncate', GetAdaptiveMetricFontSize(formattedMaxViews))}
              title={formattedMaxViews}>
              {formattedMaxViews}
            </p>
            <span className="text-[11px] text-muted-foreground block truncate">earning cap per video</span>
          </div>
        </div>

        {/* Schedule & Projections Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Periode & Jadwal Kampanye
            </div>
            <p className="text-base font-medium text-foreground">{dateRangeDisplay}</p>
            <p className="text-xs text-muted-foreground">
              Durasi aktif: <span className="font-semibold text-foreground">{projections.durationDays} hari</span>
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Potensi Jangkauan (Estimasi)
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Estimasi Total Views:</span>
              <span className="font-bold text-foreground">{formattedEstimatedViews} views</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Maks. Imbalan per Video:</span>
              <span className="font-bold text-foreground">{formattedMaxEarnings}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Kapasitas Video Penuh:</span>
              <span className="font-medium text-foreground">{fundedVideosDisplay}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
