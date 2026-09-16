import { ExternalLink, Film, Play, Sparkles, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CampaignDetailInspirationProps } from '../types';

/**
 * Section 4 of Campaign Detail view: Sample Clips & Content Inspiration.
 * Displays example reference clips or official media links so creators understand
 * the preferred pacing, visual tone, and formatting expected by the brand.
 *
 * Employs the exact guidance from the reference mockup:
 * "Video di bawah hanya untuk referensi gaya dan pendekatan clipping, jangan di download atau di upload ulang karena kamu harus membuat konten orisinal."
 *
 * @param props - Component properties containing mainMediaUrl and materials list.
 * @returns The rendered inspiration clips element.
 */
export function CampaignDetailInspiration({
  mainMediaUrl,
  materials,
  className,
}: CampaignDetailInspirationProps) {
  const videoMaterials = materials?.filter((item) => item.status !== 'DELETED' && item.type === 'VIDEO') ?? [];
  const referenceUrl = mainMediaUrl || (videoMaterials[0]?.url ?? '');

  const isDirectVideo = Boolean(
    referenceUrl && (referenceUrl.endsWith('.mp4') || referenceUrl.endsWith('.webm') || referenceUrl.endsWith('.mov'))
  );

  return (
    <section className={cn('space-y-3 pt-4 border-t border-border/40', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Contoh Clip untuk Inspirasi
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Video di bawah hanya untuk referensi gaya dan pendekatan clipping, jangan di-download atau di-upload ulang karena kamu harus membuat konten orisinal.
        </p>
      </div>

      {!referenceUrl ? (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-xs sm:text-sm text-muted-foreground flex items-center gap-2.5">
          <Film className="size-4 text-muted-foreground shrink-0" />
          <span>
            Belum ada video inspirasi khusus dari brand. Buat klip orisinal Anda sesuai dengan arahan di Brief & Panduan Kreator.
          </span>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs">
          {isDirectVideo ? (
            <div className="relative aspect-video w-full bg-black/90 flex items-center justify-center">
              <video
                src={referenceUrl}
                controls
                preload="metadata"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Play className="size-5 fill-current" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      Media Referensi & Panduan Gaya Klip
                    </p>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted/80 text-muted-foreground border border-border/40 uppercase">
                      Referensi
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-sm sm:max-w-md" title={referenceUrl}>
                    {referenceUrl}
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="default"
                size="sm"
                className="h-9 shrink-0 gap-1.5 text-xs font-semibold rounded-xl cursor-pointer">
                <a href={referenceUrl} target="_blank" rel="noopener noreferrer">
                  <Video className="size-3.5" />
                  <span>Tonton Referensi</span>
                  <ExternalLink className="size-3.5 ml-0.5" />
                </a>
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
