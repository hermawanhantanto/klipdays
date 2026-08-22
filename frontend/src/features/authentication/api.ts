import axios from 'axios'
import { apiClient } from '@/lib/api-client'

export type RegisterInput =
  | {
      role: 'BRAND'
      email: string
      password: string
      companyName: string
      phoneNumber: string
      industry: string
    }
  | {
      role: 'CREATOR'
      email: string
      password: string
      fullName: string
    }

interface ApiResponse<T> {
  status: string
  data: T
  message: string
}

export interface RegisteredAccount {
  id: string
  email: string
  role: string
  createdAt: string
}

/**
 * Sends a register request to the backend `POST /auth/register` endpoint using Axios.
 *
 * @param input - Validated register payload matching the backend schema.
 * @returns The newly created account.
 * @throws Error with the backend message when the request fails.
 */
export async function RegisterAccount(input: RegisterInput): Promise<RegisteredAccount> {
  try {
    const response = await apiClient.post<ApiResponse<RegisteredAccount>>('/auth/register', input)

    return response?.data?.data
  } catch (error) {

    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      const message = error.response?.data?.message ?? error.message ?? 'Registrasi gagal. Coba lagi.'
      
      throw new Error(message)
    }

    throw error instanceof Error ? error : new Error('Registrasi gagal. Coba lagi.')
  }
}
