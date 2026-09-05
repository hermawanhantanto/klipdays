import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  LoginAccount,
  type LoggedInAccount,
  type LoginInput,
  LogoutAccount,
  RegisterAccount,
  type RegisteredAccount,
  type RegisterInput,
} from '../api';

export type RegisterMutationOptions = Omit<UseMutationOptions<RegisteredAccount, Error, RegisterInput>, 'mutationFn'>;

export type LoginMutationOptions = Omit<UseMutationOptions<LoggedInAccount, Error, LoginInput>, 'mutationFn'>;

export type LogoutMutationOptions = Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>;

/**
 * Custom TanStack Query mutation hook for registering a new Creator or Brand account.
 * Automatically displays a success toast and redirects to the sign-in page upon success,
 * while supporting custom mutation callbacks if provided.
 *
 * @param options - Optional mutation options to override or extend behavior.
 * @returns The TanStack Query mutation object for registering accounts.
 */
export function UseRegisterMutation(options?: RegisterMutationOptions): UseMutationResult<RegisteredAccount, Error, RegisterInput> {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: RegisterAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      toast.success('Pendaftaran berhasil! Silakan masuk ke akun Anda.');
      navigate('/signin');

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });

  return mutation;
}

/**
 * Custom TanStack Query mutation hook for logging into an existing account.
 * Automatically displays a success toast and redirects to the dashboard page upon success,
 * while supporting custom mutation callbacks if provided.
 *
 * @param options - Optional mutation options to override or extend behavior.
 * @returns The TanStack Query mutation object for logging in.
 */
export function UseLoginMutation(options?: LoginMutationOptions): UseMutationResult<LoggedInAccount, Error, LoginInput> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: LoginAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['current-account'] });

      toast.success('Berhasil masuk!');
      navigate('/dashboard');

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });

  return mutation;
}

/**
 * Custom TanStack Query mutation hook for logging out of the current account.
 * Clears cached user state, shows a toast notification, and redirects to the sign-in page.
 *
 * @param options - Optional mutation options to override or extend behavior.
 * @returns The TanStack Query mutation object for logging out.
 */
export function UseLogoutMutation(options?: LogoutMutationOptions): UseMutationResult<void, Error, void> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: LogoutAccount,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.clear();

      toast.success('Berhasil keluar.');
      navigate('/signin');

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });

  return mutation;
}
