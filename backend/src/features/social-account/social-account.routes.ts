import { Router } from 'express';
import { RequireAuth } from '../../middleware/auth.middleware.js';
import {
  GetConnectedSocialAccount,
  GetRecentTikTokVideos,
  RequestVerificationCode,
  ValidateTikTokVideoUrl,
  VerifyTikTokBio,
} from './social-account.handlers.js';

export const socialAccountRouter = Router();

// All social account endpoints require an active session
socialAccountRouter.use(RequireAuth);

socialAccountRouter.get('/connected', GetConnectedSocialAccount);
socialAccountRouter.post('/tiktok/request-code', RequestVerificationCode);
socialAccountRouter.post('/tiktok/verify', VerifyTikTokBio);
socialAccountRouter.get('/tiktok/recent-videos', GetRecentTikTokVideos);
socialAccountRouter.post('/tiktok/validate-video-url', ValidateTikTokVideoUrl);
