import { Fragment } from 'react';
import {
  Check,
  ExternalLink,
  FileSpreadsheet,
  Image as ImageIcon,
  Link2,
  Video,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SubmissionStep1BriefDialogProps } from '../types';

/**
 * Resolves the functional icon representing the specific asset type.
 *
 * @param type - The material media category string.
 * @returns React icon node corresponding to the asset.
 */
function ResolveMaterialIcon(type: string) {
  const normalizedType = type.toUpperCase();
  if (normalizedType.includes('VIDEO')) {
    return <Video className="size-4 text-primary" />;
  }
  if (normalizedType.includes('IMAGE')) {
    return <ImageIcon className="size-4 text-emerald-500" />;
  }
  if (
    normalizedType.includes('DOCUMENT') ||
    normalizedType.includes('DOC') ||
    normalizedType.includes('PDF')
  ) {
    return <FileSpreadsheet className="size-4 text-sky-500" />;
  }
  return <Link2 className="size-4 text-amber-500" />;
}

/**
 * Step 1 dialog body component: "Baca Brief Dulu, Yuk!".
 * Replaces tab pills with a unified collapsible accordion flow:
 * 1. Tentang Kampanye
 * 2. Wajib Ada di Video Kamu (clean typography, no pseudo-checkbox spam)
 * 3. Narasi & Skrip
 * 4. Caption, Hashtag & Mention
 * 5. Aturan Konten (Do's & Don'ts)
 * 6. Materi Clipping (Downloadable asset links)
 * Followed by the single mandatory agreement checkbox at the bottom.
 *
 * @param props - Component properties containing campaign data and agreement state.
 * @returns Rendered brief review view.
 */
export function SubmissionStep1BriefDialog({
  campaign,
  hasAgreed,
  onToggleAgreed,
  className,
}: SubmissionStep1BriefDialogProps) {
  const brief = campaign.brief;
  const materials = campaign.materials || [];
  const activeMaterials = materials.filter((item) => item.status !== 'DELETED');
  const hashtags = (brief?.hashtags || []).filter((tag) => Boolean(tag && tag.trim()));
  const mentionTags = (brief?.mentionTags || []).filter((tag) => Boolean(tag && tag.trim()));
  const dos = (brief?.dos || []).filter((item) => Boolean(item && item.trim()));
  const donts = (brief?.donts || []).filter((item) => Boolean(item && item.trim()));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Step Heading */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Baca Brief Dulu, Yuk!
        </h1>
        <p className="text-xs text-muted-foreground">
          Pahami arahan dan syarat kontennya biar video kamu langsung disetujui brand dan siap tembus FYP.
        </p>
      </div>

      {/* Unified Accordion Sections */}
      <Accordion type="multiple" defaultValue={['wajib']} className="space-y-2.5">
        {/* Section 1: Tentang Kampanye */}
        <AccordionItem
          value="tentang"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Tentang Kampanye
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed select-text">
              {campaign.description?.trim() ||
                'Kampanye ini mengajak kreator video clipping buat mempromosikan materi brand dengan gaya yang autentik dan menarik.'}
            </p>

            {(brief?.purpose || brief?.impression) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-border/40">
                {brief.purpose && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Tujuan Kampanye
                    </span>
                    <p className="text-xs text-foreground leading-relaxed select-text">{brief.purpose}</p>
                  </div>
                )}
                {brief.impression && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Kesan & Mood Konten
                    </span>
                    <p className="text-xs text-foreground leading-relaxed select-text">{brief.impression}</p>
                  </div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Section 2: Wajib Ada di Video Kamu */}
        <AccordionItem
          value="wajib"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Wajib Ada di Video Kamu
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">
            {/* Clean structured content with hairline dividers instead of heavy nested cards */}
            <div className="divide-y divide-border/30 pt-0.5">
              {!brief?.callToAction &&
                !brief?.keyMessage &&
                !brief?.guidelines &&
                !brief?.requiredCaption && (
                  <p className="text-xs text-muted-foreground italic py-2">
                    Tidak ada ketentuan wajib khusus untuk kampanye ini.
                  </p>
                )}

              {/* CTA */}
              {brief?.callToAction && (
                <div className="py-2.5 first:pt-0 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Call to Action (CTA)
                  </span>
                  <p className="text-xs text-foreground leading-relaxed font-medium select-all cursor-text">
                    {brief.callToAction}
                  </p>
                </div>
              )}

              {/* Pesan Utama */}
              {brief?.keyMessage && (
                <div className="py-2.5 first:pt-0 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Pesan Utama (Key Message)
                  </span>
                  <p className="text-xs text-foreground leading-relaxed font-medium select-text cursor-text">
                    {brief.keyMessage}
                  </p>
                </div>
              )}

              {/* Arahan Kreatif / Hook */}
              {brief?.guidelines && (
                <div className="py-2.5 first:pt-0 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Arahan Kreatif & Rekomendasi Hook
                  </span>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-line select-text cursor-text">
                    {brief.guidelines}
                  </p>
                </div>
              )}

              {/* Caption Wajib preview */}
              {brief?.requiredCaption && (
                <div className="py-2.5 first:pt-0 space-y-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Caption Wajib
                  </span>
                  <p className="text-xs text-foreground leading-relaxed font-mono bg-muted/20 p-2.5 rounded-lg border border-border/40 whitespace-pre-wrap select-all cursor-text">
                    {brief.requiredCaption}
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 3: Narasi & Skrip */}
        <AccordionItem
          value="narasi"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Narasi & Skrip
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">
            {brief?.narration ? (
              <div className="space-y-2 pt-1">
                <span className="text-xs text-muted-foreground block">
                  Skrip narasi dari brand:
                </span>
                <div className="rounded-lg border border-border/40 bg-muted/20 p-3.5 select-text">
                  <p className="text-xs sm:text-sm text-foreground whitespace-pre-line leading-relaxed select-text cursor-text">
                    {brief.narration}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Brand membebaskan narasi video. Kamu bebas berkreasi pakai gaya khas kamu sendiri, asalkan pesan utama kampanye tetap tersampaikan dengan jelas.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Section 4: Caption, Hashtag & Mention */}
        <AccordionItem
          value="caption"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Caption, Hashtag & Mention
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-4">
            {/* Caption Wajib */}
            {brief?.requiredCaption ? (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Caption Wajib / Rekomendasi:
                </span>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/40 text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap select-all cursor-text">
                  {brief.requiredCaption}
                </div>
              </div>
            ) : null}

            {/* Mention Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Akun Tag / Mention Wajib:
              </span>
              {mentionTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 select-text">
                  {mentionTags.map((tag) => {
                    const cleanTag = tag.startsWith('@') ? tag : `@${tag}`;
                    return (
                      <Fragment key={tag}>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 border border-border/70 text-foreground select-all cursor-text">
                          {cleanTag}
                        </span>{' '}
                      </Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Tidak ada akun mention khusus.</p>
              )}
            </div>

            {/* Hashtags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Hashtag Wajib:
              </span>
              {hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 select-text">
                  {hashtags.map((tag) => {
                    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
                    return (
                      <Fragment key={tag}>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 border border-border/70 text-foreground select-all cursor-text">
                          {cleanTag}
                        </span>{' '}
                      </Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Tidak ada hashtag khusus.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 5: Aturan Konten (Do's & Don'ts) */}
        <AccordionItem
          value="aturan"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Aturan Konten (Do&apos;s &amp; Don&apos;ts)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Dos */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3.5" />
                  <span>Hal yang Dianjurkan (Do&apos;s)</span>
                </div>
                {dos.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-foreground/90 leading-relaxed select-text">
                    {dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Gunakan footage berkualitas tinggi, audio jernih, dan visual yang menarik.
                  </p>
                )}
              </div>

              {/* Donts */}
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                  <X className="size-3.5" />
                  <span>Hal yang Dilarang (Don&apos;ts)</span>
                </div>
                {donts.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-foreground/90 leading-relaxed select-text">
                    {donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Dilarang memakai audio berhak cipta tanpa izin atau melanggar pedoman komunitas TikTok.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section 6: Materi Clipping */}
        <AccordionItem
          value="materi"
          className="rounded-xl border border-border/60 bg-card/60 overflow-hidden transition-all shadow-2xs last:border-b">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/15 hover:no-underline rounded-xl transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                Materi Clipping
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/40 space-y-3">
            {activeMaterials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-muted/20 hover:border-border transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/40">
                        {ResolveMaterialIcon(mat.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-medium text-foreground truncate select-text" title={mat.name}>
                          {mat.name}
                        </span>
                        <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                          {mat.type}
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 gap-1 text-xs border-border/60">
                      <a href={mat.url} target="_blank" rel="noopener noreferrer">
                        <span>Buka Aset</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pt-1">
                Belum ada berkas materi clipping yang diunggah oleh brand.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Mandatory Agreement Checkbox */}
      <div className="pt-2">
        <label
          htmlFor="brief-agreement-checkbox"
          className={cn(
            'flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer select-none',
            hasAgreed
              ? 'border-border/80 bg-muted/30 shadow-2xs'
              : 'border-border/50 bg-muted/10 hover:bg-muted/20',
          )}>
          <input
            id="brief-agreement-checkbox"
            type="checkbox"
            checked={hasAgreed}
            onChange={onToggleAgreed}
            className="size-4 rounded border-border accent-foreground text-foreground focus:ring-foreground mt-0.5 cursor-pointer shrink-0"
          />
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground block">
              Saya sudah membaca dan siap mengikuti seluruh brief kampanye ini
            </span>
            <span className="text-[11px] text-muted-foreground block leading-relaxed">
              Pastikan videomu mengikuti arahan narasi, hashtag, dan ketentuan di atas biar langsung disetujui brand.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
