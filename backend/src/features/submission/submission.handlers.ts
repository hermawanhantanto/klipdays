import type { NextFunction, Request, Response } from 'express';
import { CampaignStatus, Platform, Role, Status, SubmissionStatus } from '../../generated/prisma/enums.js';
import { prisma } from '../../utils/prisma.js';
import { SendError, SendSuccess } from '../../utils/api-response.js';
import { FinalSubmitVideoSchema, SaveDraftSubmissionSchema } from './submission.validators.js';
import type { MySubmissionResponseData, SubmissionDetailDto } from './submission.types.js';

/**
 * Maps a Prisma submission row to a clean, strongly-typed SubmissionDetailDto.
 * Ensures Decimal earnings are consistently converted to strings.
 *
 * @param submission - Prisma submission row with optional relations.
 * @returns Serialized SubmissionDetailDto.
 */
function FormatSubmissionResponse(submission: {
  id: string;
  campaignId: string;
  creatorId: string;
  draftVideoUrl?: string | null;
  liveVideoUrl?: string | null;
  thumbnailUrl?: string | null;
  videoCaption?: string | null;
  submissionStatus: SubmissionStatus;
  reviewNote?: string | null;
  verifiedViews: number;
  earnings: { toString(): string } | number | string;
  submittedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialAccount?: any;
}): SubmissionDetailDto {
  const earningsString = submission.earnings.toString();
  const formatted: SubmissionDetailDto = {
    id: submission.id,
    campaignId: submission.campaignId,
    creatorId: submission.creatorId,
    draftVideoUrl: submission.draftVideoUrl,
    liveVideoUrl: submission.liveVideoUrl,
    thumbnailUrl: submission.thumbnailUrl,
    videoCaption: submission.videoCaption,
    submissionStatus: submission.submissionStatus,
    reviewNote: submission.reviewNote,
    verifiedViews: submission.verifiedViews,
    earnings: earningsString,
    submittedAt: submission.submittedAt,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    socialAccount: submission.socialAccount ?? null,
  };
  return formatted;
}

/**
 * Handles `POST /campaigns/:id/join`:
 * Enrolls a creator in an active campaign, creating a placeholder submission row with status `JOINED`.
 *
 * @param req - Express request with the authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function JoinCampaign(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const account = req.account;
    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.CREATOR) {
      SendError(res, 'Only creators can join campaigns.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        status: Status.ACTIVE,
        campaignStatus: CampaignStatus.ACTIVE,
      },
    });

    if (!campaign) {
      SendError(res, 'Kampanye tidak ditemukan atau belum aktif.', 404);
      return;
    }

    if (campaign.endDate && new Date(campaign.endDate) < new Date()) {
      SendError(res, 'Kampanye ini telah berakhir dan tidak lagi menerima pendaftaran baru.', 400);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Profil kreator tidak ditemukan.', 404);
      return;
    }

    // Check if a submission row already exists (including soft-deleted)
    let submission = await prisma.submission.findFirst({
      where: {
        campaignId: campaign.id,
        creatorId: creator.id,
      },
      include: {
        socialAccount: {
          where: { status: Status.ACTIVE },
        },
      },
    });

    if (!submission) {
      submission = await prisma.submission.create({
        data: {
          campaignId: campaign.id,
          creatorId: creator.id,
          submissionStatus: SubmissionStatus.JOINED,
          status: Status.ACTIVE,
        },
        include: {
          socialAccount: {
            where: { status: Status.ACTIVE },
          },
        },
      });
    } else if (submission.status !== Status.ACTIVE) {
      submission = await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: Status.ACTIVE,
          submissionStatus: SubmissionStatus.JOINED,
        },
        include: {
          socialAccount: {
            where: { status: Status.ACTIVE },
          },
        },
      });
    }

    const formattedSubmission = FormatSubmissionResponse(submission);
    SendSuccess(res, formattedSubmission, 'Berhasil bergabung dengan kampanye.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/:id/my-submission`:
 * Retrieves current creator's submission progress and connected TikTok social account.
 *
 * @param req - Express request with authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetMyCampaignSubmission(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const account = req.account;
    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.CREATOR && account.role !== Role.ADMIN) {
      SendError(res, 'Only creators can access their campaign submissions.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Profil kreator tidak ditemukan.', 404);
      return;
    }

    const rawSubmission = await prisma.submission.findFirst({
      where: {
        campaignId,
        creatorId: creator.id,
        status: Status.ACTIVE,
      },
      include: {
        socialAccount: {
          where: { status: Status.ACTIVE },
        },
      },
    });

    const verifiedSocialAccount = await prisma.creatorSocialAccount.findFirst({
      where: {
        creatorId: creator.id,
        platform: Platform.TIKTOK,
        isVerified: true,
        status: Status.ACTIVE,
      },
      orderBy: {
        verifiedAt: 'desc',
      },
    });

    let mappedSubmission: SubmissionDetailDto | null = null;
    if (rawSubmission) {
      mappedSubmission = FormatSubmissionResponse(rawSubmission);
    }

    const responsePayload: MySubmissionResponseData = {
      submission: mappedSubmission,
      socialAccount: verifiedSocialAccount,
    };

    SendSuccess(res, responsePayload, 'Data pengajuan kampanye berhasil diambil.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `PATCH /campaigns/:id/submission/draft`:
 * Autosaves the creator's chosen video selection, caption, and thumbnail for draft recovery.
 *
 * @param req - Express request with authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function SaveDraftSubmission(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const account = req.account;
    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.CREATOR) {
      SendError(res, 'Only creators can save submission drafts.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Profil kreator tidak ditemukan.', 404);
      return;
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        campaignId,
        creatorId: creator.id,
        status: Status.ACTIVE,
      },
    });

    if (!existingSubmission) {
      SendError(res, 'Anda belum bergabung dengan kampanye ini.', 404);
      return;
    }

    if (
      existingSubmission.submissionStatus !== SubmissionStatus.JOINED &&
      existingSubmission.submissionStatus !== SubmissionStatus.REVISION_REQUESTED
    ) {
      if (existingSubmission.submissionStatus === SubmissionStatus.PENDING_REVIEW) {
        SendError(res, 'Pengajuan video Anda sedang ditinjau dan draf tidak dapat diubah.', 400);
        return;
      }
      if (existingSubmission.submissionStatus === SubmissionStatus.APPROVED) {
        SendError(res, 'Pengajuan video Anda telah disetujui.', 400);
        return;
      }
      SendError(res, 'Status pengajuan saat ini tidak memungkinkan perubahan draf.', 400);
      return;
    }

    const validation = SaveDraftSubmissionSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? 'Invalid request payload.';
      SendError(res, firstError, 400);
      return;
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: existingSubmission.id },
      data: {
        liveVideoUrl: validation.data.liveVideoUrl ?? existingSubmission.liveVideoUrl,
        thumbnailUrl: validation.data.thumbnailUrl ?? existingSubmission.thumbnailUrl,
        videoCaption: validation.data.videoCaption ?? existingSubmission.videoCaption,
        socialAccountId: validation.data.socialAccountId ?? existingSubmission.socialAccountId,
      },
      include: {
        socialAccount: {
          where: { status: Status.ACTIVE },
        },
      },
    });

    const formattedSubmission = FormatSubmissionResponse(updatedSubmission);
    SendSuccess(res, formattedSubmission, 'Draf pengajuan video berhasil disimpan.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /campaigns/:id/submission/submit`:
 * Finalizes the video submission (Step 4), setting `submittedAt` and transitioning status to `PENDING_REVIEW`.
 *
 * @param req - Express request with authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function FinalSubmitVideo(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const account = req.account;
    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.CREATOR) {
      SendError(res, 'Only creators can submit videos.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Profil kreator tidak ditemukan.', 404);
      return;
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        campaignId,
        creatorId: creator.id,
        status: Status.ACTIVE,
      },
    });

    if (!existingSubmission) {
      SendError(res, 'Data pendaftaran kampanye tidak ditemukan.', 404);
      return;
    }

    if (
      existingSubmission.submissionStatus !== SubmissionStatus.JOINED &&
      existingSubmission.submissionStatus !== SubmissionStatus.REVISION_REQUESTED
    ) {
      if (existingSubmission.submissionStatus === SubmissionStatus.PENDING_REVIEW) {
        SendError(res, 'Pengajuan video Anda sedang dalam proses peninjauan oleh brand.', 400);
        return;
      }
      if (existingSubmission.submissionStatus === SubmissionStatus.APPROVED) {
        SendError(res, 'Pengajuan video Anda telah disetujui sebelumnya.', 400);
        return;
      }
      SendError(res, 'Status pengajuan saat ini tidak dapat dikirimkan ulang.', 400);
      return;
    }

    const validation = FinalSubmitVideoSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? 'Invalid request payload.';
      SendError(res, firstError, 400);
      return;
    }

    const finalLiveVideoUrl = validation.data.liveVideoUrl || existingSubmission.liveVideoUrl;
    if (!finalLiveVideoUrl) {
      SendError(res, 'URL video TikTok wajib diisi untuk menyelesaikan pengajuan.', 400);
      return;
    }

    let finalSocialAccountId: string | undefined = validation.data.socialAccountId;
    if (finalSocialAccountId) {
      const ownedSocialAccount = await prisma.creatorSocialAccount.findFirst({
        where: {
          id: finalSocialAccountId,
          creatorId: creator.id,
          status: Status.ACTIVE,
        },
      });
      if (!ownedSocialAccount) {
        SendError(res, 'Akun media sosial tidak valid atau tidak dimiliki oleh profil Anda.', 400);
        return;
      }
    } else {
      const verifiedSocialAccount = await prisma.creatorSocialAccount.findFirst({
        where: {
          creatorId: creator.id,
          platform: Platform.TIKTOK,
          isVerified: true,
          status: Status.ACTIVE,
        },
        orderBy: {
          verifiedAt: 'desc',
        },
      });
      if (verifiedSocialAccount) {
        finalSocialAccountId = verifiedSocialAccount.id;
      }
    }

    const finalizedSubmission = await prisma.submission.update({
      where: { id: existingSubmission.id },
      data: {
        liveVideoUrl: finalLiveVideoUrl,
        thumbnailUrl: validation.data.thumbnailUrl ?? existingSubmission.thumbnailUrl,
        videoCaption: validation.data.videoCaption ?? existingSubmission.videoCaption,
        socialAccountId: finalSocialAccountId,
        submissionStatus: SubmissionStatus.PENDING_REVIEW,
        submittedAt: new Date(),
      },
      include: {
        socialAccount: {
          where: { status: Status.ACTIVE },
        },
      },
    });

    const formattedSubmission = FormatSubmissionResponse(finalizedSubmission);
    SendSuccess(res, formattedSubmission, 'Pengajuan video berhasil dikirim untuk ditinjau.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /campaigns/:id/submissions`:
 * Retrieves all submitted videos for a campaign (excluding creators in JOINED state without videos).
 * Strictly guarded: only the owning brand or platform admins can view campaign submissions.
 *
 * @param req - Express request with authenticated account and campaign id parameter.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetCampaignSubmissions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const account = req.account;
    if (!account) {
      SendError(res, 'Authentication required.', 401);
      return;
    }

    if (account.role !== Role.BRAND && account.role !== Role.ADMIN) {
      SendError(res, 'Only brands and admins can review campaign submissions.', 403);
      return;
    }

    const campaignId = req.params.id as string;

    // Tenant ownership check: Brand must own campaign; return 404 for mismatches
    if (account.role === Role.BRAND) {
      const brandCampaign = await prisma.campaign.findFirst({
        where: {
          id: campaignId,
          status: Status.ACTIVE,
          brand: {
            accountId: account.sub,
            status: Status.ACTIVE,
          },
        },
      });

      if (!brandCampaign) {
        SendError(res, 'Kampanye tidak ditemukan.', 404);
        return;
      }
    }

    const submissions = await prisma.submission.findMany({
      where: {
        campaignId,
        status: Status.ACTIVE,
        submissionStatus: { not: SubmissionStatus.JOINED },
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        socialAccount: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            followersCount: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const formattedSubmissions = submissions.map((item) => {
      const earningsString = item.earnings.toString();
      return {
        id: item.id,
        campaignId: item.campaignId,
        creatorId: item.creatorId,
        draftVideoUrl: item.draftVideoUrl,
        liveVideoUrl: item.liveVideoUrl,
        thumbnailUrl: item.thumbnailUrl,
        videoCaption: item.videoCaption,
        submissionStatus: item.submissionStatus,
        reviewNote: item.reviewNote,
        verifiedViews: item.verifiedViews,
        earnings: earningsString,
        submittedAt: item.submittedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        creator: item.creator,
        socialAccount: item.socialAccount,
      };
    });

    SendSuccess(res, formattedSubmissions, 'Daftar pengajuan video kampanye berhasil diambil.');
  } catch (err) {
    next(err);
  }
}
