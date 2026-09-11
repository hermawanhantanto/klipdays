import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, FileText, Hash, MessageSquareQuote } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { briefSchema, type BriefFormValues } from '../schemas';
import type { BriefFormProps } from '../types';
import { GetInitialBrief } from '../utils';
import { BriefDynamicListField } from './BriefDynamicListField';
import { WizardFormActions } from './WizardFormActions';

/**
 * Brief & guidelines form component for Step 3 of the campaign creation wizard.
 * Captures campaign objective, key messages, call to action, TikTok caption/hashtag rules,
 * Do's & Don'ts content guidelines, and script instructions.
 *
 * @param props - Component properties including initialData, onSubmit, onBack, and pending states.
 * @returns The rendered brief form element.
 */
export function BriefForm({
  initialData,
  onSubmit,
  isPending: propIsPending,
  isLoading: propIsLoading,
  isSubmitting: propIsSubmitting,
  onBack,
}: BriefFormProps) {
  const initialBrief = GetInitialBrief(initialData);

  const form = useForm<BriefFormValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: initialBrief,
  });

  useEffect(() => {
    if (initialData?.brief && !form.formState.isDirty) {
      const active = GetInitialBrief(initialData);
      form.reset(active);
    }
  }, [initialData, form]);

  /**
   * Dispatches validated form values to the parent submit handler.
   *
   * @param values - Validated campaign brief form values.
   */
  function HandleFormSubmit(values: BriefFormValues) {
    onSubmit(values);
  }

  const isPending = Boolean(propIsPending ?? propIsLoading ?? propIsSubmitting ?? form.formState.isSubmitting);

  return (
    <form noValidate onSubmit={form.handleSubmit(HandleFormSubmit)} className="space-y-8">
      {/* Information Helper Box */}
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Panduan Kreatif & Instruksi Konten</p>
        <p className="mt-1">
          Brief ini menjadi acuan utama para kreator (clippers) dalam membuat video klip promosi.
          Berikan instruksi yang jelas agar konten yang dihasilkan sesuai dengan ekspektasi brand Anda.
        </p>
      </div>

      {/* Section 1: Core Direction (Tujuan & Pesan Utama) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="size-4" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Pesan Utama & Arahan Kreatif</h3>
        </div>

        <FieldGroup>
          {/* Campaign Purpose */}
          <Controller
            name="purpose"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tujuan Kampanye</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contoh: Meningkatkan awareness produk dan penjualan serum glowing 30 hari..."
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldDescription>Apa yang ingin dicapai melalui kampanye video kliping ini?</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Key Message */}
          <Controller
            name="keyMessage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Pesan Utama</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={3}
                  placeholder="Contoh: Formula baru dengan 2% Retinol murni yang lembut untuk kulit sensitif dan memberikan hasil dalam 14 hari..."
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldDescription>Poin keunggulan atau pesan inti yang wajib dipahami penonton.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Grid for CTA and Impression */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Call to Action */}
            <Controller
              name="callToAction"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Call to Action (CTA)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Contoh: Cek keranjang kuning sekarang untuk diskon 30%!"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldDescription>Aksi yang diharapkan dari penonton setelah menonton video.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Impression / Tone */}
            <Controller
              name="impression"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kesan / Mood Konten (Opsional)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Contoh: Review jujur (honest review), ceria, edukatif..."
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldDescription>Nuansa atau kesan emosional yang ingin ditonjolkan.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      {/* Section 2: Posting Guidelines on TikTok */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Hash className="size-4" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Panduan Postingan TikTok</h3>
        </div>

        <FieldGroup>
          {/* Required Caption */}
          <Controller
            name="requiredCaption"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Caption Wajib (Opsional)</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={2}
                  placeholder="Contoh: Solusi wajah kusam akhirnya ketemu! Jangan lupa cobain sekarang..."
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldDescription>Teks caption rekomendasi atau wajib yang perlu dicantumkan saat posting.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Grid for Hashtags and Mentions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Hashtags */}
            <Controller
              name="hashtags"
              control={form.control}
              render={({ field, fieldState }) => (
                <BriefDynamicListField
                  label="Tagar / Hashtags Wajib"
                  description="Tagar yang wajib disertakan kreator di TikTok."
                  placeholder="Contoh: skincare, glowing, racuntiktok"
                  prefix="#"
                  variant="pills"
                  items={field.value ?? []}
                  onAddItem={(newItem) => field.onChange([...(field.value ?? []), newItem])}
                  onRemoveItem={(indexToRemove) =>
                    field.onChange((field.value ?? []).filter((_, index) => index !== indexToRemove))
                  }
                  disabled={isPending}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Mention Tags */}
            <Controller
              name="mentionTags"
              control={form.control}
              render={({ field, fieldState }) => (
                <BriefDynamicListField
                  label="Akun Mention Wajib"
                  description="Akun resmi yang wajib di-tag atau di-mention."
                  placeholder="Contoh: klipday, brandofficial"
                  prefix="@"
                  variant="pills"
                  items={field.value ?? []}
                  onAddItem={(newItem) => field.onChange([...(field.value ?? []), newItem])}
                  onRemoveItem={(indexToRemove) =>
                    field.onChange((field.value ?? []).filter((_, index) => index !== indexToRemove))
                  }
                  disabled={isPending}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </FieldGroup>
      </div>

      {/* Section 3: Do's & Don'ts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <CheckCircle2 className="size-4" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Aturan Konten (Do's & Don'ts)</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Do's */}
          <Controller
            name="dos"
            control={form.control}
            render={({ field, fieldState }) => (
              <BriefDynamicListField
                label="Hal yang Dianjurkan (Do's)"
                description="Instruksi hal positif yang sebaiknya dilakukan kreator."
                placeholder="Contoh: Tampilkan produk di 3 detik pertama..."
                variant="rows"
                tone="positive"
                items={field.value ?? []}
                onAddItem={(newItem) => field.onChange([...(field.value ?? []), newItem])}
                onRemoveItem={(indexToRemove) =>
                  field.onChange((field.value ?? []).filter((_, index) => index !== indexToRemove))
                }
                disabled={isPending}
                error={fieldState.error?.message}
              />
            )}
          />

          {/* Don'ts */}
          <Controller
            name="donts"
            control={form.control}
            render={({ field, fieldState }) => (
              <BriefDynamicListField
                label="Hal yang Dilarang (Don'ts)"
                description="Hal yang dilarang keras dilakukan dalam video."
                placeholder="Contoh: Jangan bandingkan dengan merek kompetitor..."
                variant="rows"
                tone="negative"
                items={field.value ?? []}
                onAddItem={(newItem) => field.onChange([...(field.value ?? []), newItem])}
                onRemoveItem={(indexToRemove) =>
                  field.onChange((field.value ?? []).filter((_, index) => index !== indexToRemove))
                }
                disabled={isPending}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Section 4: Script Narration & Additional Guidelines */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <MessageSquareQuote className="size-4" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Narasi & Panduan Tambahan</h3>
        </div>

        <FieldGroup>
          {/* Narration Script Guidance */}
          <Controller
            name="narration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Referensi Narasi / Hook Pembuka (Opsional)</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={3}
                  placeholder="Contoh: 'Kalian yang kulitnya kering kerontang wajib nonton ini sampai habis...'"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldDescription>Contoh hook pembuka atau skrip narasi yang dapat digunakan kreator.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Freeform Guidelines */}
          <Controller
            name="guidelines"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Panduan Tambahan Lainnya (Opsional)</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={3}
                  placeholder="Catatan khusus lainnya terkait ketentuan video, resolusi, format kliping, dsb..."
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldDescription>Informasi penting lainnya yang perlu diketahui oleh clippers.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      {/* Navigation and Submission Actions */}
      <WizardFormActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
