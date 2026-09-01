import { z } from 'zod';
import { campaignEditSchema } from './campaign.schemas.js';

export type CampaignEditInput = z.infer<typeof campaignEditSchema>;
