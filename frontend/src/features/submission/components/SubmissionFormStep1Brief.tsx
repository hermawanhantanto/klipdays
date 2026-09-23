import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SubmissionFormStep1BriefProps } from '../types';

/**
 * Step 1 component: Creative Brief & Compliance Guidelines.
 * Presents required hashtags, mention tags, dos & don'ts, and narrative guidance.
 * Requires user agreement before advancing to account verification.
 *
 * @param props - Component props containing campaign brief data.
 * @returns Rendered brief checklist and agreement form.
 */
export function SubmissionFormStep1Brief({
  campaign,
  className,
}: SubmissionFormStep1BriefProps) {
  const navigate = useNavigate();
  const [hasAgreed, setHasAgreed] = useState(false);

  const brief = campaign.brief;
  const mentionTags = brief?.mentionTags || [];
  const hashtags = brief?.hashtags || [];
  const dos = brief?.dos || [];
  const donts = brief?.donts || [];
  const hasDosOrDonts = dos.length > 0 || donts.length > 0;

  const HandleContinue = () => {
    if (!hasAgreed) return;
    navigate(`/campaigns/${campaign.id}/submit/step-2`);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mandatory Tags & Mentions */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-semibold text-foreground tracking-tight">
          Wajib Ada di Caption Video
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Mention Tags */}
          <div className="space-y-2.5">
            <span className="block text-xs font-medium text-muted-foreground">Akun Wajib Tag / Mention:</span>
            {mentionTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {mentionTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-foreground border border-border/70 shadow-2xs">
                    {tag.startsWith('@') ? tag : `@${tag}`}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pt-1">Tidak ada tag mention khusus.</p>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2.5">
            <span className="block text-xs font-medium text-muted-foreground">Hashtag Wajib:</span>
            {hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-foreground border border-border/70 shadow-2xs">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pt-1">Tidak ada hashtag wajib khusus.</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Message & CTA */}
      {(brief?.keyMessage || brief?.callToAction) && (
        <div className="space-y-2 border-t border-border/40 pt-4 text-xs">
          <h3 className="text-xs font-semibold text-foreground tracking-tight">
            Pesan & Arahan Konten
          </h3>

          <div className="space-y-2">
            {brief.keyMessage && (
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Pesan Utama: </span>
                {brief.keyMessage}
              </p>
            )}
            {brief.callToAction && (
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Call To Action (CTA): </span>
                {brief.callToAction}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Do's & Don'ts */}
      {hasDosOrDonts && (
        <div className="border-t border-border/40 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Dos */}
            <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
                <span>Hal yang Dianjurkan (Do&apos;s)</span>
              </div>
              {dos.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-foreground leading-relaxed">
                  {dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">Tidak ada anjuran khusus.</p>
              )}
            </div>

            {/* Donts */}
            <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <X className="size-3.5" />
                <span>Hal yang Dilarang (Don&apos;ts)</span>
              </div>
              {donts.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-foreground leading-relaxed">
                  {donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">Tidak ada larangan khusus.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agreement Checkbox */}
      <div className="border-t border-border/40 pt-4">
        <label
          htmlFor="agreement-checkbox"
          className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id="agreement-checkbox"
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="size-4 rounded border-border text-primary focus:ring-primary mt-0.5 cursor-pointer"
          />
          <span className="text-xs text-foreground font-normal leading-relaxed">
            Saya telah membaca dan mematuhi seluruh panduan kreatif serta ketentuan kampanye ini.
          </span>
        </label>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          size="default"
          onClick={HandleContinue}
          disabled={!hasAgreed}
          className="gap-2 font-medium px-5 rounded-xl">
          <span>Lanjut ke Tautkan Akun</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
