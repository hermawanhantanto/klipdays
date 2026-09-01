import type { NextFunction, Request, Response } from 'express';

import { CampaignStatus, Role, Status } from '../../generated/prisma/enums.js';

import { SendError, SendSuccess } from '../../utils/api-response.js';
import { prisma } from '../../utils/prisma.js';

import { BuildCampaignEditFields } from './campaign.helper.js';
import { ValidateCampaignEditBody } from './campaign.validators.js';

/**
 * Handles `POST /campaigns`: creates an empty draft campaign for the
 * authenticated brand and returns its id, which the client uses to continue
 * the creation wizard step by step.
 *
 * @param req - Express request with the authenticated account from `RequireAuth`.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function InitializeCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    // Fast fail on role: the JWT role is checked before any database query,
    // so creator and admin accounts never get further.
    if (account.role !== Role.BRAND) {
      SendError(res, 'Only brands can create campaigns.', 403);
      return;
    }

    // The brand row supplies the brandId the campaign needs. A BRAND account
    // without an active brand row is a data-integrity gap, so still guard
    // against it. findFirst instead of findUnique so the filter can also
    // exclude soft-deleted brands.
    const brand = await prisma.brand.findFirst({
      where: { accountId: account.sub, status: Status.ACTIVE },
    });

    if (!brand) {
      SendError(res, 'Only brands can create campaigns.', 403);
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        status: CampaignStatus.DRAFT,
      },
      select: { id: true },
    });

    SendSuccess(res, { id: campaign.id }, 'Campaign initialized successfully.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `PATCH /campaigns/:id/edit`: the single edit endpoint of the
 * creation wizard. The body carries only the fields of the current wizard
 * step: every field is optional, and only the sent fields are validated
 * and written in one update.
 *
 * @param req - Express request with the authenticated account and the edit body.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function EditCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    // Fast fail on role: the JWT role is checked before anything else, so
    // non-brand accounts never reach a database query.
    if (account.role !== Role.BRAND) {
      SendError(res, 'Only brands can edit campaigns.', 403);
      return;
    }

    // The route pattern `/:id/edit` guarantees a single string id.
    const campaignId = req.params.id as string;

    // Ownership check right after auth: one query for existence + ownership
    // via a relation filter. 404 (not 403) when it does not match, so the
    // response does not reveal whether the id exists.
    const ownedCampaign = await prisma.campaign.findFirst({
      where: { id: campaignId, brand: { accountId: account.sub, status: Status.ACTIVE } },
      select: { id: true },
    });

    if (!ownedCampaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    // The validator returns the error message as a string on failure and the
    // parsed input object on success, so the typeof check tells the two apart.
    const input = ValidateCampaignEditBody(req.body);

    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    // The one write of the whole endpoint: only the sent fields are updated.
    const fields = BuildCampaignEditFields(input);

    const updated = await prisma.campaign.update({
      where: { id: ownedCampaign.id },
      data: fields,
    });

    SendSuccess(res, updated, 'Campaign updated successfully.');
  } catch (err) {
    next(err);
  }
}
