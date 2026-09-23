import { Platform } from '../../../generated/prisma/enums.js';
import type {
  ISocialScraperProvider,
  SocialUserProfile,
  SocialVideoItem,
} from './social-scraper.interface.js';

interface ScrapeCreatorsProfileResponse {
  user?: {
    uniqueId?: string;
    id?: string;
    nickname?: string;
    avatarLarger?: string;
    avatarThumb?: string;
    signature?: string;
  };
  stats?: {
    followerCount?: number;
    followingCount?: number;
    heartCount?: number;
    videoCount?: number;
  };
}

interface ScrapeCreatorsAwemeItem {
  aweme_id?: string;
  desc?: string;
  create_time?: number;
  author?: {
    unique_id?: string;
    nickname?: string;
    uid?: string;
  };
  video?: {
    cover?: {
      url_list?: string[];
    };
    origin_cover?: {
      url_list?: string[];
    };
    dynamic_cover?: {
      url_list?: string[];
    };
  };
  statistics?: {
    play_count?: number;
    digg_count?: number;
    comment_count?: number;
    share_count?: number;
  };
  share_url?: string;
}

interface ScrapeCreatorsV3VideosResponse {
  success?: boolean;
  aweme_list?: ScrapeCreatorsAwemeItem[];
}

interface ScrapeCreatorsV2VideoDetailsResponse {
  success?: boolean;
  aweme_detail?: ScrapeCreatorsAwemeItem;
}

/**
 * Selects the best image URL from TikTok CDN's list.
 * Prioritizes standard web formats (jpeg, jpg, webp, png) over iOS-specific .heic
 * so that thumbnails render cleanly in all web browsers without broken image icons.
 *
 * @param urlList - Array of candidate image URLs from TikTok CDN.
 * @returns Best candidate URL, or undefined.
 */
function ExtractBestCoverUrl(urlList?: string[]): string | undefined {
  if (!urlList || urlList.length === 0) return undefined;
  const webImage = urlList.find((url) => /\.(jpeg|jpg|webp|png)(\?|$)/i.test(url));
  return webImage || urlList[0];
}

/**
 * Expands shortened TikTok links (vt.tiktok.com / vm.tiktok.com) to their full canonical web URL.
 *
 * @param url - Raw video URL entered by the user.
 * @returns Resolved full URL or the original URL if not shortened.
 */
async function ResolveTikTokUrl(url: string): Promise<string> {
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('vt.tiktok.com') || trimmedUrl.includes('vm.tiktok.com')) {
    try {
      const response = await fetch(trimmedUrl, {
        method: 'HEAD',
        redirect: 'follow',
      });
      return response.url || trimmedUrl;
    } catch {
      return trimmedUrl;
    }
  }
  return trimmedUrl;
}

/**
 * Production-ready ScrapeCreators provider for TikTok data scraping.
 * Communicates with the ScrapeCreators REST API using the configured SCRAPECREATORS_API_KEY.
 */
export class ScrapeCreatorsProvider implements ISocialScraperProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.scrapecreators.com';

  public constructor(apiKey?: string) {
    const key = apiKey ?? process.env.SCRAPECREATORS_API_KEY;
    if (!key) {
      throw new Error('SCRAPECREATORS_API_KEY is not configured in the environment.');
    }
    this.apiKey = key;
  }

  /**
   * Retrieves profile data from ScrapeCreators for a TikTok user.
   *
   * @param _platform - Social platform (TIKTOK).
   * @param username - Clean username handle without '@'.
   * @returns Normalized user profile.
   */
  public async GetUserProfile(_platform: Platform, username: string): Promise<SocialUserProfile> {
    const cleanHandle = username.replace(/^@/, '').toLowerCase().trim();
    const targetUrl = `${this.baseUrl}/v1/tiktok/profile?handle=${encodeURIComponent(cleanHandle)}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ScrapeCreators API error: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as ScrapeCreatorsProfileResponse;
    const user = payload.user;
    const stats = payload.stats;

    const profile: SocialUserProfile = {
      username: user?.uniqueId?.toLowerCase() || cleanHandle,
      platformUserId: user?.id,
      displayName: user?.nickname || cleanHandle,
      avatarUrl: user?.avatarLarger || user?.avatarThumb,
      followersCount: stats?.followerCount ?? 0,
      bioDescription: user?.signature || '',
    };

    return profile;
  }

  /**
   * Retrieves latest public TikTok videos for a user using ScrapeCreators v3 profile/videos.
   *
   * @param _platform - Social platform.
   * @param username - Clean username handle without '@'.
   * @param limit - Maximum items to retrieve.
   * @returns Array of normalized video items.
   */
  public async GetUserRecentVideos(
    _platform: Platform,
    username: string,
    limit = 12,
  ): Promise<SocialVideoItem[]> {
    const cleanHandle = username.replace(/^@/, '').toLowerCase().trim();
    const targetUrl = `${this.baseUrl}/v3/tiktok/profile/videos?handle=${encodeURIComponent(cleanHandle)}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ScrapeCreators API error: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as ScrapeCreatorsV3VideosResponse;
    const items = (payload.aweme_list || []).slice(0, limit);

    const videos: SocialVideoItem[] = items.map((item) => {
      const videoId = item.aweme_id || '';
      const authorHandle = item.author?.unique_id?.toLowerCase() || cleanHandle;
      const publishedAt = item.create_time ? new Date(item.create_time * 1000) : new Date();
      const thumbnailUrl =
        ExtractBestCoverUrl(item.video?.cover?.url_list) ||
        ExtractBestCoverUrl(item.video?.origin_cover?.url_list) ||
        ExtractBestCoverUrl(item.video?.dynamic_cover?.url_list);

      return {
        id: videoId,
        url: `https://www.tiktok.com/@${authorHandle}/video/${videoId}`,
        authorUsername: authorHandle,
        title: item.desc?.slice(0, 40) || 'TikTok Video',
        caption: item.desc || '',
        thumbnailUrl,
        viewCount: item.statistics?.play_count ?? 0,
        likeCount: item.statistics?.digg_count ?? 0,
        commentCount: item.statistics?.comment_count ?? 0,
        shareCount: item.statistics?.share_count ?? 0,
        publishedAt,
      };
    });

    return videos;
  }

  /**
   * Retrieves specific video details given a TikTok URL using ScrapeCreators v2 video.
   *
   * @param _platform - Social platform.
   * @param videoUrl - Public video URL.
   * @returns Video metadata.
   */
  public async GetVideoDetails(_platform: Platform, videoUrl: string): Promise<SocialVideoItem> {
    const resolvedUrl = await ResolveTikTokUrl(videoUrl);
    const targetUrl = `${this.baseUrl}/v2/tiktok/video?url=${encodeURIComponent(resolvedUrl)}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ScrapeCreators API error: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as ScrapeCreatorsV2VideoDetailsResponse;
    const item = payload.aweme_detail;

    if (!item || !item.aweme_id) {
      throw new Error('Video details could not be resolved from URL.');
    }

    const videoId = item.aweme_id;
    const authorHandle = item.author?.unique_id?.toLowerCase() || '';
    const publishedAt = item.create_time ? new Date(item.create_time * 1000) : new Date();
    const thumbnailUrl =
      ExtractBestCoverUrl(item.video?.cover?.url_list) ||
      ExtractBestCoverUrl(item.video?.origin_cover?.url_list) ||
      ExtractBestCoverUrl(item.video?.dynamic_cover?.url_list);

    const video: SocialVideoItem = {
      id: videoId,
      url: `https://www.tiktok.com/@${authorHandle}/video/${videoId}`,
      authorUsername: authorHandle,
      title: item.desc?.slice(0, 40) || 'TikTok Video',
      caption: item.desc || '',
      thumbnailUrl,
      viewCount: item.statistics?.play_count ?? 0,
      likeCount: item.statistics?.digg_count ?? 0,
      commentCount: item.statistics?.comment_count ?? 0,
      shareCount: item.statistics?.share_count ?? 0,
      publishedAt,
    };

    return video;
  }
}
