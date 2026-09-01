import { z } from 'zod';
import { campaignStep1Schema } from './campaign.schemas.js';

export type CampaignStep1Input = z.infer<typeof campaignStep1Schema>;
