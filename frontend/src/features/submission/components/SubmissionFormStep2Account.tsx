import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, CheckCircle2, Copy, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  UseConnectedSocialAccountQuery,
  UseRequestTikTokVerificationCodeMutation,
  UseVerifyTikTokBioMutation,
} from '../hooks';
import type { SubmissionFormStep2AccountProps } from '../types';
import { FormatCompactCount, FormatTimerSeconds } from '../utils/submission-utils';

/**
 * Step 2 component: TikTok Account Linkage & Bio Verification.
 * Automatically skips or shows connected account card if creator is already verified.
 * Otherwise conducts the one-time KD-XXXX handshake with a 10m expiry and 60s cooldown timer.
 *
 * @param props - Component props containing campaign ID and initial connected account state.
 * @returns Rendered account connection and verification step.
 */
export function SubmissionFormStep2Account({
  campaignId,
  className,
}: SubmissionFormStep2AccountProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: connectedAccount, refetch: refetchAccount } = UseConnectedSocialAccountQuery();
  const requestCodeMutation = UseRequestTikTokVerificationCodeMutation();
  const verifyBioMutation = UseVerifyTikTokBioMutation();

  const [typedUsername, setTypedUsername] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [targetExpiresAt, setTargetExpiresAt] = useState<number | null>(null);
  const [cooldownTarget, setCooldownTarget] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);

  const usernameInput = typedUsername !== null ? typedUsername : (connectedAccount?.username ?? '');
  const activeCode =
    generatedCode ?? (!connectedAccount?.isVerified ? connectedAccount?.verificationCode ?? null : null);

  const effectiveExpiresAt =
    targetExpiresAt ??
    (connectedAccount?.verificationExpiresAt
      ? new Date(connectedAccount.verificationExpiresAt).getTime()
      : null);

  const isTimerActive =
    (effectiveExpiresAt !== null && effectiveExpiresAt > now) ||
    (cooldownTarget !== null && cooldownTarget > now);

  useEffect(() => {
    if (!isTimerActive) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const expirySeconds = effectiveExpiresAt ? Math.max(0, Math.floor((effectiveExpiresAt - now) / 1000)) : 0;
  const cooldownSeconds = cooldownTarget ? Math.max(0, Math.floor((cooldownTarget - now) / 1000)) : 0;

  const HandleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.replace(/^@/, '').trim();
    if (!cleanUsername) {
      toast.error('Harap masukkan username akun kamu.');
      return;
    }

    const isSameAsConnected =
      connectedAccount != null &&
      Boolean(connectedAccount.isVerified || connectedAccount.verifiedAt) &&
      connectedAccount.username.toLowerCase() === cleanUsername.toLowerCase();

    if (isSameAsConnected && connectedAccount) {
      toast.info(`Akun @${connectedAccount.username} sudah terhubung.`);
      setIsSwitchingAccount(false);
      return;
    }

    try {
      const response = await requestCodeMutation.mutateAsync({ username: cleanUsername });

      if (response.alreadyVerified && response.account) {
        queryClient.setQueryData(['connected-social-account'], response.account);
        await queryClient.invalidateQueries({ queryKey: ['connected-social-account'] });
        await queryClient.invalidateQueries({ queryKey: ['recent-tiktok-videos'] });
        toast.success(`Akun @${response.account.username} berhasil diaktifkan kembali!`);
        return;
      }

      if (response.code) {
        setGeneratedCode(response.code);
        setTargetExpiresAt(Date.now() + 10 * 60 * 1000);
        setCooldownTarget(Date.now() + 60 * 1000);
        setNow(Date.now());
        toast.success(`Kode verifikasi dibuat: ${response.code}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal meminta kode verifikasi.';
      toast.error(errorMsg);
    }
  };

  const HandleCopyCode = async () => {
    if (!activeCode) return;
    await navigator.clipboard.writeText(activeCode);
    setHasCopiedCode(true);
    toast.info('Kode verifikasi disalin ke clipboard.');
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  const HandleCheckVerification = async () => {
    const cleanUsername = usernameInput.replace(/^@/, '').trim();
    if (!cleanUsername) return;

    try {
      await verifyBioMutation.mutateAsync({ username: cleanUsername });
      setIsVerificationSuccess(true);
      setGeneratedCode(null);
      setTargetExpiresAt(null);
      setCooldownTarget(null);
      await refetchAccount();
      toast.success('Akun berhasil terhubung dan terverifikasi!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Kode verifikasi belum terdeteksi di bio.';
      toast.error(errorMsg);
    }
  };

  const HandleProceedToStep3 = () => {
    navigate(`/campaigns/${campaignId}/submit/step-3`);
  };

  const isAlreadyVerified = Boolean(connectedAccount?.isVerified) && !isSwitchingAccount;

  return (
    <div className={cn('space-y-6', className)}>
      {/* State A: Already Verified Account */}
      {isAlreadyVerified && connectedAccount && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Akun Terhubung
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
                <span>Terverifikasi</span>
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <Avatar className="size-12 border border-border/60 bg-muted shrink-0">
                {connectedAccount.avatarUrl ? (
                  <AvatarImage
                    src={connectedAccount.avatarUrl}
                    alt={connectedAccount.username}
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="font-bold text-foreground">
                  {connectedAccount.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">
                    @{connectedAccount.username}
                  </span>
                  <a
                    href={
                      connectedAccount.platform === 'TIKTOK'
                        ? `https://www.tiktok.com/@${connectedAccount.username}`
                        : `https://www.instagram.com/${connectedAccount.username}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                    title="Buka profil">
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  {FormatCompactCount(connectedAccount.followersCount)} Pengikut
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSwitchingAccount(true)}
              className="text-xs text-muted-foreground hover:text-foreground">
              Gunakan Akun Lain
            </Button>

            <Button
              type="button"
              size="default"
              onClick={HandleProceedToStep3}
              className="gap-2 font-medium px-5 rounded-xl">
              <span>Lanjut ke Pilih Video</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* State B: Connect & Verify Account */}
      {(!isAlreadyVerified || isSwitchingAccount) && (
        <div className="space-y-6">
          {/* Post-verification success banner */}
          {isVerificationSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                <CheckCircle2 className="size-4" />
                <span>Verifikasi Berhasil!</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Akun kamu kini telah tersambung. Kamu sudah boleh menghapus kode verifikasi dari bio profil kamu.
              </p>
              <div className="pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={HandleProceedToStep3}
                  className="gap-2 font-medium rounded-xl">
                  <span>Lanjut ke Pilih Video</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {!isVerificationSuccess && (
            <div className="space-y-5">
              {/* Username Input Form */}
              <form onSubmit={HandleRequestCode} className="space-y-2">
                <Label htmlFor="social-username" className="text-xs font-medium text-foreground">
                  Username Akun
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium select-none">
                      @
                    </span>
                    <Input
                      id="social-username"
                      type="text"
                      placeholder="username_kamu"
                      value={usernameInput}
                      onChange={(e) => setTypedUsername(e.target.value)}
                      disabled={requestCodeMutation.isPending || Boolean(activeCode)}
                      className="pl-7 h-10 rounded-xl text-sm"
                    />
                  </div>

                  {!activeCode && (
                    <Button
                      type="submit"
                      disabled={requestCodeMutation.isPending || !usernameInput.trim()}
                      className="h-10 rounded-xl px-4 text-xs font-medium shrink-0">
                      {requestCodeMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        'Dapatkan Kode'
                      )}
                    </Button>
                  )}

                  {activeCode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setGeneratedCode(null);
                        setTargetExpiresAt(null);
                        setCooldownTarget(null);
                      }}
                      className="h-10 rounded-xl px-3 text-xs gap-1.5 text-muted-foreground">
                      <RefreshCw className="size-3.5" />
                      <span>Ganti</span>
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Pastikan akun bersifat publik agar sistem dapat memverifikasi video kamu.
                </p>
              </form>

              {/* Active Verification Code Box (Neutralized) */}
              {activeCode && (
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Verifikasi Bio Profil
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {FormatTimerSeconds(expirySeconds)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tempelkan kode berikut ke bio profil kamu (<span className="text-foreground font-medium">Edit Profil &gt; Bio</span>), lalu simpan dan klik periksa di bawah.
                  </p>

                  {/* Code display pill */}
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

                  {/* Verification Check Action */}
                  <div className="pt-1">
                    <Button
                      type="button"
                      size="default"
                      disabled={cooldownSeconds > 0 || verifyBioMutation.isPending}
                      onClick={HandleCheckVerification}
                      className="w-full h-10 rounded-xl text-xs font-medium gap-2">
                      {verifyBioMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Memeriksa Bio Profil...</span>
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
                  </div>
                </div>
              )}
            </div>
          )}

          {isSwitchingAccount && (
            <div className="flex justify-start">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSwitchingAccount(false)}
                className="text-xs text-muted-foreground">
                Batal ganti akun
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
