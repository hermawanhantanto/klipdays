import { Readable } from 'node:stream';
import { TransformStream } from 'node:stream/web';
import type { NextFunction, Request, Response } from 'express';
import type { Prisma } from '../../generated/prisma/client.js';
import { CampaignStatus, Role, Status } from '../../generated/prisma/enums.js';
import { SendError, SendSuccess } from '../../utils/api-response.js';
import { prisma } from '../../utils/prisma.js';
import {
  ALLOWED_THUMBNAIL_MIME_TYPES,
  CAMPAIGN_CARD_SELECT,
  CAMPAIGN_DETAIL_SELECT,
  CAMPAIGN_MESSAGES,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  FEATURED_CAMPAIGNS_LIMIT,
  FEATURED_CAMPAIGNS_MIN_COUNT,
  MAX_LIMIT,
  MAX_THUMBNAIL_SIZE_BYTES,
  SUBMITTABLE_CAMPAIGN_STATUSES,
} from './campaign.constants.js';
import { BuildCampaignEditFields, BuildCampaignsOrderBy, BuildCampaignsWhereClause } from './campaign.helper.js';
import type { CampaignsPaginatedData, CampaignStatusCounts } from './campaign.types.js';
import {
  ValidateCampaignDateLogic,
  ValidateCampaignEditBody,
  ValidateCampaignQuery,
  ValidateCampaignRewardLogic,
  ValidateCampaignSubmitCompleteness,
} from './campaign.validators.js';

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
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND) {
      SendError(res, CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_CREATE, 403);
      return;
    }

    const findBrandQuery = {
      where: { accountId: account.sub, status: Status.ACTIVE },
      select: { id: true },
    };

    const brand = await prisma.brand.findFirst(findBrandQuery);

    if (!brand) {
      SendError(res, CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_CREATE, 403);
      return;
    }

    const createCampaignPayload = {
      data: {
        brandId: brand.id,
        status: Status.ACTIVE,
        campaignStatus: CampaignStatus.DRAFT,
      },
      select: { id: true },
    };

    const campaign = await prisma.campaign.create(createCampaignPayload);

    SendSuccess(res, { id: campaign.id }, CAMPAIGN_MESSAGES.INITIALIZE_SUCCESS, 201);
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
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND) {
      SendError(res, CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_EDIT, 403);
      return;
    }

    const campaignId = req.params.id as string;

    const findCampaignQuery = {
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
    };

    const ownedCampaign = await prisma.campaign.findFirst(findCampaignQuery);

    if (!ownedCampaign) {
      SendError(res, CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, 404);
      return;
    }

    const input = ValidateCampaignEditBody(req.body);
    if (typeof input === 'string') {
      SendError(res, input, 400);
      return;
    }

    const rewardError = ValidateCampaignRewardLogic(input, ownedCampaign);
    if (rewardError) {
      SendError(res, rewardError, 400);
      return;
    }

    const dateError = ValidateCampaignDateLogic(input, ownedCampaign);
    if (dateError) {
      SendError(res, dateError, 400);
      return;
    }

    const updateFields = BuildCampaignEditFields(input);
    const updateQuery = {
      where: { id: ownedCampaign.id },
      data: updateFields,
      select: CAMPAIGN_DETAIL_SELECT,
    };

    const updated = await prisma.campaign.update(updateQuery);

    SendSuccess(res, updated, CAMPAIGN_MESSAGES.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns`: retrieves a paginated list of campaign cards with
 * keyword search, filters (category, campaign type, platform, status), and sorting.
 *
 * Role boundaries:
 * - Brand: sees their own campaigns across all lifecycle statuses.
 * - Creator: sees only campaigns with active lifecycle status and active brand.
 * - Admin: sees all active campaigns with optional status filter.
 *
 * @param req - Express request with the authenticated account and query parameters.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND && account.role !== Role.CREATOR && account.role !== Role.ADMIN) {
      SendError(res, CAMPAIGN_MESSAGES.UNAUTHORIZED_ROLE, 403);
      return;
    }

    const queryValidationResult = ValidateCampaignQuery(req.query);
    if (typeof queryValidationResult === 'string') {
      SendError(res, queryValidationResult, 400);
      return;
    }

    const queryInput = queryValidationResult;
    const page = queryInput.page ?? DEFAULT_PAGE;
    const rawLimit = queryInput.limit ?? DEFAULT_LIMIT;
    const limit = Math.min(rawLimit, MAX_LIMIT);
    const sort = queryInput.sort ?? 'latest';
    const skip = (page - 1) * limit;

    const whereClause = BuildCampaignsWhereClause(account, queryInput);
    const orderByClause = BuildCampaignsOrderBy(sort);

    const [campaigns, totalCount] = await prisma.$transaction([
      prisma.campaign.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limit,
        select: CAMPAIGN_CARD_SELECT,
      }),
      prisma.campaign.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const responsePayload: CampaignsPaginatedData = {
      items: campaigns as never,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };

    SendSuccess(res, responsePayload, CAMPAIGN_MESSAGES.RETRIEVED_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/featured`: retrieves a list of 3-5 featured campaigns for the hero carousel.
 * Pulls actively featured campaigns, backfilling with top active campaigns if fewer than 3 exist.
 *
 * @param req - Express request with the authenticated account.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetFeaturedCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND && account.role !== Role.CREATOR && account.role !== Role.ADMIN) {
      SendError(res, CAMPAIGN_MESSAGES.UNAUTHORIZED_ROLE, 403);
      return;
    }

    const now = new Date();
    const featuredWhereClause: Prisma.CampaignWhereInput = {
      status: Status.ACTIVE,
      campaignStatus: CampaignStatus.ACTIVE,
      isFeatured: true,
      brand: { status: Status.ACTIVE },
      OR: [{ featuredUntil: null }, { featuredUntil: { gt: now } }],
    };

    const featuredOrderByClause: Prisma.CampaignOrderByWithRelationInput[] = [
      { featuredOrder: { sort: 'asc', nulls: 'last' } },
      { createdAt: 'desc' },
    ];

    const primaryQuery = {
      where: featuredWhereClause,
      orderBy: featuredOrderByClause,
      take: FEATURED_CAMPAIGNS_LIMIT,
      select: CAMPAIGN_CARD_SELECT,
    };

    const featuredCampaigns = await prisma.campaign.findMany(primaryQuery);

    if (featuredCampaigns.length < FEATURED_CAMPAIGNS_MIN_COUNT) {
      const existingIds = featuredCampaigns.map((campaign) => campaign.id);
      const backfillTake = FEATURED_CAMPAIGNS_LIMIT - featuredCampaigns.length;

      const backfillQuery = {
        where: {
          status: Status.ACTIVE,
          campaignStatus: CampaignStatus.ACTIVE,
          brand: { status: Status.ACTIVE },
          id: { notIn: existingIds },
        },
        orderBy: [
          { cpm: { sort: 'desc' as const, nulls: 'last' as const } },
          { budget: { sort: 'desc' as const, nulls: 'last' as const } },
          { createdAt: 'desc' as const },
        ],
        take: backfillTake,
        select: CAMPAIGN_CARD_SELECT,
      };

      const backfillCampaigns = await prisma.campaign.findMany(backfillQuery);
      const combinedCampaigns = [...featuredCampaigns, ...backfillCampaigns];

      SendSuccess(res, combinedCampaigns, CAMPAIGN_MESSAGES.FEATURED_RETRIEVED_SUCCESS);
      return;
    }

    SendSuccess(res, featuredCampaigns, CAMPAIGN_MESSAGES.FEATURED_RETRIEVED_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/counts`: aggregates total campaign count grouped by
 * lifecycle status (`campaignStatus`) for the authenticated brand or admin.
 *
 * @param req - Express request with the authenticated account.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetCampaignStatusCounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND && account.role !== Role.ADMIN) {
      SendError(res, CAMPAIGN_MESSAGES.UNAUTHORIZED_ROLE, 403);
      return;
    }

    const whereClause: Prisma.CampaignWhereInput = {
      status: Status.ACTIVE,
      brand: { status: Status.ACTIVE },
    };

    if (account.role === Role.BRAND) {
      whereClause.brand = { accountId: account.sub, status: Status.ACTIVE };
    }

    const groupedCounts = await prisma.campaign.groupBy({
      by: ['campaignStatus'],
      where: whereClause,
      _count: {
        _all: true,
      },
    });

    const statusCounts: CampaignStatusCounts = {
      [CampaignStatus.DRAFT]: 0,
      [CampaignStatus.IN_REVIEW]: 0,
      [CampaignStatus.REVISION]: 0,
      [CampaignStatus.REJECTED]: 0,
      [CampaignStatus.ACTIVE]: 0,
      [CampaignStatus.FINISHED]: 0,
    };

    for (const group of groupedCounts) {
      statusCounts[group.campaignStatus] = group._count?._all ?? 0;
    }

    SendSuccess(res, statusCounts, CAMPAIGN_MESSAGES.STATUS_COUNTS_RETRIEVED_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/:id`: retrieves campaign details (including active
 * materials and brief) for display.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function GetCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
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
      whereClause.campaignStatus = {
        in: [CampaignStatus.ACTIVE, CampaignStatus.FINISHED],
      };
    }

    const findDetailQuery = {
      where: whereClause,
      select: CAMPAIGN_DETAIL_SELECT,
    };

    const campaign = await prisma.campaign.findFirst(findDetailQuery);

    if (!campaign) {
      SendError(res, CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, 404);
      return;
    }

    SendSuccess(res, campaign, CAMPAIGN_MESSAGES.DETAIL_RETRIEVED_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /campaigns/:id/submit`: verifies that all wizard steps are
 * complete and valid, then transitions the campaign status from DRAFT or REVISION to IN_REVIEW.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function, used to forward unexpected errors.
 */
export async function SubmitCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND) {
      SendError(res, CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_SUBMIT, 403);
      return;
    }

    const campaignId = req.params.id as string;

    const findCampaignQuery = {
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      include: {
        materials: {
          where: { status: Status.ACTIVE },
        },
        brief: {
          where: { status: Status.ACTIVE },
        },
      },
    };

    const ownedCampaign = await prisma.campaign.findFirst(findCampaignQuery);

    if (!ownedCampaign) {
      SendError(res, CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, 404);
      return;
    }

    if (!SUBMITTABLE_CAMPAIGN_STATUSES.includes(ownedCampaign.campaignStatus as (typeof SUBMITTABLE_CAMPAIGN_STATUSES)[number])) {
      SendError(res, CAMPAIGN_MESSAGES.CANNOT_SUBMIT_CURRENT_STATUS, 400);
      return;
    }

    const completenessError = ValidateCampaignSubmitCompleteness(ownedCampaign);
    if (completenessError) {
      SendError(res, completenessError, 400);
      return;
    }

    const updateQuery = {
      where: { id: ownedCampaign.id },
      data: { campaignStatus: CampaignStatus.IN_REVIEW },
      select: CAMPAIGN_DETAIL_SELECT,
    };

    const updated = await prisma.campaign.update(updateQuery);

    SendSuccess(res, updated, CAMPAIGN_MESSAGES.SUBMIT_SUCCESS);
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /campaigns/:id/thumbnail`: streams the raw binary image payload
 * directly to Supabase Storage and returns the public asset URL without updating the database.
 *
 * @param req - Express request with the authenticated account from `RequireAuth`.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function UploadCampaignThumbnail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND) {
      SendError(res, CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_UPLOAD_THUMBNAIL, 403);
      return;
    }

    const campaignId = req.params.id as string;

    const findQuery = {
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      select: { id: true },
    };

    const ownedCampaign = await prisma.campaign.findFirst(findQuery);

    if (!ownedCampaign) {
      SendError(res, CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, 404);
      return;
    }

    const rawContentType = req.headers['content-type']?.split(';')[0]?.trim().toLowerCase() ?? '';
    const fileExtension = ALLOWED_THUMBNAIL_MIME_TYPES[rawContentType as keyof typeof ALLOWED_THUMBNAIL_MIME_TYPES];

    if (!fileExtension) {
      SendError(res, CAMPAIGN_MESSAGES.UNSUPPORTED_FILE_TYPE, 400);
      return;
    }

    const contentLength = Number(req.headers['content-length']);

    if (!contentLength || Number.isNaN(contentLength)) {
      SendError(res, CAMPAIGN_MESSAGES.CONTENT_LENGTH_REQUIRED, 411);
      return;
    }

    if (contentLength > MAX_THUMBNAIL_SIZE_BYTES) {
      SendError(res, CAMPAIGN_MESSAGES.FILE_SIZE_EXCEEDED, 400);
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'campaign-thumbnails';

    if (!supabaseUrl || !serviceRoleKey) {
      SendError(res, CAMPAIGN_MESSAGES.STORAGE_CONFIG_MISSING, 500);
      return;
    }

    let bytesReceived = 0;
    const sizeLimiter = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytesReceived += chunk.byteLength;
        if (bytesReceived > MAX_THUMBNAIL_SIZE_BYTES) {
          controller.error(new Error('FILE_SIZE_EXCEEDED'));
        } else {
          controller.enqueue(chunk);
        }
      },
    });

    const webStream = Readable.toWeb(req).pipeThrough(sizeLimiter);
    const storagePath = `campaigns/${ownedCampaign.id}/thumbnail-${Date.now()}.${fileExtension}`;
    const targetUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/${bucket}/${storagePath}`;

    const supabaseResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': rawContentType,
        'x-upsert': 'true',
      },
      body: webStream,
      duplex: 'half',
    });

    if (!supabaseResponse.ok) {
      const errorDetail = await supabaseResponse.text();
      console.error('[Supabase Storage Upload Error]', supabaseResponse.status, errorDetail);
      SendError(res, CAMPAIGN_MESSAGES.STORAGE_UPLOAD_FAILED, 502);
      return;
    }

    const publicUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${storagePath}`;

    SendSuccess(res, { url: publicUrl }, CAMPAIGN_MESSAGES.THUMBNAIL_UPLOAD_SUCCESS);
  } catch (error) {
    if (error instanceof Error && error.message === 'FILE_SIZE_EXCEEDED') {
      SendError(res, CAMPAIGN_MESSAGES.FILE_SIZE_EXCEEDED, 400);
      return;
    }

    next(error);
  }
}

/**
 * Handles `DELETE /campaigns/:id`: soft-deletes a campaign and cascades
 * soft-deletion to all associated materials, brief, and submissions by updating
 * their `status` to `Status.DELETED` in an atomic database transaction.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function DeleteCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, CAMPAIGN_MESSAGES.AUTH_REQUIRED, 401);
      return;
    }

    if (account.role !== Role.BRAND && account.role !== Role.ADMIN) {
      SendError(res, CAMPAIGN_MESSAGES.UNAUTHORIZED_ROLE, 403);
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
    }

    const findQuery = {
      where: whereClause,
      select: { id: true },
    };

    const ownedCampaign = await prisma.campaign.findFirst(findQuery);

    if (!ownedCampaign) {
      SendError(res, CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND, 404);
      return;
    }

    await prisma.$transaction([
      prisma.campaign.update({
        where: { id: ownedCampaign.id },
        data: { status: Status.DELETED },
      }),
      prisma.campaignBrief.updateMany({
        where: { campaignId: ownedCampaign.id, status: Status.ACTIVE },
        data: { status: Status.DELETED },
      }),
      prisma.campaignMaterial.updateMany({
        where: { campaignId: ownedCampaign.id, status: Status.ACTIVE },
        data: { status: Status.DELETED },
      }),
      prisma.submission.updateMany({
        where: { campaignId: ownedCampaign.id, status: Status.ACTIVE },
        data: { status: Status.DELETED },
      }),
    ]);

    SendSuccess(res, null, CAMPAIGN_MESSAGES.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
}
