import { Router } from 'express';
import { RequireAuth } from '../../middleware/auth.middleware.js';
import {
  FinalSubmitVideo,
  GetCampaignSubmissions,
  GetMyCampaignSubmission,
  JoinCampaign,
  SaveDraftSubmission,
} from './submission.handlers.js';

export const submissionRouter = Router();

// All submission endpoints require an authenticated session
submissionRouter.use(RequireAuth);

submissionRouter.post('/:id/join', JoinCampaign);
submissionRouter.get('/:id/my-submission', GetMyCampaignSubmission);
submissionRouter.patch('/:id/submission/draft', SaveDraftSubmission);
submissionRouter.post('/:id/submission/submit', FinalSubmitVideo);
submissionRouter.get('/:id/submissions', GetCampaignSubmissions);
