import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  CAMPAIGN_MESSAGES,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../src/features/campaign/campaign.constants.js';
import {
  DeleteCampaign,
  EditCampaign,
  GetCampaignById,
  GetCampaigns,
  GetCampaignStatusCounts,
  GetFeaturedCampaigns,
  InitializeCampaign,
  SubmitCampaign,
} from '../src/features/campaign/campaign.handlers.js';
import {
  ValidateCampaignDateLogic,
  ValidateCampaignEditBody,
  ValidateCampaignQuery,
  ValidateCampaignRewardLogic,
  ValidateCampaignSubmitCompleteness,
} from '../src/features/campaign/campaign.validators.js';
import {
  CampaignStatus,
  CampaignType,
  Category,
  Industry,
  MaterialType,
  Platform,
  Role,
  Status,
} from '../src/generated/prisma/enums.js';
import { prisma } from '../src/utils/prisma.js';
import {
  CreateMockNext,
  CreateMockRequest,
  CreateMockResponse,
} from './helpers/mock-express.js';

describe('Campaign Feature Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBrand = {
    id: 'brand-test-123',
    accountId: 'acc-brand-123',
    companyName: 'PT Brand Testing',
    industry: Industry.TECHNOLOGY,
    status: Status.ACTIVE,
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const sampleCompleteCampaign = {
    id: 'camp-123',
    title: 'Awesome Campaign',
    description: 'Campaign description for testing',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    mainMediaUrl: 'https://example.com/video.mp4',
    campaignType: CampaignType.PRODUCT,
    campaignCategory: Category.TECHNOLOGY_GADGETS,
    platform: Platform.TIKTOK,
    cpm: 50000,
    budget: 500000,
    minViews: 1000,
    maxViews: 10000,
    startDate: tomorrow,
    endDate: nextWeek,
    status: Status.ACTIVE,
    campaignStatus: CampaignStatus.DRAFT,
    materials: [
      {
        id: 'mat-1',
        name: 'Logo Video',
        type: MaterialType.VIDEO,
        url: 'https://example.com/mat.mp4',
        status: Status.ACTIVE,
      },
    ],
    brief: {
      id: 'brief-1',
      purpose: 'Brand awareness',
      keyMessage: 'Fast and reliable',
      callToAction: 'Check link in bio',
      status: Status.ACTIVE,
    },
    brand: {
      id: mockBrand.id,
      companyName: mockBrand.companyName,
      industry: mockBrand.industry,
    },
    _count: {
      submissions: 5,
    },
  };

  // ===========================================================================
  // 1. Validation & Logic Unit Tests
  // ===========================================================================
  describe('Validation & Domain Logic Suite', () => {
    describe('ValidateCampaignRewardLogic', () => {
      it('returns error when maxViews is less than minViews', () => {
        const error = ValidateCampaignRewardLogic({
          minViews: 1000,
          maxViews: 500,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.REWARD_MAX_LESS_THAN_MIN);
      });

      it('returns error when budget is less than CPM', () => {
        const error = ValidateCampaignRewardLogic({
          cpm: 100000,
          budget: 50000,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.REWARD_BUDGET_LESS_THAN_CPM);
      });

      it('passes when reward parameters are valid', () => {
        const error = ValidateCampaignRewardLogic({
          minViews: 1000,
          maxViews: 5000,
          cpm: 50000,
          budget: 500000,
        });
        expect(error).toBeNull();
      });
    });

    describe('ValidateCampaignDateLogic', () => {
      it('returns error when startDate is in the past', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 2);

        const error = ValidateCampaignDateLogic({
          startDate: yesterday,
          endDate: nextWeek,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.DATE_START_PAST);
      });

      it('returns error when endDate is before or equal to startDate', () => {
        const error = ValidateCampaignDateLogic({
          startDate: nextWeek,
          endDate: tomorrow,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.DATE_END_BEFORE_START);
      });

      it('passes when dates are valid future dates with endDate > startDate', () => {
        const error = ValidateCampaignDateLogic({
          startDate: tomorrow,
          endDate: nextWeek,
        });
        expect(error).toBeNull();
      });
    });

    describe('ValidateCampaignSubmitCompleteness', () => {
      it('returns error when Step 1 basic info is incomplete', () => {
        const error = ValidateCampaignSubmitCompleteness({
          ...sampleCompleteCampaign,
          title: '',
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.STEP_1_INCOMPLETE);
      });

      it('returns error when Step 2 materials are missing', () => {
        const error = ValidateCampaignSubmitCompleteness({
          ...sampleCompleteCampaign,
          materials: [],
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.STEP_2_NO_MATERIALS);
      });

      it('returns error when Step 3 brief is missing', () => {
        const error = ValidateCampaignSubmitCompleteness({
          ...sampleCompleteCampaign,
          brief: null,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.STEP_3_NO_BRIEF);
      });

      it('returns error when Step 4 budget is less than CPM', () => {
        const error = ValidateCampaignSubmitCompleteness({
          ...sampleCompleteCampaign,
          cpm: 100000,
          budget: 50000,
        });
        expect(error).toBe(CAMPAIGN_MESSAGES.STEP_4_INVALID_BUDGET);
      });

      it('passes when all 4 steps are fully completed', () => {
        const error = ValidateCampaignSubmitCompleteness(sampleCompleteCampaign as never);
        expect(error).toBeNull();
      });
    });

    describe('ValidateCampaignQuery', () => {
      it('parses valid query parameters with pagination and filters', () => {
        const result = ValidateCampaignQuery({
          page: '2',
          limit: '20',
          category: Category.TECHNOLOGY_GADGETS,
          sort: 'highest_cpm',
        });
        expect(typeof result).toBe('object');
        if (typeof result === 'object') {
          expect(result.page).toBe(2);
          expect(result.limit).toBe(20);
          expect(result.category).toBe(Category.TECHNOLOGY_GADGETS);
          expect(result.sort).toBe('highest_cpm');
        }
      });

      it('returns error string on invalid sort parameter', () => {
        const result = ValidateCampaignQuery({ sort: 'invalid-sort' });
        expect(typeof result).toBe('string');
      });
    });
  });

  // ===========================================================================
  // 2. Handler Unit Tests
  // ===========================================================================
  describe('Handler Unit Tests', () => {
    describe('InitializeCampaign', () => {
      it('creates empty draft campaign for authenticated brand (201)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest.spyOn(prisma.brand, 'findFirst').mockResolvedValue(mockBrand as never);
        jest.spyOn(prisma.campaign, 'create').mockResolvedValue({ id: 'new-camp-1' } as never);

        await InitializeCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: { id: 'new-camp-1' },
          message: CAMPAIGN_MESSAGES.INITIALIZE_SUCCESS,
        });
      });

      it('rejects non-brand accounts with 403 Forbidden', async () => {
        const req = CreateMockRequest({
          account: { sub: 'creator-acc', role: Role.CREATOR },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        await InitializeCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.ONLY_BRANDS_CAN_CREATE,
        });
      });
    });

    describe('EditCampaign', () => {
      it('updates campaign fields when request is valid (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
          body: { title: 'Updated Title' },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma.campaign, 'findFirst')
          .mockResolvedValue(sampleCompleteCampaign as never);
        jest
          .spyOn(prisma.campaign, 'update')
          .mockResolvedValue({ ...sampleCompleteCampaign, title: 'Updated Title' } as never);

        await EditCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: expect.objectContaining({ title: 'Updated Title' }),
          message: CAMPAIGN_MESSAGES.UPDATE_SUCCESS,
        });
      });

      it('returns 404 when campaign is not found or not owned by brand', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: 'unknown-id' },
          body: { title: 'Title' },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest.spyOn(prisma.campaign, 'findFirst').mockResolvedValue(null);

        await EditCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND,
        });
      });

      it('returns 400 when reward logic fails (budget < cpm)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
          body: { cpm: 200000, budget: 100000 },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma.campaign, 'findFirst')
          .mockResolvedValue(sampleCompleteCampaign as never);

        await EditCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.REWARD_BUDGET_LESS_THAN_CPM,
        });
      });
    });

    describe('SubmitCampaign', () => {
      it('submits complete campaign and transitions to IN_REVIEW (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma.campaign, 'findFirst')
          .mockResolvedValue(sampleCompleteCampaign as never);
        jest.spyOn(prisma.campaign, 'update').mockResolvedValue({
          ...sampleCompleteCampaign,
          campaignStatus: CampaignStatus.IN_REVIEW,
        } as never);

        await SubmitCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: expect.objectContaining({ campaignStatus: CampaignStatus.IN_REVIEW }),
          message: CAMPAIGN_MESSAGES.SUBMIT_SUCCESS,
        });
      });

      it('rejects submission if campaign is already ACTIVE or IN_REVIEW (400)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest.spyOn(prisma.campaign, 'findFirst').mockResolvedValue({
          ...sampleCompleteCampaign,
          campaignStatus: CampaignStatus.ACTIVE,
        } as never);

        await SubmitCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.CANNOT_SUBMIT_CURRENT_STATUS,
        });
      });
    });

    describe('GetCampaigns', () => {
      it('returns paginated campaigns list (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          query: { page: '1', limit: '10' },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma, '$transaction')
          .mockResolvedValue([[sampleCompleteCampaign], 1] as never);

        await GetCampaigns(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: {
            items: [sampleCompleteCampaign],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
          message: CAMPAIGN_MESSAGES.RETRIEVED_SUCCESS,
        });
      });
    });

    describe('GetFeaturedCampaigns', () => {
      it('returns featured campaigns with backfill when count is less than 3 (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: 'user-123', role: Role.CREATOR },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        const featuredOne = { ...sampleCompleteCampaign, isFeatured: true };
        const backfillOne = { ...sampleCompleteCampaign, id: 'camp-backfill-1' };

        jest
          .spyOn(prisma.campaign, 'findMany')
          .mockResolvedValueOnce([featuredOne] as never)
          .mockResolvedValueOnce([backfillOne] as never);

        await GetFeaturedCampaigns(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: [featuredOne, backfillOne],
          message: CAMPAIGN_MESSAGES.FEATURED_RETRIEVED_SUCCESS,
        });
      });
    });

    describe('GetCampaignStatusCounts', () => {
      it('returns aggregated status counts for brand (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        const groupedResults = [
          { campaignStatus: CampaignStatus.DRAFT, _count: { _all: 3 } },
          { campaignStatus: CampaignStatus.ACTIVE, _count: { _all: 5 } },
        ];

        jest.spyOn(prisma.campaign, 'groupBy').mockResolvedValue(groupedResults as never);

        await GetCampaignStatusCounts(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: expect.objectContaining({
            [CampaignStatus.DRAFT]: 3,
            [CampaignStatus.ACTIVE]: 5,
            [CampaignStatus.IN_REVIEW]: 0,
          }),
          message: CAMPAIGN_MESSAGES.STATUS_COUNTS_RETRIEVED_SUCCESS,
        });
      });
    });

    describe('GetCampaignById', () => {
      it('returns campaign detail for brand owner (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma.campaign, 'findFirst')
          .mockResolvedValue(sampleCompleteCampaign as never);

        await GetCampaignById(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: sampleCompleteCampaign,
          message: CAMPAIGN_MESSAGES.DETAIL_RETRIEVED_SUCCESS,
        });
      });

      it('returns 404 when campaign does not exist or is inactive', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: 'non-existent' },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest.spyOn(prisma.campaign, 'findFirst').mockResolvedValue(null);

        await GetCampaignById(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND,
        });
      });
    });

    describe('DeleteCampaign', () => {
      it('performs atomic cascade soft-delete on campaign and relations (200)', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: sampleCompleteCampaign.id },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest
          .spyOn(prisma.campaign, 'findFirst')
          .mockResolvedValue({ id: sampleCompleteCampaign.id } as never);

        jest.spyOn(prisma, '$transaction').mockResolvedValue([
          { id: sampleCompleteCampaign.id, status: Status.DELETED },
          { count: 1 },
          { count: 1 },
          { count: 0 },
        ] as never);

        await DeleteCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'success',
          data: null,
          message: CAMPAIGN_MESSAGES.DELETE_SUCCESS,
        });
      });

      it('returns 404 if campaign is not owned by the brand', async () => {
        const req = CreateMockRequest({
          account: { sub: mockBrand.accountId, role: Role.BRAND },
          params: { id: 'other-brand-campaign' },
        });
        const { res, statusMock, jsonMock } = CreateMockResponse();
        const next = CreateMockNext();

        jest.spyOn(prisma.campaign, 'findFirst').mockResolvedValue(null);

        await DeleteCampaign(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
          status: 'error',
          data: null,
          message: CAMPAIGN_MESSAGES.CAMPAIGN_NOT_FOUND,
        });
      });
    });
  });
});
