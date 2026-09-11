import { ExternalLink, FileText, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CAMPAIGN_CATEGORY_LABELS,
  type CampaignCategoryOption,
  CAMPAIGN_PLATFORM_LABELS,
  type CampaignPlatformOption,
  CAMPAIGN_TYPE_LABELS,
  type CampaignTypeOption,
} from '../schemas';
import type { CampaignReviewBasicInfoProps } from '../types';

/**
 * Section 1 review card: Displays campaign basic identity, categorization, and media links.
 *
 * @param props - Component properties containing campaign data and edit navigation handler.
 * @returns The rendered basic information review card element.
 */
export function CampaignReviewBasicInfo({ campaign, onEdit }: CampaignReviewBasicInfoProps) {
  const categoryLabel = campaign.campaignCategory
    ? (CAMPAIGN_CATEGORY_LABELS[campaign.campaignCategory as CampaignCategoryOption] ?? campaign.campaignCategory)
    : '-';

  const typeLabel = campaign.campaignType
    ? (CAMPAIGN_TYPE_LABELS[campaign.campaignType as CampaignTypeOption] ?? campaign.campaignType)
    : '-';

  const platformLabel = campaign.platform
    ? (CAMPAIGN_PLATFORM_LABELS[campaign.platform as CampaignPlatformOption] ?? campaign.platform)
    : 'TikTok';

  const titleDisplay = campaign.title || 'Belum ada judul';
  const descriptionDisplay = campaign.description || 'Belum ada deskripsi kampanye.';

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">1. Informasi Dasar Kampanye</CardTitle>
            <CardDescription>Detail identitas dan kategorisasi produk/layanan</CardDescription>
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

      <CardContent className="space-y-4 pt-1">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {campaign.thumbnailUrl ? (
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
              <img src={campaign.thumbnailUrl} alt={titleDisplay} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">{titleDisplay}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 dark:text-orange-300">
                  {categoryLabel}
                </span>
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {typeLabel}
                </span>
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {platformLabel}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-line">{descriptionDisplay}</p>

            {campaign.mainMediaUrl ? (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Tautan Media Utama:</span>
                <a
                  href={campaign.mainMediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Buka Tautan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
