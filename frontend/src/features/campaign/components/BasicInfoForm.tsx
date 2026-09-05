import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  basicInfoSchema,
  type BasicInfoFormValues,
  CAMPAIGN_CATEGORY_LABELS,
  CAMPAIGN_CATEGORY_OPTIONS,
  type CampaignCategoryOption,
  CAMPAIGN_PLATFORM_LABELS,
  CAMPAIGN_PLATFORM_OPTIONS,
  type CampaignPlatformOption,
  CAMPAIGN_TYPE_LABELS,
  CAMPAIGN_TYPE_OPTIONS,
  type CampaignTypeOption,
} from '../schemas';
import type { BasicInfoFormProps } from '../types';

/**
 * Basic info form component for Step 1 of the campaign creation wizard.
 * Captures title, description, category, type, platform, thumbnail URL, and main media URL.
 *
 * @param props - Component properties including initialData, onSubmit, isPending, and isLoading.
 * @returns The rendered basic info form element.
 */
export function BasicInfoForm({
  initialData,
  onSubmit,
  isPending: propIsPending,
  isLoading: propIsLoading,
  isSubmitting: propIsSubmitting,
}: BasicInfoFormProps) {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      campaignType: (initialData?.campaignType as CampaignTypeOption) ?? 'PRODUCT',
      campaignCategory: (initialData?.campaignCategory as CampaignCategoryOption) ?? 'BEAUTY_SKINCARE',
      thumbnailUrl: initialData?.thumbnailUrl ?? '',
      platform: 'TIKTOK',
      mainMediaUrl: initialData?.mainMediaUrl ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        campaignType: (initialData.campaignType as CampaignTypeOption) ?? 'PRODUCT',
        campaignCategory: (initialData.campaignCategory as CampaignCategoryOption) ?? 'BEAUTY_SKINCARE',
        thumbnailUrl: initialData.thumbnailUrl ?? '',
        platform: 'TIKTOK',
        mainMediaUrl: initialData.mainMediaUrl ?? '',
      });
    }
  }, [initialData, form]);

  /**
   * Handles valid form submission.
   *
   * @param values - Validated form field values.
   */
  function HandleFormSubmit(values: BasicInfoFormValues) {
    onSubmit(values);
  }

  const isPending = Boolean(propIsPending ?? propIsLoading ?? propIsSubmitting ?? form.formState.isSubmitting);

  return (
    <form noValidate onSubmit={form.handleSubmit(HandleFormSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Campaign Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Judul Kampanye</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Contoh: Peluncuran Serum Wajah Glowing 30 Hari"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldDescription>Berikan judul yang jelas dan menarik untuk memikat para kreator video (clippers).</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Campaign Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Deskripsi Kampanye</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={4}
                placeholder="Jelaskan mengenai produk atau layanan Anda, tujuan kampanye, serta nilai utama yang perlu ditonjolkan..."
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldDescription>Ringkasan tentang produk/layanan dan apa yang ingin dicapai melalui kampanye ini.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Grid for Campaign Type and Category */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Campaign Type */}
          <Controller
            name="campaignType"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedTypeLabel = field.value ? CAMPAIGN_TYPE_LABELS[field.value as CampaignTypeOption] : undefined;

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tipe Kampanye</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                      <SelectValue placeholder="Pilih tipe kampanye">{selectedTypeLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {CAMPAIGN_TYPE_OPTIONS.map((typeOption) => {
                        const label = CAMPAIGN_TYPE_LABELS[typeOption];
                        return (
                          <SelectItem key={typeOption} value={typeOption}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Jenis produk atau jasa yang dipromosikan.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />

          {/* Campaign Category */}
          <Controller
            name="campaignCategory"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedCategoryLabel = field.value ? CAMPAIGN_CATEGORY_LABELS[field.value as CampaignCategoryOption] : undefined;

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kategori Produk</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
                      <SelectValue placeholder="Pilih kategori produk">{selectedCategoryLabel}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {CAMPAIGN_CATEGORY_OPTIONS.map((catOption) => {
                        const label = CAMPAIGN_CATEGORY_LABELS[catOption];
                        return (
                          <SelectItem key={catOption} value={catOption}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Kategori yang sesuai untuk pengelompokan kampanye.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </div>

        {/* Platform Selection */}
        <Controller
          name="platform"
          control={form.control}
          render={({ field, fieldState }) => {
            const selectedPlatformLabel = field.value ? CAMPAIGN_PLATFORM_LABELS[field.value as CampaignPlatformOption] : undefined;

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Platform Promosi</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full bg-muted/40 cursor-not-allowed">
                    <SelectValue placeholder="Pilih platform">{selectedPlatformLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CAMPAIGN_PLATFORM_OPTIONS.map((platformOption) => {
                      const label = CAMPAIGN_PLATFORM_LABELS[platformOption];
                      return (
                        <SelectItem key={platformOption} value={platformOption}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FieldDescription>Saat ini Klipday memprioritaskan promosi video pendek pada platform TikTok.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        {/* Main Media URL */}
        <Controller
          name="mainMediaUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tautan Media Utama</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="url"
                placeholder="https://toko.com/produk-serum atau https://tiktok.com/@brand/video/..."
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldDescription>
                Tautan ke halaman produk resmi, etalase toko online, atau video referensi utama produk Anda.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Thumbnail URL with Informational Note */}
        <Controller
          name="thumbnailUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>URL Gambar Thumbnail</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="url"
                placeholder="https://images.unsplash.com/... atau https://cdn.brand.com/banner.jpg"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />

              {/* Note callout for manual URL input */}
              <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>
                  <strong>Catatan:</strong> Fitur unggah file langsung ke cloud storage akan segera hadir. Untuk sementara, silakan masukkan
                  URL gambar thumbnail secara langsung dari CDN, website, atau layanan image hosting Anda.
                </span>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Form Submission Action */}
      <div className="flex justify-end pt-4 border-t">
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
