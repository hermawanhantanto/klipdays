import { Film, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CampaignDetailSubmissionsPlaceholderProps } from '../types';

/**
 * Placeholder view rendered when secondary tabs ("Video Kamu" or "Pengajuan Klip")
 * are selected in the campaign detail page.
 *
 * @param props - Component properties containing the userRole and activeTab identifier.
 * @returns The rendered tab placeholder element.
 */
export function CampaignDetailSubmissionsPlaceholder({
  userRole,
  activeTab,
  className,
}: CampaignDetailSubmissionsPlaceholderProps) {
  const isCreatorView = activeTab === 'my-videos' || userRole === 'CREATOR';

  return (
    <div
      className={cn(
        'flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center',
        className
      )}>
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
        {isCreatorView ? <Film className="size-6 text-primary" /> : <Inbox className="size-6 text-primary" />}
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">
          {isCreatorView ? 'Progres Video & Klip Kamu' : 'Daftar Pengajuan Klip Kreator'}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isCreatorView
            ? 'Setelah Anda bergabung dan mengunggah draf klip, status review, revisi, dan penghitungan estimasi tayangan akan dipantau di sini.'
            : 'Semua pengajuan draf klip video dari para kreator akan masuk ke tab ini untuk proses review dan persetujuan brand.'}
        </p>
      </div>
    </div>
  );
}
