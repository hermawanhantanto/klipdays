import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Coins,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { GetWizardStepPath } from '../config/wizard-steps';
import {
  CAMPAIGN_CATEGORY_LABELS,
  type CampaignCategoryOption,
  CAMPAIGN_PLATFORM_LABELS,
  type CampaignPlatformOption,
  CAMPAIGN_TYPE_LABELS,
  type CampaignTypeOption,
  MATERIAL_TYPE_LABELS,
  type MaterialTypeOption,
} from '../schemas';
import type { ReviewSummaryProps, WizardStepSlug } from '../types';
import {
  CalculateCampaignProjections,
  FormatDateRange,
  FormatNumber,
  FormatRupiah,
  ValidateCampaignCompleteness,
} from '../utils';

/**
 * Review and submission component for Step 5 of the campaign creation wizard.
 * Presents a complete multi-section summary of all configured campaign details,
 * flags incomplete requirements with quick jump links, and facilitates final submission confirmation.
 *
 * @param props - Component properties including campaign data, onSubmit, onBack, and isPending.
 * @returns The rendered review summary container.
 */
export function ReviewSummary({ campaign, onSubmit, onBack, isPending }: ReviewSummaryProps) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const completeness = ValidateCampaignCompleteness(campaign);
  const activeMaterials = campaign.materials?.filter((m) => m.status !== 'DELETED') ?? [];
  const brief = campaign.brief;

  const projections = CalculateCampaignProjections({
    cpm: campaign.cpm != null ? Number(campaign.cpm) : 0,
    budget: campaign.budget != null ? Number(campaign.budget) : 0,
    minViews: campaign.minViews != null ? Number(campaign.minViews) : 0,
    maxViews: campaign.maxViews != null ? Number(campaign.maxViews) : 0,
    startDate: campaign.startDate ?? undefined,
    endDate: campaign.endDate ?? undefined,
  });

  /**
   * Navigates directly to a specific wizard step for quick editing.
   *
   * @param stepSlug - The wizard step slug to jump to.
   */
  function HandleNavigateToStep(stepSlug: WizardStepSlug) {
    const targetPath = GetWizardStepPath(stepSlug, campaign.id);
    navigate(targetPath);
  }

  /**
   * Confirms and triggers the final campaign submission mutation.
   */
  function HandleConfirmSubmit() {
    setIsConfirmOpen(false);
    onSubmit();
  }

  const categoryLabel = campaign.campaignCategory
    ? CAMPAIGN_CATEGORY_LABELS[campaign.campaignCategory as CampaignCategoryOption] ?? campaign.campaignCategory
    : '-';

  const typeLabel = campaign.campaignType
    ? CAMPAIGN_TYPE_LABELS[campaign.campaignType as CampaignTypeOption] ?? campaign.campaignType
    : '-';

  const platformLabel = campaign.platform
    ? CAMPAIGN_PLATFORM_LABELS[campaign.platform as CampaignPlatformOption] ?? campaign.platform
    : 'TikTok';

  const dateRangeDisplay = FormatDateRange(campaign.startDate, campaign.endDate);

  return (
    <div className="space-y-8">
      {/* COMPLETENESS WARNING BANNER */}
      {!completeness.isComplete && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive">Kampanye Belum Siap Diajukan</h4>
              <p className="text-xs text-muted-foreground">
                Terdapat beberapa langkah yang belum lengkap. Harap lengkapi sebelum mengajukan kampanye untuk direview.
              </p>
              <ul className="space-y-1.5 pt-1">
                {completeness.missingSteps.map((step) => (
                  <li key={step.slug} className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-foreground">
                      <strong className="font-medium">Langkah {step.stepNumber} ({step.title}):</strong> {step.reason}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => HandleNavigateToStep(step.slug)}
                      className="h-7 text-xs"
                    >
                      Lengkapi
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: Informasi Dasar */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">1. Informasi Dasar Kampanye</CardTitle>
              <CardDescription>Detail identitas dan kategorisasi produk/layanan</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => HandleNavigateToStep('step-1')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {campaign.thumbnailUrl ? (
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
                <img
                  src={campaign.thumbnailUrl}
                  alt={campaign.title ?? 'Thumbnail'}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">{campaign.title || 'Belum ada judul'}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 dark:text-orange-300">
                    {categoryLabel}
                  </span>
                  <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {typeLabel}
                  </span>
                  <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {platformLabel}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {campaign.description || 'Belum ada deskripsi kampanye.'}
              </p>

              {campaign.mainMediaUrl ? (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Tautan Media Utama:</span>
                  <a
                    href={campaign.mainMediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Buka Tautan <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Materi & Aset Promosi */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">2. Materi & Aset Promosi</CardTitle>
              <CardDescription>{activeMaterials.length} aset disediakan untuk kreator</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => HandleNavigateToStep('step-2')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah
          </Button>
        </CardHeader>
        <CardContent className="pt-1">
          {activeMaterials.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Belum ada materi atau aset yang diunggah.</p>
          ) : (
            <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-background/50">
              {activeMaterials.map((material, idx) => {
                const label = MATERIAL_TYPE_LABELS[material.type as MaterialTypeOption] ?? material.type;
                return (
                  <div key={material.id ?? idx} className="flex items-center justify-between p-3.5 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground">
                        {label}
                      </span>
                      <span className="font-medium text-foreground truncate">{material.name}</span>
                    </div>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-4 inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                    >
                      Buka Aset <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: Brief & Panduan */}
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
            onClick={() => HandleNavigateToStep('step-3')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah
          </Button>
        </CardHeader>
        <CardContent className="space-y-5 pt-1 text-sm">
          {brief ? (
            <>
              {/* Purpose & Message Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Tujuan Kampanye</span>
                  <p className="text-foreground">{brief.purpose || '-'}</p>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Pesan Utama (Key Message)</span>
                  <p className="text-foreground">{brief.keyMessage || '-'}</p>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Call to Action (CTA)</span>
                  <p className="text-foreground">{brief.callToAction || '-'}</p>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Kesan & Mood Konten</span>
                  <p className="text-foreground">{brief.impression || '-'}</p>
                </div>
              </div>

              {/* TikTok Rules */}
              {(brief.requiredCaption || (brief.hashtags && brief.hashtags.length > 0) || (brief.mentionTags && brief.mentionTags.length > 0)) && (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ketentuan Postingan TikTok
                  </span>

                  {brief.requiredCaption && (
                    <div>
                      <span className="text-xs text-muted-foreground">Caption Wajib:</span>
                      <p className="mt-0.5 rounded-md border border-border/40 bg-background/80 p-2.5 text-xs text-foreground font-mono">
                        {brief.requiredCaption}
                      </p>
                    </div>
                  )}

                  {brief.hashtags && brief.hashtags.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Tagar Wajib:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {brief.hashtags.map((tag) => (
                          <span key={tag} className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400 dark:text-orange-300">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {brief.mentionTags && brief.mentionTags.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Akun Wajib Mention:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {brief.mentionTags.map((account) => (
                          <span key={account} className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-foreground font-medium">
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
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    Hal yang Dianjurkan (Do&apos;s)
                  </div>
                  {brief.dos && brief.dos.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-foreground">
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
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                    <X className="h-4 w-4" />
                    Hal yang Dilarang (Don&apos;ts)
                  </div>
                  {brief.donts && brief.donts.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-foreground">
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
              {(brief.narration || brief.guidelines) && (
                <div className="space-y-3 pt-1">
                  {brief.narration && (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground">Referensi Hook & Narasi</span>
                      <p className="text-xs text-foreground whitespace-pre-line">{brief.narration}</p>
                    </div>
                  )}

                  {brief.guidelines && (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground">Panduan Tambahan Lainnya</span>
                      <p className="text-xs text-foreground whitespace-pre-line">{brief.guidelines}</p>
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

      {/* SECTION 4: Hadiah & Anggaran */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">4. Hadiah & Anggaran Escrow</CardTitle>
              <CardDescription>Tarif per tayangan, alokasi dana, serta jadwal tayang</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => HandleNavigateToStep('step-4')}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-1">
          {/* Key Metric Numbers */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Tarif CPM</span>
              <p className="text-lg font-bold text-foreground">
                {FormatRupiah(campaign.cpm != null ? Number(campaign.cpm) : null)}
              </p>
              <span className="text-[11px] text-muted-foreground">per 1.000 views</span>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Total Anggaran (Escrow)</span>
              <p className="text-lg font-bold text-foreground">
                {FormatRupiah(campaign.budget != null ? Number(campaign.budget) : null)}
              </p>
              <span className="text-[11px] text-muted-foreground">dana yang dialokasikan</span>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Ambang Min. Tayangan</span>
              <p className="text-lg font-bold text-foreground">
                {FormatNumber(campaign.minViews)}
              </p>
              <span className="text-[11px] text-muted-foreground">views sebelum menghasilkan</span>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/60 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Batas Maks. per Video</span>
              <p className="text-lg font-bold text-foreground">
                {FormatNumber(campaign.maxViews)}
              </p>
              <span className="text-[11px] text-muted-foreground">earning cap per video</span>
            </div>
          </div>

          {/* Schedule & Projections Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Periode & Jadwal Kampanye
              </div>
              <p className="text-base font-medium text-foreground">{dateRangeDisplay}</p>
              <p className="text-xs text-muted-foreground">
                Durasi aktif: <span className="font-semibold text-foreground">{projections.durationDays} hari</span>
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Potensi Jangkauan (Estimasi)
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estimasi Total Views:</span>
                <span className="font-bold text-foreground">{FormatNumber(projections.totalEstimatedViews)} views</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Maks. Imbalan per Video:</span>
                <span className="font-bold text-foreground">{FormatRupiah(projections.maxEarningsPerVideo)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Kapasitas Video Penuh:</span>
                <span className="font-medium text-foreground">~{projections.minFundedVideos} video</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESCROW GUARANTEE NOTICE */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4.5 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div className="space-y-1">
          <p className="font-medium text-emerald-400">Proses Review & Keamanan Dana</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Setelah Anda menekan tombol submit, tim admin Klipday akan mereview kampanye Anda (SLA maks. 1x24 jam).
            Setelah disetujui, dana escrow akan dikunci dari saldo Anda. Seluruh sisa anggaran yang tidak terserap
            oleh tayangan kreator akan dikembalikan otomatis saat kampanye selesai.
          </p>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Hadiah & Anggaran
        </Button>

        {/* SUBMIT CONFIRMATION ALERT DIALOG */}
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              disabled={isPending || !completeness.isComplete}
              className="gap-2 font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengajukan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Ajukan Kampanye untuk Review
                </>
              )}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Pengajuan Kampanye</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin seluruh rincian kampanye sudah sesuai? Status kampanye akan berubah menjadi{' '}
                <strong className="text-foreground">IN REVIEW</strong> dan diteruskan ke tim kurasi Klipday.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Periksa Kembali</AlertDialogCancel>
              <AlertDialogAction
                onClick={HandleConfirmSubmit}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ya, Ajukan Sekarang'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
