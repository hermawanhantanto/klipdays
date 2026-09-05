import { apiClient, ExtractApiError } from '@/lib/api-client';
import type { ApiResponse, InitializeCampaignResponse } from './types';

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
