import { useState } from 'react';
import { Check, Lock, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UseConnectedSocialAccountQuery } from '../hooks';
import type {
  CreatorSocialAccount,
  SocialPlatform,
  SocialPlatformRowProps,
  SubmissionStep2AccountDialogProps,
} from '../types';
import { FormatCompactCount } from '../utils/submission-utils';
import { SocialAccountConnectDialog } from './SocialAccountConnectDialog';
import { RenderPlatformLogo } from './SocialPlatformIcons';

const PLATFORMS: ReadonlyArray<{ id: SocialPlatform; name: string }> = [
  { id: 'TIKTOK', name: 'TikTok' },
  { id: 'INSTAGRAM', name: 'Instagram' },
  { id: 'YOUTUBE', name: 'YouTube' },
];

/**
 * Individual social media platform card row.
 * Handles three visual states:
 * 1. Unsupported platform: Disabled, muted, locked icon.
 * 2. Supported & connected account: Highlighted border, user avatar/handle, follower count, "Ganti Akun" action.
 * 3. Supported & unconnected account: Clean prompt with "+ Hubungkan Akun" button.
 *
 * @param props - Platform info, connectivity status, account details, and callback triggers.
 * @returns Rendered platform row element.
 */
function SocialPlatformRow({
  platformId,
  platformName,
  isSupported,
  connectedAccount,
  onConnect,
  onSwitchAccount,
  className,
}: SocialPlatformRowProps) {
  // Case 1: Platform is not supported for this campaign
  if (!isSupported) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-xl border border-border/40 opacity-60 bg-muted/15 cursor-not-allowed select-none transition-opacity',
          className,
        )}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-10 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-center shrink-0 text-muted-foreground">
            {RenderPlatformLogo(platformId, 'size-5 opacity-50')}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="text-sm font-semibold text-foreground/75 tracking-tight truncate">
              {platformName}
            </h4>
            <p className="text-xs text-muted-foreground">
              Tidak tersedia untuk campaign ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-3 shrink-0">
          <Lock className="size-4 text-muted-foreground" aria-label="Terkunci" />
        </div>
      </div>
    );
  }

  const hasConnectedAccount = Boolean(
    connectedAccount?.isVerified &&
      (connectedAccount.platform || 'TIKTOK').toUpperCase() === platformId.toUpperCase(),
  );

  // Case 2: Platform supported and creator has a verified connected account
  if (hasConnectedAccount && connectedAccount) {
    return (
      <div
        className={cn(
          'rounded-xl border border-foreground/25 bg-muted/20 hover:border-foreground/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all',
          className,
        )}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative size-11 shrink-0">
            <Avatar className="size-11 border border-border/80 bg-muted">
              {connectedAccount.avatarUrl ? (
                <AvatarImage
                  src={connectedAccount.avatarUrl}
                  alt={connectedAccount.username}
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="font-bold text-xs text-foreground bg-muted">
                {connectedAccount.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-background border border-border/80 flex items-center justify-center p-0.5 shadow-xs">
              {RenderPlatformLogo(platformId, 'size-2.5')}
            </div>
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground tracking-tight">
                {platformName}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                1 Akun terhubung
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-medium text-foreground/90">@{connectedAccount.username}</span>
              {' • '}
              <span>{FormatCompactCount(connectedAccount.followersCount)} Pengikut</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwitchAccount}
            className="h-8 text-xs font-medium rounded-lg hover:bg-muted/80">
            Ganti Akun
          </Button>

          <div
            className="size-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-xs"
            aria-label="Akun terpilih">
            <Check className="size-3.5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Platform supported but no verified account connected yet
  return (
    <div
      onClick={onConnect}
      className={cn(
        'rounded-xl border border-border/70 bg-card hover:border-foreground/30 hover:bg-muted/10 transition-colors p-4 flex items-center justify-between gap-3 cursor-pointer group',
        className,
      )}>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-10 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-center shrink-0 text-foreground group-hover:border-foreground/20 transition-colors">
          {RenderPlatformLogo(platformId, 'size-5')}
        </div>
        <div className="min-w-0 space-y-0.5">
          <h4 className="text-sm font-semibold text-foreground tracking-tight">
            {platformName}
          </h4>
          <p className="text-xs text-muted-foreground">
            Belum ada akun terhubung
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onConnect();
        }}
        className="h-8 text-xs font-medium gap-1 rounded-lg shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="size-3.5" />
        <span>Hubungkan Akun</span>
      </Button>
    </div>
  );
}

/**
 * Step 2 dialog orchestrator: "Pilih Social Media".
 * Displays platform options (TikTok, Instagram, YouTube) with active campaign constraints,
 * connection status cards, and seamless linkage via SocialAccountConnectDialog.
 *
 * @param props - Step 2 properties containing campaignId, campaign, connectedAccount, and callbacks.
 * @returns Rendered social media selection dialog step.
 */
export function SubmissionStep2AccountDialog({
  campaign,
  campaignPlatform,
  connectedAccount: propAccount,
  onAccountVerified,
  className,
}: SubmissionStep2AccountDialogProps) {
  const { data: queriedAccount, refetch: refetchAccount } = UseConnectedSocialAccountQuery();
  const connectedAccount = queriedAccount ?? propAccount ?? null;

  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [targetConnectPlatform, setTargetConnectPlatform] = useState<SocialPlatform>('TIKTOK');

  const activePlatform = (campaign?.platform || campaignPlatform || 'TIKTOK').toUpperCase();

  /**
   * Opens the social media connect and verification dialog for the requested platform.
   *
   * @param platformId - Selected social platform enum.
   */
  const HandleOpenConnectDialog = (platformId: SocialPlatform) => {
    setTargetConnectPlatform(platformId);
    setIsConnectDialogOpen(true);
  };

  /**
   * Propagates verified account callback to parent dialog and refreshes local account state.
   *
   * @param verified - Verified creator social account.
   */
  const HandleAccountVerified = async (verified: CreatorSocialAccount) => {
    await refetchAccount();
    onAccountVerified?.(verified);
    setIsConnectDialogOpen(false);
  };

  return (
    <div className={cn('space-y-5', className)}>
      {/* Step Heading */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Pilih Social Media
        </h1>
        <p className="text-xs text-muted-foreground">
          Silakan pilih salah satu social media di bawah ini
        </p>
      </div>

      {/* Multi-Platform Card Rows */}
      <div className="space-y-3 pt-1">
        {PLATFORMS.map((platform) => {
          const isSupported = platform.id.toUpperCase() === activePlatform;

          return (
            <SocialPlatformRow
              key={platform.id}
              platformId={platform.id}
              platformName={platform.name}
              isSupported={isSupported}
              connectedAccount={connectedAccount}
              onConnect={() => HandleOpenConnectDialog(platform.id)}
              onSwitchAccount={() => HandleOpenConnectDialog(platform.id)}
            />
          );
        })}
      </div>

      {/* Bottom context notice */}
      <p className="text-[11px] text-muted-foreground italic pt-2">
        Hanya media sosial yang sesuai dengan ketentuan kampanye yang dapat dipilih untuk pengajuan video.
      </p>

      {/* Dedicated Connect & Bio Verification Modal Dialog */}
      <SocialAccountConnectDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        platform={targetConnectPlatform}
        connectedAccount={connectedAccount}
        onAccountVerified={HandleAccountVerified}
      />
    </div>
  );
}
