import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { UseLoginMutation } from '../hooks'
import { signInSchema, type SignInFormValues } from '../schemas'

/**
 * Sign in form allowing registered Creators and Brands to authenticate with email and password.
 * Submits to the backend login endpoint via the `UseLoginMutation` hook.
 *
 * @returns The sign in form component.
 */
export function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = UseLoginMutation()

  /**
   * Submits the sign in form credentials to the login mutation.
   *
   * @param values - Validated sign in form values containing email and password.
   */
  function OnSubmit(values: SignInFormValues) {
    mutation.mutate(values)
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(OnSubmit)} className="space-y-4">
      <FieldGroup>
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
                autoComplete="current-password"
                disabled={mutation.isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Masuk'
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}

