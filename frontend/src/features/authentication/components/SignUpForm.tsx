import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { type RegisterInput } from '../api'
import { UseRegisterMutation } from '../mutations'
import {
  INDUSTRY_OPTIONS,
  signUpSchema,
  type SignUpFormValues,
} from '../sign-up-schema'
import { RoleSlider } from './RoleSlider'

/**
 * Sign up form with animated role slider (Creator or Brand), role-specific dynamic fields,
 * select dropdown for industry, and robust phone validation. Submits to the backend register
 * endpoint via the `UseRegisterMutation` TanStack Query hook.
 *
 * @returns The sign up form component.
 */
export function SignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'CREATOR',
      email: '',
      password: '',
      fullName: '',
      companyName: '',
      phoneNumber: '',
      industry: '',
    },
  })

  const role = form.watch('role')
  const mutation = UseRegisterMutation()

  /**
   * Builds the register payload for the chosen role and submits it to the
   * register endpoint.
   *
   * @param values - Validated sign up form values.
   */
  function OnSubmit(values: SignUpFormValues) {
    const { role, email, password } = values

    const payload: RegisterInput =
      role === 'BRAND'
        ? {
            role,
            email,
            password,
            companyName: values.companyName,
            phoneNumber: values.phoneNumber,
            industry: values.industry,
          }
        : {
            role,
            email,
            password,
            fullName: values.fullName,
          }

    mutation.mutate(payload)
  }

  /**
   * Handles role change from the RoleSlider, updating the form value and
   * clearing field errors from the previous role selection.
   *
   * @param newRole - The newly selected role ('CREATOR' | 'BRAND').
   */
  function HandleRoleChange(newRole: 'CREATOR' | 'BRAND') {
    form.setValue('role', newRole)
    form.clearErrors()
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(OnSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <RoleSlider
              value={field.value}
              onChange={HandleRoleChange}
              disabled={mutation.isPending}
            />
          )}
        />
      </div>

      <FieldGroup>
        {role === 'CREATOR' ? (
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama lengkap</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contoh: Budi Santoso"
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                  disabled={mutation.isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ) : (
          <>
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nama perusahaan / brand</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Contoh: PT Maju Bersama"
                    aria-invalid={fieldState.invalid}
                    autoComplete="organization"
                    disabled={mutation.isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nomor telepon</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    aria-invalid={fieldState.invalid}
                    autoComplete="tel"
                    disabled={mutation.isPending}
                  />
                  <FieldDescription>Gunakan nomor aktif (WhatsApp).</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="industry"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bidang industri</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Pilih industri" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {INDUSTRY_OPTIONS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </>
        )}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="nama@email.com"
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                disabled={mutation.isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Kata sandi</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                disabled={mutation.isPending}
              />
              <FieldDescription>
                Minimal 8 karakter, kombinasi huruf kapital, angka, dan simbol.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Daftar'
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
