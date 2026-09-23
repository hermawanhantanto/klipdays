import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Shared Axios instance configured with base URL, credentials, and default headers
 * for all communication with the Klipday backend API.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/me') ||
        url.includes('/auth/logout');

      if (!isAuthEndpoint && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
          window.location.href = `/signin?expired=true&redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a descriptive Error instance from an unknown error or Axios response.
 * Inspects the backend's standard `{ message }` response payload, falling back to
 * the Axios network error message or the provided fallback message.
 *
 * @param error - The caught error of unknown type.
 * @param fallbackMessage - Default message to use when no server or error message is available.
 * @returns A standardized Error object containing the resolved message.
 */
export function ExtractApiError(error: unknown, fallbackMessage = 'Terjadi kesalahan sistem. Silakan coba lagi.'): Error {
  // if error is an AxiosError, extract the message from the response
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const serverMessage = error.response?.data?.message;

    const networkMessage = error.message;

    const resolvedMessage = serverMessage ?? networkMessage ?? fallbackMessage;

    const apiError = new Error(resolvedMessage);

    return apiError;
  }

  // if error is an Error instance, return it
  if (error instanceof Error) {
    return error;
  }

  // if error is neither an AxiosError nor an Error, return the fallback message
  const fallbackError = new Error(fallbackMessage);
  return fallbackError;
}
