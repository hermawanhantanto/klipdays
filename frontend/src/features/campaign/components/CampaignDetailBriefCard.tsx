import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { CampaignDetailBriefCardProps } from '../types';
import { CampaignDetailBrief } from './CampaignDetailBrief';
import { CampaignDetailMaterials } from './CampaignDetailMaterials';

/**
 * Interactive card for "Brief & Materi Clipping" reflecting the reference layout.
 * Acts as the primary entry point to creative guidelines, social posting requirements,
 * and downloadable assets. Opens a side-drawer Sheet for deep reading without cluttering
 * the main view, with an option to expand inline directly on the page.
 *
 * @param props - Component properties containing the brief and materials entities.
 * @returns The rendered brief card element with drawer and inline toggle capabilities.
 */
export function CampaignDetailBriefCard({
  brief,
  materials,
  className,
}: CampaignDetailBriefCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isInlineExpanded, setIsInlineExpanded] = useState(false);

  const activeMaterials = materials?.filter((item) => item.status !== 'DELETED') ?? [];
  const materialsCount = activeMaterials.length;

  const ToggleInlineExpanded = () => {
    setIsInlineExpanded((prev) => !prev);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {/* Main Card Container from Mockup */}
        <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-border hover:shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side: Folder Icon + Title + Subtitle */}
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3.5 text-left cursor-pointer group flex-1 min-w-0 outline-none">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/70 border border-border/40 text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <FolderKanban className="size-5" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      Brief & Materi Clipping
                    </h3>
                    {materialsCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/80 text-muted-foreground border border-border/40">
                        {materialsCount} Aset
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Wajib dibaca dan diikuti ketentuannya.
                  </p>
                </div>
              </button>
            </SheetTrigger>

            {/* Right side: Action controls */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={ToggleInlineExpanded}
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
                <span>{isInlineExpanded ? 'Tutup di Halaman' : 'Lihat Cepat'}</span>
                {isInlineExpanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </Button>

              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium rounded-lg border-border/60">
                  <span>Buka Brief</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </div>

        {/* Slide-over Drawer for In-depth Creative Guidelines */}
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-6 sm:p-8 space-y-6">
          <SheetHeader className="p-0 border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <FolderKanban className="size-5 text-primary" />
              <SheetTitle className="text-lg font-bold">Brief & Materi Clipping</SheetTitle>
            </div>
            <SheetDescription className="text-xs sm:text-sm">
              Panduan resmi pembuatan konten, copy paste teks wajib, dan materi unduhan dari brand.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 pt-2">
            <CampaignDetailBrief brief={brief} />
            <CampaignDetailMaterials materials={materials} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Inline Expanded View if Creator prefers in-page reading */}
      {isInlineExpanded && (
        <div className="space-y-6 rounded-2xl border border-border/50 bg-muted/10 p-5 sm:p-6">
          <CampaignDetailBrief brief={brief} />
          <CampaignDetailMaterials materials={materials} />
        </div>
      )}
    </div>
  );
}
