import { Router } from 'express';
import {
  DeleteCampaign,
  EditCampaign,
  GetCampaignById,
  GetCampaigns,
  GetCampaignStatusCounts,
  GetFeaturedCampaigns,
  InitializeCampaign,
  SubmitCampaign,
  UploadCampaignThumbnail,
} from './campaign.handlers.js';
import { RequireAuth } from '../../middleware/auth.middleware.js';

export const campaignRouter = Router();

// Every campaign endpoint requires a logged-in account.
campaignRouter.use(RequireAuth);

campaignRouter.get('/', GetCampaigns);
campaignRouter.get('/counts', GetCampaignStatusCounts);
campaignRouter.get('/featured', GetFeaturedCampaigns);
campaignRouter.get('/:id', GetCampaignById);

campaignRouter.post('/', InitializeCampaign);
campaignRouter.post('/:id/submit', SubmitCampaign);
campaignRouter.post('/:id/thumbnail', UploadCampaignThumbnail);

campaignRouter.patch('/:id/edit', EditCampaign);

campaignRouter.delete('/:id', DeleteCampaign);
