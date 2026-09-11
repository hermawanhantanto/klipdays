import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Coins, Eye, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { rewardSchema, type RewardFormValues } from '../schemas';
import type { RewardFormProps } from '../types';
import { CalculateCampaignProjections, FormatDateForInput, FormatNumber, FormatRupiah, GetInitialReward } from '../utils';
import { WizardFormActions } from './WizardFormActions';

const CPM_PRESETS = [5000, 10000, 15000, 25000];
const BUDGET_PRESETS = [1000000, 2500000, 5000000, 10000000];

/**
 * Reward and budget form component for Step 4 of the campaign creation wizard.
 * Enables brands to configure CPM pricing, views thresholds, escrow budget, and active dates,
 * with real-time projections and calculation summaries.
 *
 * @param props - Component properties including initialData, onSubmit, onBack, and isPending.
 * @returns The rendered reward and budget form element.
 */
export function RewardForm({
  initialData,
  onSubmit,
  onBack,
  isPending: propIsPending,
  isLoading: propIsLoading,
  isSubmitting: propIsSubmitting,
}: RewardFormProps) {
  const initialValues = GetInitialReward(initialData);

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (initialData) {
      const refreshedValues = GetInitialReward(initialData);
      form.reset(refreshedValues);
    }
  }, [initialData, form]);

  const watchedValues = form.watch();
  const projections = CalculateCampaignProjections(watchedValues);

  /**
   * Handles valid form submission.
   *
   * @param values - Validated form field values.
   */
  function HandleFormSubmit(values: RewardFormValues) {
    onSubmit(values);
  }

  /**
   * Updates the CPM field with a chosen preset value.
   *
   * @param preset - The selected preset CPM amount in IDR.
   */
  function HandleSetCpmPreset(preset: number) {
    form.setValue('cpm', preset, { shouldValidate: true, shouldDirty: true });
  }

  /**
   * Updates the budget field with a chosen preset value.
   *
   * @param preset - The selected preset budget amount in IDR.
   */
  function HandleSetBudgetPreset(preset: number) {
    form.setValue('budget', preset, { shouldValidate: true, shouldDirty: true });
  }

  const isPending = Boolean(propIsPending ?? propIsLoading ?? propIsSubmitting ?? form.formState.isSubmitting);
  const todayDateString = FormatDateForInput(new Date());

  return (
    <form noValidate onSubmit={form.handleSubmit(HandleFormSubmit)} className="space-y-8">
      {/* SECTION 1: Hadiah & Ambang Tayangan (Reward System) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Sistem Hadiah Kreator (CPM)</h3>
          </div>
          <p className="text-sm text-muted-foreground">Tentukan imbalan yang didapatkan kreator setiap 1.000 penayangan terverifikasi.</p>
        </div>

        <FieldGroup>
          {/* CPM Field */}
          <Controller
            name="cpm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tarif CPM (per 1.000 Tayangan)</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min="1"
                    step="1000"
                    placeholder="Contoh: 10000"
                    className="pl-10 text-base"
                    disabled={isPending}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Pilihan Cepat:</span>
                  {CPM_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={isPending}
                      onClick={() => HandleSetCpmPreset(preset)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        Number(field.value) === preset
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-400 dark:text-orange-300'
                          : 'border-border bg-background text-muted-foreground hover:border-orange-500/30 hover:text-foreground'
                      }`}>
                      {FormatRupiah(preset)}
                    </button>
                  ))}
                </div>

                <FieldDescription>
                  Nominal rupiah yang diberikan untuk setiap 1.000 tayangan video yang lolos verifikasi sistem.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Min Views & Max Views Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Min Views */}
            <Controller
              name="minViews"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Penayangan Minimum (Min Views)</FieldLabel>
                  <div className="relative">
                    <Eye className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min="1"
                      placeholder="Contoh: 1000"
                      className="pl-9"
                      disabled={isPending}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(val);
                      }}
                    />
                  </div>
                  <FieldDescription>
                    Ambang batas tayangan agar video mulai menghasilkan imbalan. Video di bawah batas ini menghasilkan Rp 0.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Max Views */}
            <Controller
              name="maxViews"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Batas Tayangan Maksimum (Max Views)</FieldLabel>
                  <div className="relative">
                    <TrendingUp className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min="1"
                      placeholder="Contoh: 50000"
                      className="pl-9"
                      disabled={isPending}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(val);
                      }}
                    />
                  </div>
                  <FieldDescription>
                    Batas atas penayangan yang dibayarkan per satu video. Penayangan setelah batas ini tidak menambah bayaran.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      <hr className="border-border" />

      {/* SECTION 2: Anggaran Escrow & Jadwal Kampanye */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Total Anggaran & Jadwal</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tentukan batas dana escrow yang dialokasikan dan rentang waktu berjalannya kampanye.
          </p>
        </div>

        <FieldGroup>
          {/* Total Budget */}
          <Controller
            name="budget"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Total Anggaran Kampanye (Escrow)</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min="1"
                    step="100000"
                    placeholder="Contoh: 5000000"
                    className="pl-10 text-base"
                    disabled={isPending}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </div>

                {/* Preset Chips for Budget */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Pilihan Cepat:</span>
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={isPending}
                      onClick={() => HandleSetBudgetPreset(preset)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        Number(field.value) === preset
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-400 dark:text-orange-300'
                          : 'border-border bg-background text-muted-foreground hover:border-orange-500/30 hover:text-foreground'
                      }`}>
                      {FormatRupiah(preset)}
                    </button>
                  ))}
                </div>

                <FieldDescription>
                  Total dana yang disiapkan untuk kampanye ini. Kampanye otomatis selesai jika anggaran habis terdistribusi.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Dates Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Start Date */}
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tanggal Mulai</FieldLabel>
                  <Input {...field} id={field.name} type="date" min={todayDateString} disabled={isPending} />
                  <FieldDescription>Kreator dapat mulai mengunggah draft sejak tanggal ini.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* End Date */}
            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tanggal Selesai (Batas Akhir)</FieldLabel>
                  <Input {...field} id={field.name} type="date" min={watchedValues.startDate || todayDateString} disabled={isPending} />
                  <FieldDescription>Penayangan video berhenti dihitung setelah tanggal ini tercapai.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>

        {/* Escrow Guarantee Info Callout */}
        <div className="flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div className="space-y-1">
            <p className="font-medium text-emerald-400">Perlindungan Dana Escrow Klipday</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Anggaran dikunci aman di akun escrow Anda. Anda hanya membayar untuk penayangan nyata yang berhasil terverifikasi. Sisa
              anggaran yang tidak terpakai saat kampanye selesai akan otomatis dikembalikan ke saldo dompet brand Anda.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Live Projections & Estimation Card */}
      <Card className="border-border/60 bg-muted/30">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Estimasi Performa & ROI Kampanye</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Total Estimated Views */}
            <div className="space-y-1 rounded-md border border-border/50 bg-background/60 p-3">
              <span className="text-xs text-muted-foreground">Estimasi Total Penayangan</span>
              <p className="text-lg font-bold text-foreground">{FormatNumber(projections.totalEstimatedViews)}</p>
              <span className="text-[11px] text-muted-foreground">potensi views dari budget</span>
            </div>

            {/* Max Earnings per Video */}
            <div className="space-y-1 rounded-md border border-border/50 bg-background/60 p-3">
              <span className="text-xs text-muted-foreground">Maks. Imbalan per Video</span>
              <p className="text-lg font-bold text-foreground">{FormatRupiah(projections.maxEarningsPerVideo)}</p>
              <span className="text-[11px] text-muted-foreground">cap jika tembus max views</span>
            </div>

            {/* Capacity of Full Viral Videos */}
            <div className="space-y-1 rounded-md border border-border/50 bg-background/60 p-3">
              <span className="text-xs text-muted-foreground">Kapasitas Video Maksimal</span>
              <p className="text-lg font-bold text-foreground">
                {projections.minFundedVideos > 0 ? `~${projections.minFundedVideos} video` : '-'}
              </p>
              <span className="text-[11px] text-muted-foreground">video terdanai hingga batas atas</span>
            </div>

            {/* Campaign Duration */}
            <div className="space-y-1 rounded-md border border-border/50 bg-background/60 p-3">
              <span className="text-xs text-muted-foreground">Durasi Kampanye</span>
              <p className="text-lg font-bold text-foreground">{projections.durationDays > 0 ? `${projections.durationDays} hari` : '-'}</p>
              <span className="text-[11px] text-muted-foreground">periode tayang & verifikasi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <WizardFormActions onBack={onBack} isPending={isPending} />
    </form>
  );
}
