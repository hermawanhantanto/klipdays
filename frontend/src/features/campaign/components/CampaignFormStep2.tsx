import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb, Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { GetWizardStepPath } from '../config/wizard-steps';
import { UseCampaignWizardContext, UseEditCampaignMutation } from '../hooks';
import { materialsFormSchema, type MaterialsFormValues } from '../schemas';
import { GetInitialMaterials } from '../utils';
import { MaterialFieldGroup } from './MaterialFieldGroup';
import { WizardFormActions } from './WizardFormActions';

/**
 * Materials and assets form component for Step 2 of the campaign creation wizard.
 * Enables brands to add, edit, and remove material items (video, image, document, link)
 * that creators will utilize to produce clip submissions.
 * Connects directly to the campaign edit mutation and manages its own submission lifecycle.
 *
 * @returns The rendered materials and assets form element.
 */
export function CampaignFormStep2() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { campaign } = UseCampaignWizardContext();

  const editMutation = UseEditCampaignMutation(id, {
    successMessage: 'Materi & aset berhasil disimpan.',
  });

  const initialMaterials = useMemo(() => GetInitialMaterials(campaign), [campaign]);

  const form = useForm<MaterialsFormValues>({
    resolver: zodResolver(materialsFormSchema),
    defaultValues: {
      materials: initialMaterials,
    },
    values: {
      materials: initialMaterials,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'materials',
  });

  /**
   * Appends a new empty material field group to the form.
   */
  function HandleAddMaterial() {
    append([
      {
        name: '',
        type: 'VIDEO',
        url: '',
      },
    ]);
  }

  /**
   * Removes a material field group at the specified array index.
   *
   * @param index - Zero-based index of the item to remove.
   */
  function HandleRemoveMaterial(index: number) {
    remove(index);
  }

  /**
   * Navigates back to Step 1 (Informasi Dasar).
   */
  function HandleBack() {
    const targetPath = GetWizardStepPath('step-1', id);
    navigate(targetPath);
  }

  /**
   * Handles form submission and dispatches to the edit campaign mutation.
   *
   * @param values - Validated materials form field values.
   */
  function HandleFormSubmit(values: MaterialsFormValues) {
    if (!id) {
      toast.error('ID Kampanye tidak valid. Mengarahkan ke daftar kampanye...', {
        id: 'missing-campaign-id',
      });
      navigate('/dashboard/campaigns');
      return;
    }

    if (editMutation.isPending) {
      return;
    }

    editMutation.mutate({ materials: values.materials });
  }

  const isPending = editMutation.isPending || form.formState.isSubmitting;
  const rootError = form.formState.errors.materials?.root?.message;

  return (
    <form noValidate onSubmit={form.handleSubmit(HandleFormSubmit)} className="space-y-6">
      {/* Information Helper Box */}
      <div className="flex items-start gap-3.5 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 sm:p-5 text-sm">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500 dark:text-orange-400">
          <Lightbulb className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-sm">Panduan Materi & Aset Promosi</p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Sediakan materi yang dibutuhkan kreator seperti video mentah (footage), foto produk beresolusi tinggi, logo brand, atau tautan penyimpanan cloud.
          </p>
          <p className="text-xs text-muted-foreground/90 leading-relaxed pt-0.5">
            <strong className="text-orange-600 dark:text-orange-400 font-semibold">Tips:</strong> Jika menggunakan Google Drive atau Dropbox, pastikan izin akses tautan telah diatur ke <span className="underline underline-offset-2">"Siapa saja yang memiliki tautan dapat melihat"</span> agar kreator dapat langsung mengunduh aset.
          </p>
        </div>
      </div>

      {/* Dynamic Materials Field Groups */}
      <div className="space-y-4">
        {fields.map((fieldItem, index) => {
          const canRemove = fields.length > 1;

          return (
            <MaterialFieldGroup
              key={fieldItem.id}
              index={index}
              control={form.control}
              canRemove={canRemove}
              onRemove={HandleRemoveMaterial}
              disabled={isPending}
            />
          );
        })}
      </div>

      {/* Root Array Error if Present */}
      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}

      {/* Add New Material Button */}
      <Button
        type="button"
        variant="outline"
        onClick={HandleAddMaterial}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 border-dashed border-2 py-5 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
        <Plus className="size-4" />
        <span className="font-medium text-sm">Tambah Materi & Aset Promosi</span>
      </Button>

      {/* Navigation and Submission Actions */}
      <WizardFormActions onBack={HandleBack} isPending={isPending} />
    </form>
  );
}
