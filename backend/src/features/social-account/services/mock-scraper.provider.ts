import { Platform } from '../../../generated/prisma/enums.js';
import { prisma } from '../../../utils/prisma.js';
import type {
  ISocialScraperProvider,
  SocialUserProfile,
  SocialVideoItem,
} from './social-scraper.interface.js';

/**
 * Mock implementation of ISocialScraperProvider for local development and testing.
 * Automatically mirrors pending verification codes so local verification tests succeed reliably.
 */
export class MockSocialScraperProvider implements ISocialScraperProvider {
  /**
   * Retrieves a mock TikTok user profile.
   * If a pending verification code exists in the database for this username,
   * it dynamically injects the code into the bioDescription so verification passes.
   *
   * @param platform - Social media platform.
   * @param username - Clean username handle without '@'.
   * @returns Simulated SocialUserProfile object.
   */
  public async GetUserProfile(platform: Platform, username: string): Promise<SocialUserProfile> {
    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();

    // Check if there is an active pending verification code for this account
    const pendingAccount = await prisma.creatorSocialAccount.findFirst({
      where: {
        platform,
        username: cleanUsername,
      },
    });

    const bioCodeSnippet = pendingAccount?.verificationCode
      ? ` [${pendingAccount.verificationCode}]`
      : ' [KD-MOCK]';

    const mockProfile: SocialUserProfile = {
      username: cleanUsername,
      platformUserId: `tt_${cleanUsername}_998811`,
      displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      followersCount: 48500,
      bioDescription: `Daily lifestyle & product review creator ✨ DM for paid collaborations${bioCodeSnippet}`,
    };

    return mockProfile;
  }

  /**
   * Generates a realistic mock gallery of recent TikTok videos for the user.
   *
   * @param _platform - Social media platform.
   * @param username - Clean username handle without '@'.
   * @param limit - Max number of items to return.
   * @returns Array of mock SocialVideoItem.
   */
  public async GetUserRecentVideos(
    _platform: Platform,
    username: string,
    limit = 6,
  ): Promise<SocialVideoItem[]> {
    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();

    const sampleCaptions = [
      'Gak nyangka nemu produk sekeren ini! Wajib coba guys 🔥 #viral #fyp #review',
      'Honest review setelah pemakaian 2 minggu, beneran ngefek? Simak yuk! #racunshopee #lifestyle',
      'Rekomendasi terbaik buat kalian yang mau upgrade setup harian 🚀 #gadgets #tech #indonesia',
      'Tips hemat & praktis buat daily routine kamu ✨ #tipsandtricks #dailyvlog #trending',
      'Spill rahasia yang banyak ditanyain di komen kemarin! Check out keranjang kuning 💛 #rekomendasi',
      'Day in my life as a full-time content creator 🎬☕ #vlog #creatorday #aesthetic',
    ];

    const sampleThumbnails = [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
    ];

    const count = Math.min(limit, sampleCaptions.length);
    const mockVideos: SocialVideoItem[] = [];

    for (let i = 0; i < count; i++) {
      const videoId = `734509182374619${i + 1}0`;
      const publishedDaysAgo = (i + 1) * 2;
      const publishedAt = new Date(Date.now() - publishedDaysAgo * 24 * 60 * 60 * 1000);

      mockVideos.push({
        id: videoId,
        url: `https://www.tiktok.com/@${cleanUsername}/video/${videoId}`,
        authorUsername: cleanUsername,
        title: sampleCaptions[i]?.slice(0, 40),
        caption: sampleCaptions[i],
        thumbnailUrl: sampleThumbnails[i],
        viewCount: 15400 * (count - i) + 3200,
        likeCount: 1820 * (count - i) + 140,
        commentCount: 94 * (count - i) + 12,
        shareCount: 45 * (count - i) + 8,
        publishedAt,
      });
    }

    return mockVideos;
  }

  /**
   * Resolves details for a specific TikTok video link in mock mode.
   *
   * @param _platform - Social media platform.
   * @param videoUrl - Target video URL.
   * @returns Extracted video metadata.
   */
  public async GetVideoDetails(_platform: Platform, videoUrl: string): Promise<SocialVideoItem> {
    const usernameMatch = videoUrl.match(/tiktok\.com\/@([^/?#]+)/i);
    const idMatch = videoUrl.match(/\/video\/(\d+)/i);

    let authorUsername = usernameMatch ? usernameMatch[1]!.toLowerCase() : '';
    if (!authorUsername) {
      const fallbackAccount = await prisma.creatorSocialAccount.findFirst({
        where: { isVerified: true, status: 'ACTIVE' },
        orderBy: { updatedAt: 'desc' },
      });
      authorUsername = fallbackAccount?.username || 'creator';
    }
    const videoId = idMatch ? idMatch[1]! : '73450918237461910';

    const videoItem: SocialVideoItem = {
      id: videoId,
      url: videoUrl,
      authorUsername,
      title: 'Klipday Campaign Submission Video',
      caption: 'Klipday video review & clipping showcase! #klipday #review #viral',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      viewCount: 28400,
      likeCount: 3120,
      commentCount: 152,
      shareCount: 68,
      publishedAt: new Date(),
    };

    return videoItem;
  }
}
