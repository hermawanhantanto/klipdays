import type { Platform } from '../../../generated/prisma/enums.js';

/**
 * Normalized user profile contract returned by social media scrapers.
 */
export interface SocialUserProfile {
  /** The social handle / username without leading '@' */
  username: string;
  /** Platform-specific unique numerical user ID or sec_uid */
  platformUserId?: string;
  /** Display name shown on profile */
  displayName?: string;
  /** Avatar profile image URL */
  avatarUrl?: string;
  /** Total follower count */
  followersCount: number;
  /** Bio or description text on the user profile */
  bioDescription?: string;
}

/**
 * Normalized video metadata contract returned by social media scrapers.
 */
export interface SocialVideoItem {
  /** Unique video ID on the platform */
  id: string;
  /** Canonical public web URL of the video */
  url: string;
  /** Handle of the video author without '@' */
  authorUsername: string;
  /** Video title if present */
  title?: string;
  /** Video caption / description text */
  caption?: string;
  /** Cover thumbnail URL */
  thumbnailUrl?: string;
  /** Number of views / plays */
  viewCount?: number;
  /** Number of likes */
  likeCount?: number;
  /** Number of comments */
  commentCount?: number;
  /** Number of shares */
  shareCount?: number;
  /** Timestamp when video was published */
  publishedAt?: Date;
}

/**
 * Service provider interface for interacting with social media platforms
 * (e.g. ScrapeCreators, Apify, or local mock).
 */
export interface ISocialScraperProvider {
  /**
   * Retrieves public profile metadata and bio for a specific username.
   *
   * @param platform - Target platform (e.g. TIKTOK).
   * @param username - Social media handle without leading '@'.
   * @returns User profile details including bio and follower count.
   */
  GetUserProfile(platform: Platform, username: string): Promise<SocialUserProfile>;

  /**
   * Retrieves a list of recent public videos for a specific username.
   *
   * @param platform - Target platform (e.g. TIKTOK).
   * @param username - Social media handle without leading '@'.
   * @param limit - Optional maximum number of videos to return (default 12).
   * @returns Array of recent video items.
   */
  GetUserRecentVideos(platform: Platform, username: string, limit?: number): Promise<SocialVideoItem[]>;

  /**
   * Retrieves metadata for a specific public video URL.
   *
   * @param platform - Target platform (e.g. TIKTOK).
   * @param videoUrl - Full URL to the published video.
   * @returns Detailed video item metadata.
   */
  GetVideoDetails(platform: Platform, videoUrl: string): Promise<SocialVideoItem>;
}
