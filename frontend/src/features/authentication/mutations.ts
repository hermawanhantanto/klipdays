import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import {
  LoginAccount,
  type LoggedInAccount,
  type LoginInput,
  RegisterAccount,
  type RegisteredAccount,
  type RegisterInput,
} from './api'

export type RegisterMutationOptions = Omit<
  UseMutationOptions<RegisteredAccount, Error, RegisterInput>,
  'mutationFn'
>

export type LoginMutationOptions = Omit<
  UseMutationOptions<LoggedInAccount, Error, LoginInput>,
  'mutationFn'
>

/**
 * Custom TanStack Query mutation hook for registering a new Creator or Brand account.
 * Automatically displays a success toast and redirects to the sign-in page upon success,
 * while supporting custom mutation callbacks if provided.
 *
 * @param options - Optional mutation options to override or extend behavior.
 * @returns The TanStack Query mutation object for registering accounts.
 */
export function UseRegisterMutation(
  options?: RegisterMutationOptions,
): UseMutationResult<RegisteredAccount, Error, RegisterInput> {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: RegisterAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      toast.success('Pendaftaran berhasil! Silakan masuk ke akun Anda.')
      navigate('/signin')
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}

/**
 * Custom TanStack Query mutation hook for logging into an existing account.
 * Automatically displays a success toast and redirects to the home/dashboard page upon success,
 * while supporting custom mutation callbacks if provided.
 *
 * @param options - Optional mutation options to override or extend behavior.
 * @returns The TanStack Query mutation object for logging in.
 */
export function UseLoginMutation(
  options?: LoginMutationOptions,
): UseMutationResult<LoggedInAccount, Error, LoginInput> {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: LoginAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      toast.success('Berhasil masuk!')
      navigate('/')
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}
