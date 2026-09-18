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
campaignRouter.post('/', InitializeCampaign);
campaignRouter.get('/counts', GetCampaignStatusCounts);
campaignRouter.get('/featured', GetFeaturedCampaigns);
campaignRouter.get('/:id', GetCampaignById);
campaignRouter.patch('/:id/edit', EditCampaign);
campaignRouter.post('/:id/submit', SubmitCampaign);
campaignRouter.post('/:id/thumbnail', UploadCampaignThumbnail);
campaignRouter.delete('/:id', DeleteCampaign);
