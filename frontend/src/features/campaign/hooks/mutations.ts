import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { GetCampaignById, EditCampaign, InitializeCampaign } from '../api';
import type { Campaign, CampaignEditInput, InitializeCampaignResponse } from '../types';
import { ResolveCampaignWizardStepPath } from '../utils';

export type InitializeCampaignMutationOptions = Omit<UseMutationOptions<InitializeCampaignResponse, Error, void>, 'mutationFn'>;

export type EditCampaignMutationOptions = Omit<UseMutationOptions<Campaign, Error, CampaignEditInput>, 'mutationFn'> & {
  successMessage?: string;
};

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
  const { onSuccess, onError, ...restOptions } = options ?? {};

  const mutation = useMutation({
    ...restOptions,
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

      onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      toast.error(error.message);
      onError?.(error, variables, onMutateResult, context);
    },
  });

  return mutation;
}

/**
 * Mutation hook for editing an existing campaign.
 * Calls `PATCH /campaigns/:id/edit`, updates the query cache, shows user feedback,
 * and navigates to the next appropriate wizard step based on updated campaign state.
 *
 * @param campaignId - The UUID of the campaign being edited.
 * @param options - Optional mutation options to extend default behavior.
 * @returns TanStack Query mutation object for editing a campaign.
 */
export function UseEditCampaignMutation(
  campaignId?: string,
  options?: EditCampaignMutationOptions
): UseMutationResult<Campaign, Error, CampaignEditInput> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options ?? {};

  const mutation = useMutation({
    ...restOptions,
    mutationFn: (data: CampaignEditInput) => {
      if (!campaignId) {
        throw new Error('Campaign ID is required.');
      }
      return EditCampaign(campaignId, data);
    },
    onSuccess: (updatedCampaign, variables, onMutateResult, context) => {
      if (campaignId) {
        queryClient.setQueryData(['campaign', campaignId], updatedCampaign);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

      const message = options?.successMessage ?? 'Informasi dasar berhasil disimpan.';
      toast.success(message);

      const targetPath = ResolveCampaignWizardStepPath(updatedCampaign);
      navigate(targetPath, {
        state: { campaignId: updatedCampaign.id },
      });

      onSuccess?.(updatedCampaign, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      toast.error(error.message);
      onError?.(error, variables, onMutateResult, context);
    },
  });

  return mutation;
}
