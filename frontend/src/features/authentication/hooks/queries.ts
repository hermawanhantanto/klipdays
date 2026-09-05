import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type CurrentAccountProfile, GetCurrentAccount } from '../api';

/**
 * Custom TanStack Query hook that fetches the current authenticated user's profile from `/auth/me`.
 * Configured not to retry on error (e.g. 401 when not logged in), and caches the profile for 5 minutes.
 *
 * @returns TanStack Query result containing the CurrentAccountProfile data or error.
 */
export function UseCurrentAccountQuery(): UseQueryResult<CurrentAccountProfile, Error> {
  const queryResult = useQuery({
    queryKey: ['current-account'],
    queryFn: GetCurrentAccount,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return queryResult;
}
