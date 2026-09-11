import { Check, MessageSquare, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampaignReviewBriefProps } from '../types';

/**
 * Section 3 review card: Displays creative brief, key messages, social rules, and dos & don'ts.
 *
 * @param props - Component properties containing campaign brief data and edit navigation handler.
 * @returns The rendered brief and guidelines review card element.
 */
export function CampaignReviewBrief({ brief, onEdit }: CampaignReviewBriefProps) {
  const hasSocialRules = Boolean(
    brief?.requiredCaption || (brief?.hashtags && brief.hashtags.length > 0) || (brief?.mentionTags && brief.mentionTags.length > 0)
  );

  const hasExtraGuidelines = Boolean(brief?.narration || brief?.guidelines);

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">3. Brief & Panduan Kreator</CardTitle>
            <CardDescription>Instruksi kreatif, pesan penting, dan batasan konten</CardDescription>
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

      <CardContent className="space-y-5 pt-1 text-sm">
        {brief ? (
          <>
            {/* Purpose & Message Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">Tujuan Kampanye</span>
                <p className="text-foreground">{brief.purpose || '-'}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">Pesan Utama (Key Message)</span>
                <p className="text-foreground">{brief.keyMessage || '-'}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">Call to Action (CTA)</span>
                <p className="text-foreground">{brief.callToAction || '-'}</p>
              </div>

              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground block">Kesan & Mood Konten</span>
                <p className="text-foreground">{brief.impression || '-'}</p>
              </div>
            </div>

            {/* Social Media Rules */}
            {hasSocialRules && (
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4.5 space-y-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Ketentuan Postingan Media Sosial
                </span>

                {brief.requiredCaption && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground block">Caption Wajib:</span>
                    <p className="rounded-md border border-border/40 bg-background/80 p-3 text-xs text-foreground font-mono leading-relaxed">
                      {brief.requiredCaption}
                    </p>
                  </div>
                )}

                {brief.hashtags && brief.hashtags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground block">Tagar Wajib:</span>
                    <div className="flex flex-wrap gap-2">
                      {brief.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 dark:text-orange-300">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {brief.mentionTags && brief.mentionTags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground block">Akun Wajib Mention:</span>
                    <div className="flex flex-wrap gap-2">
                      {brief.mentionTags.map((account) => (
                        <span
                          key={account}
                          className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground font-medium">
                          {account.startsWith('@') ? account : `@${account}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Dos */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  Hal yang Dianjurkan (Do&apos;s)
                </div>
                {brief.dos && brief.dos.length > 0 ? (
                  <ul className="space-y-2 text-xs text-foreground">
                    {brief.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Tidak ada anjuran khusus.</p>
                )}
              </div>

              {/* Donts */}
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                  <X className="h-4 w-4" />
                  Hal yang Dilarang (Don&apos;ts)
                </div>
                {brief.donts && brief.donts.length > 0 ? (
                  <ul className="space-y-2 text-xs text-foreground">
                    {brief.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Tidak ada larangan khusus.</p>
                )}
              </div>
            </div>

            {/* Narration & Guidelines */}
            {hasExtraGuidelines && (
              <div className="space-y-3.5 pt-1">
                {brief.narration && (
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block">Referensi Hook & Narasi</span>
                    <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">{brief.narration}</p>
                  </div>
                )}

                {brief.guidelines && (
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block">Panduan Tambahan Lainnya</span>
                    <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">{brief.guidelines}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">Brief kampanye belum dikonfigurasi.</p>
        )}
      </CardContent>
    </Card>
  );
}
