import type { SubmissionStatus } from '../../generated/prisma/enums.js';
import type { SocialAccountDto } from '../social-account/social-account.types.js';

export interface SaveDraftSubmissionBody {
  liveVideoUrl?: string;
  thumbnailUrl?: string;
  videoCaption?: string;
  socialAccountId?: string;
}

export interface FinalSubmitVideoBody {
  liveVideoUrl?: string;
  thumbnailUrl?: string;
  videoCaption?: string;
  socialAccountId?: string;
}

export interface SubmissionDetailDto {
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
  earnings: string;
  submittedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialAccount?: SocialAccountDto | null;
}

export interface MySubmissionResponseData {
  submission: SubmissionDetailDto | null;
  socialAccount: SocialAccountDto | null;
}
