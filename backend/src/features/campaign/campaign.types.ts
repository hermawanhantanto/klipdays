import { z } from 'zod';

import {
  campaignBriefSchema,
  campaignEditSchema,
  campaignMaterialItemSchema,
  campaignMaterialsSchema,
} from './campaign.schemas.js';

export type CampaignMaterialItemInput = z.infer<typeof campaignMaterialItemSchema>;
export type CampaignMaterialsInput = z.infer<typeof campaignMaterialsSchema>;
export type CampaignBriefInput = z.infer<typeof campaignBriefSchema>;
export type CampaignEditInput = z.infer<typeof campaignEditSchema>;
