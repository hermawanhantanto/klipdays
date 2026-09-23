import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SubmissionWizardHeaderProps } from '../types';

/**
 * Header banner for the submission wizard with back navigation and campaign title.
 *
 * @param props - Header props containing campaign title and optional className.
 * @returns Rendered header element.
 */
export function SubmissionWizardHeader({
  campaignTitle,
  campaignId,
  className,
}: SubmissionWizardHeaderProps) {
  const navigate = useNavigate();

  const HandleBackClick = () => {
    if (campaignId) {
      navigate(`/campaigns/${campaignId}`);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/creator-dashboard/creator-campaigns');
    }
  };

  return (
    <div className={cn('flex items-center justify-between gap-4 border-b border-border/40 pb-4', className)}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={HandleBackClick}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg px-2">
          <ArrowLeft className="size-3.5" />
          <span>Kembali</span>
        </Button>

        <div className="h-4 w-px bg-border/60" />

        <div className="min-w-0">
          <h2 className="text-sm font-medium tracking-tight text-foreground truncate">
            {campaignTitle || 'Pengajuan Video Kampanye'}
          </h2>
        </div>
      </div>
    </div>
  );
}
