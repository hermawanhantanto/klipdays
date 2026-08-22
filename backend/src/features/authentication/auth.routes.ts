import { Router } from 'express';

import { LoginAccount, RegisterAccount } from './auth.handler.js';
import { AuthRateLimiter } from './auth.rate-limiter.js';

export const authRouter = Router();

authRouter.use(AuthRateLimiter);

authRouter.post('/register', RegisterAccount);
authRouter.post('/login', LoginAccount);

// TODO: password reset endpoint — see PRD section 2.1.
