import { ExternalLink, FileSpreadsheet, FileText, Image as ImageIcon, Link2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CampaignDetailMaterialsProps } from '../types';

/**
 * Section 3 of Campaign Detail view: Campaign Materials and Assets.
 * Renders downloadable video footage, raw images, documents, and reference links
 * provided by the brand for creators to produce their clips.
 *
 * @param props - Component properties containing the campaign materials array.
 * @returns The rendered materials section element.
 */
export function CampaignDetailMaterials({ materials, className }: CampaignDetailMaterialsProps) {
  const activeMaterials = materials?.filter((item) => item.status !== 'DELETED') ?? [];

  const ResolveMaterialIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="size-4 text-primary" />;
      case 'IMAGE':
        return <ImageIcon className="size-4 text-emerald-500" />;
      case 'DOCUMENT':
        return <FileSpreadsheet className="size-4 text-sky-500" />;
      case 'LINK':
      default:
        return <Link2 className="size-4 text-amber-500" />;
    }
  };

  return (
    <section className={cn('space-y-4 pt-4 border-t border-border/40', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Materi & Aset Clipping
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Unduh footage mentah, visual produk resmi, dan aset pendukung untuk bahan pembuatan klip.
        </p>
      </div>

      {activeMaterials.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-xs sm:text-sm text-muted-foreground italic">
          Belum ada materi atau aset yang diunggah untuk kampanye ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {activeMaterials.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 border border-border/40">
                  {ResolveMaterialIcon(material.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate" title={material.name}>
                    {material.name}
                  </p>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {material.type}
                  </span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1 text-xs border-border/60">
                <a href={material.url} target="_blank" rel="noopener noreferrer">
                  <span>Buka</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
