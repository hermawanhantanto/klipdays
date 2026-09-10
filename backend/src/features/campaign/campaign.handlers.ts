import { Readable } from 'node:stream';
import { TransformStream } from 'node:stream/web';
import type { NextFunction, Request, Response } from 'express';
import type { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../utils/prisma.js';
import { CampaignStatus, Role, Status } from '../../generated/prisma/enums.js';
import { BuildCampaignEditFields } from './campaign.helper.js';
import {
  ValidateCampaignDateLogic,
  ValidateCampaignEditBody,
  ValidateCampaignRewardLogic,
  ValidateCampaignSubmitCompleteness,
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

    // Single query for existence + ownership via relation filter with related materials and brief
    const ownedCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      include: {
        materials: {
          where: { status: Status.ACTIVE },
        },
        brief: true,
      },
    });

    if (!ownedCampaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    // Fast fail if campaign is not in a submittable lifecycle status
    if (ownedCampaign.campaignStatus !== CampaignStatus.DRAFT && ownedCampaign.campaignStatus !== CampaignStatus.REVISION) {
      SendError(res, 'Campaign cannot be submitted in its current status.', 400);
      return;
    }

    // Validate mandatory data completeness across wizard steps before submission
    const completenessError = ValidateCampaignSubmitCompleteness(ownedCampaign);
    if (completenessError) {
      SendError(res, completenessError, 400);
      return;
    }

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

/**
 * Handles `POST /campaigns/:id/thumbnail`: streams the raw binary image payload
 * directly to Supabase Storage and returns the public asset URL without updating the database.
 * The database record is persisted when the user submits the step form.
 *
 * @param req - Express request with the authenticated account from `RequireAuth`.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function UploadCampaignThumbnail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const account = req.account;

    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.BRAND) {
      SendError(res, 'Only brands can upload campaign thumbnails.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    const ownedCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        brand: { accountId: account.sub, status: Status.ACTIVE },
      },
      select: {
        id: true,
      },
    });

    if (!ownedCampaign) {
      SendError(res, 'Campaign not found.', 404);
      return;
    }

    const allowedMimeTypes: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    const rawContentType = req.headers['content-type']?.split(';')[0].trim().toLowerCase() ?? '';
    const fileExtension = allowedMimeTypes[rawContentType];

    if (!fileExtension) {
      SendError(res, 'Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WEBP.', 400);
      return;
    }

    const contentLength = Number(req.headers['content-length']);
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (!contentLength || Number.isNaN(contentLength)) {
      SendError(res, 'Header Content-Length diperlukan.', 411);
      return;
    }

    if (contentLength > maxFileSize) {
      SendError(res, 'Ukuran file tidak boleh melebihi 5MB.', 400);
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'campaign-thumbnails';

    if (!supabaseUrl || !serviceRoleKey) {
      SendError(res, 'Layanan penyimpanan Supabase belum dikonfigurasi di server.', 500);
      return;
    }

    let bytesReceived = 0;
    const sizeLimiter = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        bytesReceived += chunk.byteLength;
        if (bytesReceived > maxFileSize) {
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
      SendError(res, 'Gagal mengunggah thumbnail ke penyimpanan cloud.', 502);
      return;
    }

    const publicUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${storagePath}`;

    SendSuccess(res, { url: publicUrl }, 'Thumbnail berhasil diunggah.');
  } catch (error) {
    if (error instanceof Error && error.message === 'FILE_SIZE_EXCEEDED') {
      SendError(res, 'Ukuran file tidak boleh melebihi 5MB.', 400);
      return;
    }
    next(error);
  }
}
