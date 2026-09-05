import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { GetCampaignById, InitializeCampaign } from '../api';
import type { InitializeCampaignResponse } from '../types';
import { ResolveCampaignWizardStepPath } from '../utils';

export type InitializeCampaignMutationOptions = Omit<UseMutationOptions<InitializeCampaignResponse, Error, void>, 'mutationFn'>;

/**
 * Mutation hook for initiating a new draft campaign.
 * Calls `POST /campaigns`, shows a success toast, retrieves campaign details via
 * `GET /campaigns/:id`, and navigates to the appropriate wizard step based on campaign data.
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
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully');

      try {
        const campaign = await GetCampaignById(data.id);

        queryClient.setQueryData(['campaign', data.id], campaign);
        const targetPath = ResolveCampaignWizardStepPath(campaign);

        navigate(targetPath, {
          state: { campaignId: data.id },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal memuat detail kampanye.';
        toast.error(message);
      }

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
