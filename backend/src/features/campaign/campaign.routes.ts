import { Router } from 'express';

import { InitializeCampaign } from './campaign.handlers.js';
import { RequireAuth } from '../../middleware/auth.middleware.js';

export const campaignRouter = Router();

// Every campaign endpoint requires a logged-in account.
campaignRouter.use(RequireAuth);

campaignRouter.post('/', InitializeCampaign);
