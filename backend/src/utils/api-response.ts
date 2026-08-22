import type { Response } from 'express';

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  data: T | null;
  message: string;
}

/**
 * Sends a consistent success response: `{ status: 'success', data, message }`.
 *
 * @param res - Express response object.
 * @param data - Payload returned to the client.
 * @param message - Human-readable message (default: `'OK'`).
 * @param statusCode - HTTP status code (default: `200`).
 */
export function SendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
): void {
  const body: ApiResponse<T> = { status: 'success', data, message };
  res.status(statusCode).json(body);
}

/**
 * Sends a consistent error response: `{ status: 'error', data: null, message }`.
 *
 * @param res - Express response object.
 * @param message - Human-readable error message.
 * @param statusCode - HTTP status code (default: `500`).
 * @param data - Optional extra error details (default: `null`).
 */
export function SendError(
  res: Response,
  message: string,
  statusCode = 500,
  data: unknown = null,
): void {
  const body: ApiResponse = { status: 'error', data, message };
  res.status(statusCode).json(body);
}
