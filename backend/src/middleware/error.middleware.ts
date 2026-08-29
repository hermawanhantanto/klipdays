import type { ErrorRequestHandler } from 'express';

import { SendError } from '../utils/api-response.js';

/**
 * Centralized Express error-handling middleware. Logs the error and sends a
 * consistent error response via {@link SendError}.
 *
 * Uses `err.status` as the HTTP status code when present, otherwise `500`.
 */
export const ErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = typeof err?.status === 'number' ? err.status : 500;

  const message = err instanceof Error ? err.message : 'Internal Server Error';

  SendError(res, message, status);
};
