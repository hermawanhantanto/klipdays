import type { NextFunction, Request, Response } from 'express';
import { Platform, Role, Status } from '../../generated/prisma/enums.js';
import { prisma } from '../../utils/prisma.js';
import { SendError, SendSuccess } from '../../utils/api-response.js';
import { GetScraperProvider } from './services/scraper.factory.js';
import { PersistSocialAvatarToStorage } from './services/avatar-storage.service.js';
import {
  RequestCodeSchema,
  ValidateVideoUrlSchema,
  VerifyBioSchema,
} from './social-account.validators.js';
import type { RequestCodeResponseData } from './social-account.types.js';

/**
 * Generates a random uppercase verification code in the format KD-XXXX.
 *
 * @returns Formatted 7-character verification code string.
 */
function GenerateVerificationCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomSegment = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomSegment += characters[randomIndex];
  }
  return `KD-${randomSegment}`;
}

/**
 * Handles `GET /social-accounts/connected`:
 * Retrieves the currently logged-in creator's verified TikTok account if one exists.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetConnectedSocialAccount(
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
      SendError(res, 'Only creators can connect social accounts.', 403);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Creator profile not found.', 404);
      return;
    }

    let socialAccount = await prisma.creatorSocialAccount.findFirst({
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

    // Auto-heal in case an account was previously verified but isVerified was temporarily toggled false
    if (!socialAccount) {
      const previouslyVerified = await prisma.creatorSocialAccount.findFirst({
        where: {
          creatorId: creator.id,
          platform: Platform.TIKTOK,
          verifiedAt: { not: null },
          status: Status.ACTIVE,
        },
        orderBy: {
          verifiedAt: 'desc',
        },
      });

      if (previouslyVerified) {
        socialAccount = await prisma.creatorSocialAccount.update({
          where: { id: previouslyVerified.id },
          data: {
            isVerified: true,
            verificationCode: null,
            verificationExpiresAt: null,
          },
        });
      }
    }

    if (!socialAccount) {
      socialAccount = await prisma.creatorSocialAccount.findFirst({
        where: {
          creatorId: creator.id,
          platform: Platform.TIKTOK,
          isVerified: false,
          verificationExpiresAt: { gt: new Date() },
          status: Status.ACTIVE,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }

    // Ensure verified account avatar is permanently stored in Supabase (auto-migrating expired TikTok CDN URLs)
    if (
      socialAccount &&
      socialAccount.isVerified &&
      (!socialAccount.avatarUrl || socialAccount.avatarUrl.includes('tiktokcdn'))
    ) {
      let permanentUrl: string | null = null;
      if (socialAccount.avatarUrl) {
        permanentUrl = await PersistSocialAvatarToStorage(
          socialAccount.avatarUrl,
          socialAccount.creatorId,
          socialAccount.platform,
          socialAccount.username,
        );
      }

      // If existing TikTok CDN avatar URL failed (e.g. signature expired), fetch fresh profile from scraper
      if (!permanentUrl) {
        try {
          const scraper = GetScraperProvider();
          const liveProfile = await scraper.GetUserProfile(
            socialAccount.platform,
            socialAccount.username,
          );
          if (liveProfile.avatarUrl) {
            permanentUrl = await PersistSocialAvatarToStorage(
              liveProfile.avatarUrl,
              socialAccount.creatorId,
              socialAccount.platform,
              socialAccount.username,
            );
            if (!permanentUrl) {
              permanentUrl = liveProfile.avatarUrl;
            }
          }
        } catch (scraperErr) {
          console.warn('[SocialAccount] Failed to refresh expired avatar from scraper:', scraperErr);
        }
      }

      if (permanentUrl && permanentUrl !== socialAccount.avatarUrl) {
        socialAccount = await prisma.creatorSocialAccount.update({
          where: { id: socialAccount.id },
          data: { avatarUrl: permanentUrl },
        });
      }
    }

    SendSuccess(res, socialAccount, 'Connected social account retrieved.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /social-accounts/tiktok/request-code`:
 * Generates a one-time verification token (KD-XXXX) valid for 10 minutes for TikTok bio verification.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function RequestVerificationCode(
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
      SendError(res, 'Only creators can connect TikTok accounts.', 403);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Creator profile not found.', 404);
      return;
    }

    const validation = RequestCodeSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? 'Invalid request payload.';
      SendError(res, firstError, 400);
      return;
    }

    const cleanUsername = validation.data.username.replace(/^@/, '').toLowerCase().trim();

    // Look up any existing record by unique constraint (platform, username) including soft-deleted rows
    const existingRecord = await prisma.creatorSocialAccount.findFirst({
      where: {
        platform: Platform.TIKTOK,
        username: cleanUsername,
      },
    });

    // Anti-hijacking guard: check if another creator already verified this username
    if (
      existingRecord &&
      existingRecord.isVerified &&
      existingRecord.status === Status.ACTIVE &&
      existingRecord.creatorId !== creator.id
    ) {
      SendError(res, 'Username TikTok ini sudah terhubung dengan kreator lain.', 409);
      return;
    }

    // If creator previously verified this username, seamlessly reactivate it without requiring re-verification
    if (
      existingRecord &&
      existingRecord.status === Status.ACTIVE &&
      existingRecord.creatorId === creator.id &&
      (existingRecord.isVerified || existingRecord.verifiedAt !== null)
    ) {
      // Deactivate other TikTok accounts for this creator
      await prisma.creatorSocialAccount.updateMany({
        where: {
          creatorId: creator.id,
          platform: Platform.TIKTOK,
          id: { not: existingRecord.id },
          isVerified: true,
        },
        data: {
          isVerified: false,
        },
      });

      const updatedAccount = await prisma.creatorSocialAccount.update({
        where: { id: existingRecord.id },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          verificationCode: null,
          verificationExpiresAt: null,
        },
      });

      const responseData: RequestCodeResponseData = {
        username: cleanUsername,
        alreadyVerified: true,
        account: updatedAccount,
      };

      SendSuccess(
        res,
        responseData,
        `Akun @${existingRecord.username} sudah terverifikasi dan berhasil diaktifkan kembali.`,
      );
      return;
    }

    const verificationCode = GenerateVerificationCode();
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (existingRecord) {
      await prisma.creatorSocialAccount.update({
        where: { id: existingRecord.id },
        data: {
          creatorId: creator.id,
          verificationCode,
          verificationExpiresAt: expiryDate,
          isVerified: false,
          status: Status.ACTIVE,
        },
      });
    } else {
      await prisma.creatorSocialAccount.create({
        data: {
          creatorId: creator.id,
          platform: Platform.TIKTOK,
          username: cleanUsername,
          verificationCode,
          verificationExpiresAt: expiryDate,
          isVerified: false,
          status: Status.ACTIVE,
        },
      });
    }

    const responseData: RequestCodeResponseData = {
      code: verificationCode,
      expiresAt: expiryDate.toISOString(),
      username: cleanUsername,
    };

    SendSuccess(res, responseData, 'Kode verifikasi bio berhasil dibuat.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /social-accounts/tiktok/verify`:
 * Inspects creator's live TikTok bio description to confirm presence of the verification code.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function VerifyTikTokBio(
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
      SendError(res, 'Only creators can verify TikTok accounts.', 403);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Creator profile not found.', 404);
      return;
    }

    const validation = VerifyBioSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? 'Invalid request payload.';
      SendError(res, firstError, 400);
      return;
    }

    const cleanUsername = validation.data.username.replace(/^@/, '').toLowerCase().trim();

    const pendingRecord = await prisma.creatorSocialAccount.findFirst({
      where: {
        creatorId: creator.id,
        platform: Platform.TIKTOK,
        username: cleanUsername,
        status: Status.ACTIVE,
      },
    });

    if (!pendingRecord || !pendingRecord.verificationCode) {
      SendError(res, 'Silakan minta kode verifikasi terlebih dahulu.', 400);
      return;
    }

    if (pendingRecord.verificationExpiresAt && pendingRecord.verificationExpiresAt < new Date()) {
      SendError(res, 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.', 400);
      return;
    }

    // Call scraper service to fetch live profile and bio
    const scraper = GetScraperProvider();
    let liveProfile;
    try {
      liveProfile = await scraper.GetUserProfile(Platform.TIKTOK, cleanUsername);
    } catch {
      SendError(
        res,
        `Tidak dapat mengakses profil TikTok @${cleanUsername}. Pastikan akun TikTok bersifat publik dan coba lagi.`,
        400,
      );
      return;
    }

    const expectedCode = pendingRecord.verificationCode.toLowerCase();
    const liveBio = (liveProfile.bioDescription || '').toLowerCase();

    if (!liveBio.includes(expectedCode)) {
      SendError(
        res,
        `Kode [${pendingRecord.verificationCode}] belum terdeteksi di bio TikTok @${cleanUsername}. Harap pastikan bio sudah disimpan dan coba lagi.`,
        400,
      );
      return;
    }

    // Bio verified successfully! Attempt to persist avatar to Supabase Storage
    let resolvedAvatarUrl = liveProfile.avatarUrl ?? pendingRecord.avatarUrl;
    if (resolvedAvatarUrl) {
      const storedAvatarUrl = await PersistSocialAvatarToStorage(
        resolvedAvatarUrl,
        pendingRecord.creatorId,
        pendingRecord.platform,
        cleanUsername,
      );
      if (storedAvatarUrl) {
        resolvedAvatarUrl = storedAvatarUrl;
      }
    }

    // Deactivate verification on any prior TikTok accounts belonging to this creator
    // to preserve a strict single-active-account model while keeping historical records intact
    await prisma.creatorSocialAccount.updateMany({
      where: {
        creatorId: creator.id,
        platform: Platform.TIKTOK,
        id: { not: pendingRecord.id },
        isVerified: true,
      },
      data: {
        isVerified: false,
      },
    });

    const updatedAccount = await prisma.creatorSocialAccount.update({
      where: { id: pendingRecord.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verificationCode: null,
        verificationExpiresAt: null,
        avatarUrl: resolvedAvatarUrl,
        followersCount: liveProfile.followersCount ?? pendingRecord.followersCount,
        platformUserId: liveProfile.platformUserId ?? pendingRecord.platformUserId,
      },
    });

    SendSuccess(
      res,
      updatedAccount,
      'Akun TikTok berhasil diverifikasi. Anda sekarang dapat menghapus kode dari bio Anda.',
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `GET /social-accounts/tiktok/recent-videos`:
 * Fetches recent public videos uploaded by the creator's connected TikTok account.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function GetRecentTikTokVideos(
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
      SendError(res, 'Only creators can access recent TikTok videos.', 403);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Creator profile not found.', 404);
      return;
    }

    const targetUsername =
      typeof req.query.username === 'string' && req.query.username.trim()
        ? req.query.username.replace(/^@/, '').toLowerCase().trim()
        : undefined;

    const verifiedAccount = await prisma.creatorSocialAccount.findFirst({
      where: {
        creatorId: creator.id,
        platform: Platform.TIKTOK,
        isVerified: true,
        status: Status.ACTIVE,
        ...(targetUsername ? { username: { equals: targetUsername, mode: 'insensitive' } } : {}),
      },
      orderBy: {
        verifiedAt: 'desc',
      },
    });

    if (!verifiedAccount) {
      SendError(res, 'Belum ada akun TikTok yang terverifikasi.', 400);
      return;
    }

    const scraper = GetScraperProvider();
    let videos;
    try {
      videos = await scraper.GetUserRecentVideos(Platform.TIKTOK, verifiedAccount.username, 12);
    } catch (scraperErr) {
      console.error(
        `[GetRecentTikTokVideos] Scraper error for @${verifiedAccount.username}:`,
        scraperErr,
      );
      SendError(
        res,
        'Gagal mengambil daftar video TikTok terbaru. Anda dapat memasukkan tautan video secara manual atau mencoba lagi.',
        400,
      );
      return;
    }

    SendSuccess(res, videos, 'Daftar video TikTok berhasil diambil.');
  } catch (err) {
    next(err);
  }
}

/**
 * Handles `POST /social-accounts/tiktok/validate-video-url`:
 * Validates a direct TikTok video link and ensures author matches creator's verified account.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export async function ValidateTikTokVideoUrl(
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
      SendError(res, 'Only creators can validate TikTok videos.', 403);
      return;
    }

    const creator = await prisma.creator.findFirst({
      where: {
        accountId: account.sub,
        status: Status.ACTIVE,
      },
    });

    if (!creator) {
      SendError(res, 'Creator profile not found.', 404);
      return;
    }

    const verifiedAccount = await prisma.creatorSocialAccount.findFirst({
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

    if (!verifiedAccount) {
      SendError(res, 'Harap verifikasi akun TikTok terlebih dahulu.', 400);
      return;
    }

    const validation = ValidateVideoUrlSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? 'Invalid URL.';
      SendError(res, firstError, 400);
      return;
    }

    const rawVideoUrl = validation.data.videoUrl;
    const scraper = GetScraperProvider();
    let videoDetails;
    try {
      videoDetails = await scraper.GetVideoDetails(Platform.TIKTOK, rawVideoUrl);
    } catch {
      SendError(
        res,
        'Tidak dapat memverifikasi tautan video TikTok. Pastikan tautan benar dan video bersifat publik.',
        400,
      );
      return;
    }

    const authorHandle = videoDetails.authorUsername.toLowerCase();
    const verifiedHandle = verifiedAccount.username.toLowerCase();

    if (authorHandle !== verifiedHandle) {
      SendError(
        res,
        `Video ini milik akun @${videoDetails.authorUsername}, bukan akun TikTok Anda (@${verifiedAccount.username}).`,
        400,
      );
      return;
    }

    SendSuccess(res, videoDetails, 'Tautan video valid.');
  } catch (err) {
    next(err);
  }
}
