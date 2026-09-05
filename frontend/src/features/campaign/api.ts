import { apiClient, ExtractApiError } from '@/lib/api-client';
import type { ApiResponse, Campaign, InitializeCampaignResponse } from './types';

/**
 * Sends a POST request to `/campaigns` to initialize an empty draft campaign.
 *
 * @returns The initialized campaign data containing its ID.
 * @throws Standardized API error if the request fails.
 */
export async function InitializeCampaign(): Promise<InitializeCampaignResponse> {
  try {
    const response = await apiClient.post<ApiResponse<InitializeCampaignResponse>>('/campaigns');
    const result = response.data.data;
    return result;
  } catch (error) {
    const apiError = ExtractApiError(error, 'Gagal membuat kampanye baru. Silakan coba lagi.');
    throw apiError;
  }
}

/**
 * Sends a GET request to `/campaigns/:id` to retrieve details of a specific campaign.
 *
 * @param id - The UUID of the campaign to retrieve.
 * @returns The campaign details.
 * @throws Error if id is missing or standardized API error if the request fails.
 */
export async function GetCampaignById(id?: string): Promise<Campaign> {
  if (!id) {
    throw new Error('Campaign ID is required.');
  }

  try {
    const response = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    const result = response.data.data;
    return result;
  } catch (error) {
    const apiError = ExtractApiError(error, 'Gagal memuat informasi kampanye. Silakan coba lagi.');
    throw apiError;
  }
}
