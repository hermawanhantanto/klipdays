import { Router } from 'express';

import { LoginAccount, LogoutAccount, RegisterAccount } from './auth.handler.js';
import { AuthRateLimiter } from './auth.rate-limiter.js';

export const authRouter = Router();

authRouter.use(AuthRateLimiter);

authRouter.post('/register', RegisterAccount);
authRouter.post('/login', LoginAccount);
authRouter.post('/logout', LogoutAccount);

// TODO: password reset endpoint — see PRD section 2.1.
