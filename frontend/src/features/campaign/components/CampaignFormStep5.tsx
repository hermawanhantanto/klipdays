import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
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
import { GetWizardStepPath } from '../config/wizard-steps';
import { UseCampaignWizardContext, UseSubmitCampaignMutation } from '../hooks';
import type { WizardStepSlug } from '../types';
import { CalculateCampaignProjections, ValidateCampaignCompleteness } from '../utils';
import { CampaignReviewBasicInfo } from './CampaignReviewBasicInfo';
import { CampaignReviewBrief } from './CampaignReviewBrief';
import { CampaignReviewCompletenessAlert } from './CampaignReviewCompletenessAlert';
import { CampaignDanaAmanNotice } from './CampaignDanaAmanNotice';
import { CampaignReviewMaterials } from './CampaignReviewMaterials';
import { CampaignReviewReward } from './CampaignReviewReward';

/**
 * Review and submission component for Step 5 of the campaign creation wizard.
 * Presents a complete multi-section summary of all configured campaign details,
 * flags incomplete requirements with quick-jump links, and coordinates final submission confirmation.
 * Connects directly to the submission mutation and manages its own lifecycle.
 *
 * @returns The rendered review and submit form element.
 */
export function CampaignFormStep5() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { campaign } = UseCampaignWizardContext();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const submitMutation = UseSubmitCampaignMutation(id);

  const completeness = ValidateCampaignCompleteness(campaign);
  const projections = CalculateCampaignProjections({
    cpm: campaign?.cpm != null ? Number(campaign.cpm) : 0,
    budget: campaign?.budget != null ? Number(campaign.budget) : 0,
    minViews: campaign?.minViews != null ? Number(campaign.minViews) : 0,
    maxViews: campaign?.maxViews != null ? Number(campaign.maxViews) : 0,
    startDate: campaign?.startDate ?? undefined,
    endDate: campaign?.endDate ?? undefined,
  });

  /**
   * Navigates directly to a specific wizard step for quick inline adjustments.
   *
   * @param stepSlug - The target wizard step slug to jump to.
   */
  function HandleNavigateToStep(stepSlug: WizardStepSlug) {
    if (!id) return;
    const targetPath = GetWizardStepPath(stepSlug, id);
    navigate(targetPath);
  }

  /**
   * Navigates back to Step 4 (Hadiah & Anggaran).
   */
  function HandleBack() {
    HandleNavigateToStep('step-4');
  }

  /**
   * Confirms and triggers the final campaign submission mutation to admin review.
   */
  function HandleConfirmSubmit() {
    if (!id || submitMutation.isPending) {
      return;
    }

    setIsConfirmOpen(false);
    submitMutation.mutate();
  }

  const isPending = submitMutation.isPending;

  if (!campaign) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* COMPLETENESS WARNING BANNER */}
      <CampaignReviewCompletenessAlert missingSteps={completeness.missingSteps} onNavigateToStep={HandleNavigateToStep} />

      {/* SECTION 1: Informasi Dasar */}
      <CampaignReviewBasicInfo campaign={campaign} onEdit={() => HandleNavigateToStep('step-1')} />

      {/* SECTION 2: Materi & Aset Promosi */}
      <CampaignReviewMaterials materials={campaign.materials} onEdit={() => HandleNavigateToStep('step-2')} />

      {/* SECTION 3: Brief & Panduan Kreator */}
      <CampaignReviewBrief brief={campaign.brief} onEdit={() => HandleNavigateToStep('step-3')} />

      {/* SECTION 4: Hadiah & Anggaran */}
      <CampaignReviewReward campaign={campaign} projections={projections} onEdit={() => HandleNavigateToStep('step-4')} />

      {/* SISTEM DANA AMAN NOTICE */}
      <CampaignDanaAmanNotice variant="review" />

      {/* ACTION FOOTER BAR */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button type="button" variant="outline" onClick={HandleBack} disabled={isPending} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Hadiah & Anggaran
        </Button>

        {/* SUBMIT CONFIRMATION ALERT DIALOG */}
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button" disabled={isPending || !completeness.isComplete} className="gap-2 font-semibold">
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
                <strong className="text-foreground">IN REVIEW</strong> dan diteruskan ke tim review Klipday.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Periksa Kembali</AlertDialogCancel>
              <AlertDialogAction onClick={HandleConfirmSubmit} disabled={isPending} className="gap-2">
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
