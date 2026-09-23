import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, CheckCircle2, Copy, Loader2, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  UseConnectedSocialAccountQuery,
  UseRequestTikTokVerificationCodeMutation,
  UseVerifyTikTokBioMutation,
} from '../hooks';
import type {
  ConnectGuideStepItemProps,
  SocialAccountConnectDialogProps,
} from '../types';
import { FormatTimerSeconds } from '../utils/submission-utils';
import { RenderPlatformLogo } from './SocialPlatformIcons';

/**
 * Single step indicator in the bio verification guide infographic.
 *
 * @param props - Step number, title, description, and isLast flag.
 * @returns Rendered guide step row.
 */
function ConnectGuideStepItem({
  stepNumber,
  title,
  description,
  isLast = false,
}: ConnectGuideStepItemProps) {
  return (
    <div className="flex items-start gap-3.5 relative">
      {!isLast && (
        <div
          className="absolute left-3.5 top-7 bottom-0 w-px bg-border/60 -translate-x-1/2"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 size-7 shrink-0 rounded-full border border-border/80 bg-muted text-foreground font-semibold text-xs flex items-center justify-center shadow-2xs">
        {stepNumber}
      </div>
      <div className="min-w-0 space-y-0.5 pb-5">
        <h4 className="text-xs font-semibold text-foreground tracking-tight">{title}</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/**
 * Dedicated connect and verify modal dialog for creator social accounts.
 * Provides a structured 2-column layout:
 * - Left column: 4-step clear visual infographic guide explaining the bio code flow.
 * - Right column: Username input, code generation, active token card with copy & countdown,
 *   and CDN-cooled verification checker.
 *
 * @param props - Dialog open state, platform, verification callback, and styling.
 * @returns Rendered social account connect dialog modal.
 */
/**
 * Internal body and state controller for social account connection and bio verification.
 * Mounts freshly whenever the dialog is opened, guaranteeing clean initial state.
 *
 * @param props - Dialog open state, platform, verification callback, and styling.
 * @returns Rendered dialog modal content.
 */
function SocialAccountConnectDialogInner({
  open,
  onOpenChange,
  platform = 'TIKTOK',
  connectedAccount: propConnectedAccount,
  onAccountVerified,
  className,
}: SocialAccountConnectDialogProps) {
  const queryClient = useQueryClient();
  const { data: queriedAccount } = UseConnectedSocialAccountQuery();
  const effectiveAccount = queriedAccount ?? propConnectedAccount ?? null;

  const requestCodeMutation = UseRequestTikTokVerificationCodeMutation();
  const verifyBioMutation = UseVerifyTikTokBioMutation();

  const isTikTok = (platform || 'TIKTOK').toUpperCase() === 'TIKTOK';
  const platformDisplayName = isTikTok
    ? 'TikTok'
    : platform
      ? platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()
      : 'TikTok';

  // Initialize username from connected account or empty
  const [username, setUsername] = useState<string>(() => {
    return effectiveAccount?.username ?? '';
  });

  // Initialize active verification code if an unexpired pending code exists in database
  const [activeCode, setActiveCode] = useState<string | null>(() => {
    if (effectiveAccount && !effectiveAccount.isVerified && effectiveAccount.verificationCode) {
      const expTime = effectiveAccount.verificationExpiresAt
        ? new Date(effectiveAccount.verificationExpiresAt).getTime()
        : 0;
      if (expTime > Date.now()) {
        return effectiveAccount.verificationCode;
      }
    }
    return null;
  });

  // Initialize expiry timestamp if active code exists
  const [targetExpiresAt, setTargetExpiresAt] = useState<number | null>(() => {
    if (effectiveAccount && !effectiveAccount.isVerified && effectiveAccount.verificationExpiresAt) {
      const expTime = new Date(effectiveAccount.verificationExpiresAt).getTime();
      if (expTime > Date.now()) {
        return expTime;
      }
    }
    return null;
  });

  const [cooldownTarget, setCooldownTarget] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  const isTimerActive =
    (targetExpiresAt !== null && targetExpiresAt > now) ||
    (cooldownTarget !== null && cooldownTarget > now);

  useEffect(() => {
    if (!isTimerActive) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const expirySeconds = targetExpiresAt ? Math.max(0, Math.floor((targetExpiresAt - now) / 1000)) : 0;
  const cooldownSeconds = cooldownTarget ? Math.max(0, Math.floor((cooldownTarget - now) / 1000)) : 0;
  const isCodeExpired = Boolean(activeCode && targetExpiresAt && targetExpiresAt <= now);

  /**
   * Handles requesting a new bio verification token from backend API.
   * If the user enters the same username that is already connected and verified,
   * skips generating a new code, displays an informative toast, and closes the dialog.
   *
   * @param e - Form submission event.
   */
  const HandleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername) {
      toast.error(`Harap masukkan username ${platformDisplayName} kamu.`);
      return;
    }

    // Check if the entered username matches the currently connected verified account
    const isSameAsConnected =
      effectiveAccount !== null &&
      Boolean(effectiveAccount.isVerified || effectiveAccount.verifiedAt) &&
      effectiveAccount.username.toLowerCase() === cleanUsername.toLowerCase() &&
      (effectiveAccount.platform || 'TIKTOK').toUpperCase() === (platform || 'TIKTOK').toUpperCase();

    if (isSameAsConnected && effectiveAccount) {
      toast.info(`Akun @${effectiveAccount.username} sudah terhubung.`);
      onAccountVerified?.(effectiveAccount);
      onOpenChange(false);
      return;
    }

    try {
      const response = await requestCodeMutation.mutateAsync({ username: cleanUsername });

      if (response.alreadyVerified && response.account) {
        queryClient.setQueryData(['connected-social-account'], response.account);
        await queryClient.invalidateQueries({ queryKey: ['connected-social-account'] });
        await queryClient.invalidateQueries({ queryKey: ['recent-tiktok-videos'] });
        toast.success(`Akun @${response.account.username} berhasil diaktifkan kembali!`);
        onAccountVerified?.(response.account);
        onOpenChange(false);
        return;
      }

      if (response.code) {
        setActiveCode(response.code);
        setTargetExpiresAt(Date.now() + 10 * 60 * 1000);
        setCooldownTarget(Date.now() + 60 * 1000);
        setNow(Date.now());
        toast.success(`Kode verifikasi berhasil dibuat: ${response.code}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal meminta kode verifikasi.';
      toast.error(errorMsg);
    }
  };

  /**
   * Copies the active verification code to user's system clipboard with feedback.
   */
  const HandleCopyCode = async () => {
    if (!activeCode) return;
    try {
      await navigator.clipboard.writeText(activeCode);
      setHasCopiedCode(true);
      toast.info('Kode verifikasi disalin ke clipboard.');
      setTimeout(() => setHasCopiedCode(false), 2000);
    } catch {
      toast.error('Gagal menyalin kode ke clipboard.');
    }
  };

  /**
   * Triggers scraper verification to confirm bio contains the active code token.
   */
  const HandleCheckVerification = async () => {
    const cleanUsername = username.replace(/^@/, '').trim();
    if (!cleanUsername) return;

    try {
      const verified = await verifyBioMutation.mutateAsync({ username: cleanUsername });
      queryClient.setQueryData(['connected-social-account'], verified);
      await queryClient.invalidateQueries({ queryKey: ['connected-social-account'] });
      toast.success(`Akun ${platformDisplayName} berhasil terhubung dan terverifikasi!`);
      onAccountVerified?.(verified);
      onOpenChange(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : `Kode verifikasi belum terdeteksi di bio ${platformDisplayName}.`;
      toast.error(errorMsg);
    }
  };

  /**
   * Clears the current active code and unlocks the username input to change handles.
   */
  const HandleResetCode = () => {
    setActiveCode(null);
    setTargetExpiresAt(null);
    setCooldownTarget(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-[95vw] sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] p-0 overflow-hidden rounded-2xl bg-card border border-border/70 shadow-2xl flex flex-col z-[60]',
          className,
        )}>
        {/* Modal Header */}
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/40 flex flex-row items-center justify-between shrink-0">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="size-5 shrink-0 flex items-center justify-center">
                {RenderPlatformLogo(platform, 'size-4')}
              </div>
              <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Tambahkan Akun {platformDisplayName}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Verifikasi akun kamu untuk memastikan video yang diajukan benar-benar milikmu.
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
              <X className="size-4" />
              <span className="sr-only">Tutup</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Modal 2-Column Split Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-border/40">
          {/* Left Column: 4-Step Visual Infographic Guide */}
          <div className="md:col-span-5 p-5 bg-muted/20 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-foreground tracking-tight">
                Panduan Verifikasi Bio
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Ikuti 4 langkah mudah berikut langsung di aplikasi {platformDisplayName}:
              </p>
            </div>

            <div className="pt-2">
              <ConnectGuideStepItem
                stepNumber={1}
                title={`Buka Profil ${platformDisplayName}`}
                description={`Buka aplikasi ${platformDisplayName} dan masuk ke halaman profil akun kamu.`}
              />
              <ConnectGuideStepItem
                stepNumber={2}
                title="Klik Edit Profil"
                description="Pilih opsi Edit Profil untuk membuka pengaturan bio akun."
              />
              <ConnectGuideStepItem
                stepNumber={3}
                title="Masukkan Kode di Bio"
                description="Salin kode verifikasi (contoh: KD-XXXX) dan tempelkan ke kolom Bio akun kamu, lalu simpan."
              />
              <ConnectGuideStepItem
                stepNumber={4}
                title="Hapus Kode Setelah Berhasil"
                description={`Setelah verifikasi berhasil, kamu dapat langsung menghapus kode tersebut dari bio ${platformDisplayName}.`}
                isLast
              />
            </div>
          </div>

          {/* Right Column: Verification Action Form */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            {!isTikTok ? (
              /* Non-TikTok Unsupported Notice */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                <div className="size-12 rounded-xl bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground">
                  {RenderPlatformLogo(platform, 'size-6')}
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-semibold text-foreground tracking-tight">
                    Integrasi {platformDisplayName} Segera Hadir
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Saat ini Klipday mendukung verifikasi bio otomatis untuk kampanye TikTok. Integrasi akun {platformDisplayName} sedang dalam proses pengembangan.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 text-xs rounded-lg mt-2">
                  Tutup
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Username Input Form */}
                <form onSubmit={HandleRequestCode} className="space-y-2">
                  <Label htmlFor="connect-account-username" className="text-xs font-semibold text-foreground">
                    Username Akun {platformDisplayName}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium select-none">
                        @
                      </span>
                      <Input
                        id="connect-account-username"
                        type="text"
                        placeholder={`username_${(platform || 'tiktok').toLowerCase()}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={requestCodeMutation.isPending || Boolean(activeCode && !isCodeExpired)}
                        className="pl-7 h-10 rounded-xl text-xs"
                      />
                    </div>

                    {(!activeCode || isCodeExpired) && (
                      <Button
                        type="submit"
                        disabled={requestCodeMutation.isPending || !username.trim()}
                        className="h-10 rounded-xl px-4 text-xs font-medium shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                        {requestCodeMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isCodeExpired ? (
                          'Minta Ulang'
                        ) : (
                          'Dapatkan Kode'
                        )}
                      </Button>
                    )}

                    {activeCode && !isCodeExpired && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={HandleResetCode}
                        className="h-10 rounded-xl px-3 text-xs gap-1.5 text-muted-foreground shrink-0">
                        <RefreshCw className="size-3.5" />
                        <span>Ganti</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Pastikan akun {platformDisplayName} kamu bersifat publik agar video dapat divalidasi sistem.
                  </p>
                </form>

                {/* Active Verification Code Box */}
                {activeCode && (
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        Kode Verifikasi Bio
                      </span>
                      <span
                        className={cn(
                          'text-[11px] font-mono',
                          isCodeExpired
                            ? 'text-destructive font-semibold'
                            : expirySeconds <= 60
                              ? 'text-amber-500 font-semibold'
                              : 'text-muted-foreground',
                        )}>
                        {isCodeExpired ? 'Kedaluwarsa' : FormatTimerSeconds(expirySeconds)}
                      </span>
                    </div>

                    {isCodeExpired ? (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-2 text-center">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Kode verifikasi telah kedaluwarsa
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Silakan klik &quot;Minta Ulang&quot; di atas untuk mendapatkan kode verifikasi baru.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Tempelkan kode di bawah ini ke bio profil akun {platformDisplayName} kamu, simpan profil, lalu klik tombol periksa verifikasi.
                        </p>

                        <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 bg-background">
                          <span className="font-mono text-base sm:text-lg font-bold tracking-widest text-foreground">
                            {activeCode}
                          </span>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={HandleCopyCode}
                            className="h-8 gap-1.5 text-xs rounded-lg">
                            {hasCopiedCode ? (
                              <>
                                <Check className="size-3.5 text-emerald-500" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" />
                                <span>Salin</span>
                              </>
                            )}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          size="default"
                          disabled={cooldownSeconds > 0 || verifyBioMutation.isPending}
                          onClick={HandleCheckVerification}
                          className="w-full h-10 rounded-xl text-xs font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                          {verifyBioMutation.isPending ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              <span>Memeriksa Bio {platformDisplayName}...</span>
                            </>
                          ) : cooldownSeconds > 0 ? (
                            <span>Tunggu sebentar ({cooldownSeconds}s)...</span>
                          ) : (
                            <>
                              <CheckCircle2 className="size-4" />
                              <span>Periksa Verifikasi Bio</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <p className="text-[11px] text-muted-foreground italic border-t border-border/30 pt-3">
              Setelah terverifikasi, akun kamu akan otomatis terhubung ke sistem Klipday.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dedicated connect and verify modal dialog for creator social accounts.
 * Provides a structured 2-column layout with 4-step infographic guide and bio-code verification form.
 * Mounts freshly on open to guarantee clean state synchronization.
 *
 * @param props - Dialog open state, platform, verification callback, and styling.
 * @returns Rendered social account connect dialog modal or null when closed.
 */
export function SocialAccountConnectDialog(props: SocialAccountConnectDialogProps) {
  if (!props.open) {
    return null;
  }

  return <SocialAccountConnectDialogInner {...props} />;
}

