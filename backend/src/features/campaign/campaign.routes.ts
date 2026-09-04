import { Router } from 'express';

import { EditCampaign, GetCampaignById, InitializeCampaign, SubmitCampaign } from './campaign.handlers.js';
import { RequireAuth } from '../../middleware/auth.middleware.js';

export const campaignRouter = Router();

// Every campaign endpoint requires a logged-in account.
campaignRouter.use(RequireAuth);

campaignRouter.post('/', InitializeCampaign);
campaignRouter.get('/:id', GetCampaignById);
campaignRouter.patch('/:id/edit', EditCampaign);
campaignRouter.post('/:id/submit', SubmitCampaign);

