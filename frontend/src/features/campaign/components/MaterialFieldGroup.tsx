import { Controller } from 'react-hook-form';
import { FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MATERIAL_TYPE_LABELS, MATERIAL_TYPE_OPTIONS, type MaterialTypeOption } from '../schemas';
import type { MaterialFieldGroupProps } from '../types';

/**
 * Renders a single field group for a campaign material and asset item.
 * Encapsulates input fields for material name, type selection, and external URL.
 *
 * @param props - Component properties for the material field item.
 * @returns The rendered material field group element.
 */
export function MaterialFieldGroup({ index, control, canRemove, onRemove, disabled = false }: MaterialFieldGroupProps) {
  /**
   * Dispatches removal of this specific material item.
   */
  function HandleRemove() {
    onRemove(index);
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-5 shadow-xs transition-colors space-y-4">
      {/* Group Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="size-4" />
          </div>
          <span className="font-semibold text-sm text-foreground">Materi & Aset #{index + 1}</span>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={HandleRemove}
            disabled={disabled}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs flex items-center gap-1.5">
            <Trash2 className="size-3.5" />
            <span>Hapus</span>
          </Button>
        )}
      </div>

      <FieldGroup>
        {/* Material Name */}
        <Controller
          name={`materials.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nama Materi / Aset</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Contoh: Video Footage Unboxing, Logo Brand, Panduan Produk"
                aria-invalid={fieldState.invalid}
                disabled={disabled}
              />
              <FieldDescription>Beri nama atau keterangan singkat mengenai materi yang disediakan.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Grid for Material Type and Material URL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Material Type */}
          <div className="sm:col-span-1">
            <Controller
              name={`materials.${index}.type`}
              control={control}
              render={({ field, fieldState }) => {
                const selectedTypeLabel = field.value ? MATERIAL_TYPE_LABELS[field.value as MaterialTypeOption] : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Tipe Materi</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                        <SelectValue placeholder="Pilih tipe materi">{selectedTypeLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {MATERIAL_TYPE_OPTIONS.map((typeOption) => {
                          const label = MATERIAL_TYPE_LABELS[typeOption];
                          return (
                            <SelectItem key={typeOption} value={typeOption}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          </div>

          {/* Material URL */}
          <div className="sm:col-span-2">
            <Controller
              name={`materials.${index}.url`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tautan / URL Materi</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="url"
                    placeholder="https://drive.google.com/..."
                    aria-invalid={fieldState.invalid}
                    disabled={disabled}
                  />
                  <FieldDescription>Tautan penyimpanan cloud publik (Google Drive, Dropbox, Figma, dll).</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}
