import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { authRouter } from './features/authentication/auth.routes.js';
import { healthRouter } from './features/health/health.routes.js';
import { ErrorHandler } from './middleware/error-handler.js';

/**
 * Builds the Express application with security middleware (Helmet, CORS),
 * JSON parsing, routes, and the centralized error handler.
 *
 * @returns A configured Express application (not yet listening).
 */
export function CreateApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/auth', authRouter);

  app.use(ErrorHandler);

  return app;
}
