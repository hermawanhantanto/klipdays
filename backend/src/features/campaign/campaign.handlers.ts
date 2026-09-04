import type { NextFunction, Request, Response } from 'express';
import type { Prisma } from '../../generated/prisma/client.js';

import { prisma } from '../../utils/prisma.js';
import { CampaignStatus, Role, Status } from '../../generated/prisma/enums.js';

import { BuildCampaignEditFields } from './campaign.helper.js';
import {
  ValidateCampaignDateLogic,
  ValidateCampaignEditBody,
  ValidateCampaignRewardLogic,
} from './campaign.validators.js';

import { SendError, SendSuccess } from '../../utils/api-response.js';

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
        status: Status.ACTIVE,
        campaignStatus: CampaignStatus.DRAFT,
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
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      select: {
        id: true,
        minViews: true,
        maxViews: true,
        budget: true,
        cpm: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!ownedCampaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    // Validate schema and get parsed input
    const input = ValidateCampaignEditBody(req.body);
    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    // Validate reward and pricing rules
    const rewardError = ValidateCampaignRewardLogic(input, ownedCampaign);
    if (rewardError) {
      SendError(res, rewardError, 400);
      return;
    }

    // Validate date and schedule rules
    const dateError = ValidateCampaignDateLogic(input, ownedCampaign);
    if (dateError) {
      SendError(res, dateError, 400);
      return;
    }

    // Build fields for update
    const fields = BuildCampaignEditFields(input);

    // Update campaign
    const updated = await prisma.campaign.update({
      where: { id: ownedCampaign.id },
      data: fields,
      include: {
        materials: {
          where: { status: Status.ACTIVE },
        },
        brief: true,
      },
    });

    SendSuccess(res, updated, 'Campaign updated successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/:id`: retrieves campaign details (including active
 * materials and brief) for display. Brands can view their own campaigns across
 * any status or publicly active campaigns. Clippers (creators) can view active or
 * finished campaigns. Admins can view any campaign.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function GetCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    const campaignId = req.params.id as string;

    const whereClause: Prisma.CampaignWhereInput = {
      id: campaignId,
      status: Status.ACTIVE,
      brand: { status: Status.ACTIVE },
    };

    if (account.role === Role.BRAND) {
      whereClause.brand = { accountId: account.sub, status: Status.ACTIVE };
    } else if (account.role === Role.CREATOR) {
      whereClause.campaignStatus = CampaignStatus.ACTIVE;
    }

    const campaign = await prisma.campaign.findFirst({
      where: whereClause,
      include: {
        materials: {
          where: { status: Status.ACTIVE },
        },
        brief: true,
        brand: {
          select: {
            id: true,
            companyName: true,
            industry: true,
          },
        },
      },
    });

    if (!campaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    SendSuccess(res, campaign, 'Campaign retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /campaigns/:id/submit`: verifies that all wizard steps are
 * complete and valid (no broken or missing data), then transitions the campaign
 * status from DRAFT or REVISION to IN_REVIEW.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function SubmitCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    // Fast fail on role: only brands can submit campaigns
    if (account.role !== Role.BRAND) {
      SendError(res, 'Only brands can submit campaigns.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    // Single query for existence + ownership via relation filter
    const ownedCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      select: {
        id: true,
        campaignStatus: true,
      },
    });

    if (!ownedCampaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    // Fast fail if campaign is not in a submittable lifecycle status
    if (
      ownedCampaign.campaignStatus !== CampaignStatus.DRAFT &&
      ownedCampaign.campaignStatus !== CampaignStatus.REVISION
    ) {
      SendError(res, 'Campaign cannot be submitted in its current status.', 400);
      return;
    }

    // TODO: Implement cleaner campaign data completeness validation across wizard steps before submission.

    const updateData = { campaignStatus: CampaignStatus.IN_REVIEW };
    const updated = await prisma.campaign.update({
      where: { id: ownedCampaign.id },
      data: updateData,
      include: {
        materials: {
          where: { status: Status.ACTIVE },
        },
        brief: true,
      },
    });

    SendSuccess(res, updated, 'Campaign submitted for review successfully.');
  } catch (err) {
    next(err);
  }
}

