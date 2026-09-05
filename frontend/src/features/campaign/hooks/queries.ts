import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { GetCampaignById } from '../api';
import type { Campaign } from '../types';

/**
 * Custom TanStack Query hook that fetches a single campaign's details by its ID.
 * Enabled only when a valid campaign ID is provided.
 *
 * @param id - The UUID of the campaign to fetch.
 * @returns TanStack Query result containing the campaign data or error.
 */
export function UseCampaignQuery(id: string | undefined): UseQueryResult<Campaign, Error> {
  const queryResult = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => GetCampaignById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });

  return queryResult;
}
