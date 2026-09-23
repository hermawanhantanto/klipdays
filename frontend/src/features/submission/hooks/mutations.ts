import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FinalSubmitVideo,
  JoinCampaign,
  RequestTikTokVerificationCode,
  SaveDraftSubmission,
  ValidateTikTokVideoUrl,
  VerifyTikTokBio,
} from '../api';
import type {
  CreatorSocialAccount,
  FinalSubmitVideoInput,
  RequestVerificationCodeInput,
  RequestVerificationCodeResponse,
  SaveDraftSubmissionInput,
  SocialVideoItem,
  Submission,
  ValidateVideoUrlInput,
  VerifyBioInput,
} from '../types';

/**
 * Mutation hook for joining a campaign, creating the placeholder JOINED submission.
 *
 * @returns TanStack mutation object for campaign enrollment.
 */
export function UseJoinCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, string>({
    mutationFn: (campaignId: string) => JoinCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['my-campaign-submission', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
}

/**
 * Mutation hook for autosaving video draft details during wizard Step 3.
 *
 * @param campaignId - Target campaign UUID.
 * @returns TanStack mutation object for draft saving.
 */
export function UseSaveDraftSubmissionMutation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, SaveDraftSubmissionInput>({
    mutationFn: (input: SaveDraftSubmissionInput) => SaveDraftSubmission(campaignId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaign-submission', campaignId] });
    },
  });
}

/**
 * Mutation hook for finalizing video submission during wizard Step 4.
 *
 * @param campaignId - Target campaign UUID.
 * @returns TanStack mutation object for final video submission.
 */
export function UseFinalSubmitVideoMutation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation<Submission, Error, FinalSubmitVideoInput>({
    mutationFn: (input: FinalSubmitVideoInput) => FinalSubmitVideo(campaignId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaign-submission', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
}

/**
 * Mutation hook for requesting a bio verification token (KD-XXXX) for TikTok.
 *
 * @returns TanStack mutation object for requesting verification code.
 */
export function UseRequestTikTokVerificationCodeMutation() {
  return useMutation<RequestVerificationCodeResponse, Error, RequestVerificationCodeInput>({
    mutationFn: (input: RequestVerificationCodeInput) => RequestTikTokVerificationCode(input),
  });
}

/**
 * Mutation hook for checking TikTok bio and confirming account verification.
 *
 * @returns TanStack mutation object for verifying bio.
 */
export function UseVerifyTikTokBioMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreatorSocialAccount, Error, VerifyBioInput>({
    mutationFn: (input: VerifyBioInput) => VerifyTikTokBio(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-social-account'] });
      queryClient.invalidateQueries({ queryKey: ['recent-tiktok-videos'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaign-submission'] });
    },
  });
}

/**
 * Mutation hook for validating direct TikTok video URLs.
 *
 * @returns TanStack mutation object for URL validation.
 */
export function UseValidateTikTokVideoUrlMutation() {
  return useMutation<SocialVideoItem, Error, ValidateVideoUrlInput>({
    mutationFn: (input: ValidateVideoUrlInput) => ValidateTikTokVideoUrl(input),
  });
}
