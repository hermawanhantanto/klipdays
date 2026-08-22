import { Router } from 'express';

import { AuthRateLimiter } from './auth.rate-limiter.js';

export const authRouter = Router();

authRouter.use(AuthRateLimiter);

// TODO: credential auth endpoints (register, login, password reset) — see PRD section 2.1.
