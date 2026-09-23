import { apiClient, ExtractApiError } from '@/lib/api-client';
import { TranslateAuthError } from './utils';
import type { ApiResponse, CurrentAccountProfile, LoggedInAccount, LoginInput, RegisteredAccount, RegisterInput } from './types';
export type {
  ApiResponse,
  AuthRole,
  BrandProfile,
  BrandRegisterInput,
  CreatorProfile,
  CreatorRegisterInput,
  CurrentAccountProfile,
  LoggedInAccount,
  LoginInput,
  RegisteredAccount,
  RegisterInput,
} from './types';

/**
 * Sends a register request to the backend `POST /auth/register` endpoint using Axios.
 *
 * @param input - Validated register payload matching the backend schema.
 * @returns The newly created account.
 * @throws Error with the backend message when the request fails.
 */
export async function RegisterAccount(input: RegisterInput): Promise<RegisteredAccount> {
  try {
    const response = await apiClient.post<ApiResponse<RegisteredAccount>>('/auth/register', input);
    const result = response.data.data;
    return result;
  } catch (error) {
    const rawError = ExtractApiError(error, 'Registrasi gagal. Coba lagi.');
    const translatedMessage = TranslateAuthError(rawError.message, 'Registrasi gagal. Coba lagi.');
    const apiError = new Error(translatedMessage);
    throw apiError;
  }
}

/**
 * Sends a login request to the backend `POST /auth/login` endpoint using Axios.
 *
 * @param input - Validated login credentials (email and password).
 * @returns The authenticated account details.
 * @throws Error with the backend message when authentication fails.
 */
export async function LoginAccount(input: LoginInput): Promise<LoggedInAccount> {
  try {
    const response = await apiClient.post<ApiResponse<LoggedInAccount>>('/auth/login', input);
    const result = response.data.data;
    return result;
  } catch (error) {
    const rawError = ExtractApiError(error, 'Masuk gagal. Coba lagi.');
    const translatedMessage = TranslateAuthError(rawError.message, 'Masuk gagal. Coba lagi.');
    const apiError = new Error(translatedMessage);
    throw apiError;
  }
}

/**
 * Sends a request to the backend `GET /auth/me` endpoint to retrieve
 * the authenticated account's profile details based on active session cookies.
 *
 * @returns The active user's account and profile data.
 * @throws Error with the backend message when session is invalid or missing.
 */
export async function GetCurrentAccount(): Promise<CurrentAccountProfile> {
  try {
    const response = await apiClient.get<ApiResponse<CurrentAccountProfile>>('/auth/me');
    const result = response.data.data;
    return result;
  } catch (error) {
    const rawError = ExtractApiError(error, 'Gagal memuat profil akun.');
    const translatedMessage = TranslateAuthError(rawError.message, 'Gagal memuat profil akun.');
    const apiError = new Error(translatedMessage);
    throw apiError;
  }
}

/**
 * Sends a logout request to the backend `POST /auth/logout` endpoint to clear the session cookie.
 *
 * @returns A promise that resolves when the session cookie is removed.
 * @throws Error with the backend message when logout fails.
 */
export async function LogoutAccount(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    const rawError = ExtractApiError(error, 'Gagal keluar.');
    const translatedMessage = TranslateAuthError(rawError.message, 'Gagal keluar.');
    const apiError = new Error(translatedMessage);
    throw apiError;
  }
}
