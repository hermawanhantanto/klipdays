import { Router } from 'express';

import { RequireAuth } from '../../middleware/auth.middleware.js';
import { AuthRateLimiter } from '../../rate-limiter/auth.rate-limiter.js';
import { GetCurrentAccount, LoginAccount, LogoutAccount, RegisterAccount } from './auth.handlers.js';

export const authRouter = Router();

authRouter.get('/me', RequireAuth, GetCurrentAccount);

authRouter.post('/register', AuthRateLimiter, RegisterAccount);
authRouter.post('/login', AuthRateLimiter, LoginAccount);
authRouter.post('/logout', LogoutAccount);

// TODO: password reset endpoint — see PRD section 2.1.
