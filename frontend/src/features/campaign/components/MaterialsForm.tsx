import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { materialsFormSchema, type MaterialsFormValues } from '../schemas';
import type { MaterialsFormProps } from '../types';
import { DEFAULT_EMPTY_MATERIAL, GetInitialMaterials } from '../utils';
import { MaterialFieldGroup } from './MaterialFieldGroup';

/**
 * Materials and assets form component for Step 2 of the campaign creation wizard.
 * Enables brands to add, edit, and remove material items (video, image, document, link)
 * that creators will utilize to produce clip submissions.
 *
 * @param props - Component properties including initialData, onSubmit, onBack, and pending states.
 * @returns The rendered materials and assets form element.
 */
export function MaterialsForm({
  initialData,
  onSubmit,
  isPending: propIsPending,
  isLoading: propIsLoading,
  isSubmitting: propIsSubmitting,
  onBack,
}: MaterialsFormProps) {
  const initialMaterials = GetInitialMaterials(initialData);

  const form = useForm<MaterialsFormValues>({
    resolver: zodResolver(materialsFormSchema),
    defaultValues: {
      materials: initialMaterials,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'materials',
  });

  useEffect(() => {
    if (initialData?.materials && initialData.materials.length > 0) {
      const active = GetInitialMaterials(initialData);
      form.reset({ materials: active });
    }
  }, [initialData, form]);

  /**
   * Appends a new empty material field group to the form.
   */
  function HandleAddMaterial() {
    append({ ...DEFAULT_EMPTY_MATERIAL });
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
   * Dispatches validated form values to the parent submit handler.
   *
   * @param values - Validated materials form field values.
   */
  function HandleFormSubmit(values: MaterialsFormValues) {
    onSubmit(values);
  }

  const isPending = Boolean(propIsPending ?? propIsLoading ?? propIsSubmitting ?? form.formState.isSubmitting);
  const rootError = form.formState.errors.materials?.root?.message;

  return (
    <form noValidate onSubmit={form.handleSubmit(HandleFormSubmit)} className="space-y-6">
      {/* Information Helper Box */}
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Panduan Materi & Aset Promosi</p>
        <p className="mt-1">
          Sediakan materi yang dibutuhkan kreator seperti video mentah (footage), foto produk berkualitas tinggi, logo brand, atau tautan
          Google Drive / Dropbox yang berisi aset pendukung.
        </p>
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
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={HandleAddMaterial}
          disabled={isPending}
          className="flex items-center gap-2 border-dashed hover:border-solid hover:bg-accent">
          <Plus className="size-4" />
          <span>Tambah Materi & Aset</span>
        </Button>
      </div>

      {/* Navigation and Submission Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isPending} className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            <span>Kembali</span>
          </Button>
        ) : (
          <div />
        )}

        <Button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 min-w-[180px]">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span>Simpan & Lanjutkan</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
