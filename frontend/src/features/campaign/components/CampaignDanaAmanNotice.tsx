import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CampaignDanaAmanNoticeProps } from '../types';

const NOTICE_DEFAULTS = {
  budget: {
    title: 'Sistem Dana Aman',
    description:
      'Anggaran disimpan secara aman oleh sistem. Anda hanya membayar untuk penayangan nyata yang berhasil terverifikasi. Sisa anggaran yang tidak terpakai saat kampanye selesai akan otomatis dikembalikan ke saldo dompet brand Anda.',
  },
  review: {
    title: 'Proses Review & Sistem Dana Aman',
    description:
      'Setelah Anda menekan tombol submit, tim admin Klipday akan mereview kampanye Anda (SLA maks. 1x24 jam). Setelah disetujui, dana akan disimpan secara aman melalui sistem dana aman dari saldo Anda. Seluruh sisa anggaran yang tidak terserap oleh tayangan kreator akan dikembalikan otomatis saat kampanye selesai.',
  },
} as const;

/**
 * Reusable contextual notice callout highlighting the Sistem Dana Aman guarantees.
 * Supports both Step 4 (budget configuration) and Step 5 (review & submission) contexts.
 *
 * @param props - Component properties including variant, custom title/description overrides, and className.
 * @returns The rendered Sistem Dana Aman callout banner element.
 */
export function CampaignDanaAmanNotice({
  variant = 'review',
  title,
  description,
  className,
}: CampaignDanaAmanNoticeProps) {
  const fallback = NOTICE_DEFAULTS[variant];
  const resolvedTitle = title ?? fallback.title;
  const resolvedDescription = description ?? fallback.description;

  const containerClasses = cn(
    'flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 sm:p-4.5 text-sm',
    className
  );

  return (
    <div className={containerClasses}>
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
      <div className="space-y-1">
        <p className="font-medium text-emerald-400">{resolvedTitle}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{resolvedDescription}</p>
      </div>
    </div>
  );
}

// Backwards-compatible export alias
export { CampaignDanaAmanNotice as CampaignReviewEscrowNotice };
