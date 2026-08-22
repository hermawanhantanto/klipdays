import { Router } from 'express';

import { SendSuccess } from '../../utils/api-response.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  SendSuccess(res, { uptime: process.uptime() }, 'Server is healthy');
});
