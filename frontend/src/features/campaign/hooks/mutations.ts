import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { InitializeCampaign } from '../api';
import type { InitializeCampaignResponse } from '../types';

export type InitializeCampaignMutationOptions = Omit<UseMutationOptions<InitializeCampaignResponse, Error, void>, 'mutationFn'>;

/**
 * Mutation hook for initiating a new draft campaign.
 * Calls `POST /campaigns`, invalidates relevant queries,
 * shows user feedback toasts, and navigates to step 1 upon success.
 *
 * @param options - Optional mutation options to extend default behavior.
 * @returns TanStack Query mutation object for initializing a campaign.
 */
export function UseInitializeCampaignMutation(
  options?: InitializeCampaignMutationOptions
): UseMutationResult<InitializeCampaignResponse, Error, void> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: InitializeCampaign,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

      toast.success('Draft kampanye baru berhasil dibuat.');
      navigate(`/dashboard/campaigns/${data.id}/create/step-1`, {
        state: { campaignId: data.id },
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      toast.error(error.message);
      options?.onError?.(error, variables, onMutateResult, context);
    },

    ...options,
  });

  return mutation;
}
