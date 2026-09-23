/**
 * Persists an ephemeral social media avatar (e.g. TikTok CDN) to Supabase Storage.
 * Generates a permanent public asset URL that never expires and avoids hotlinking/CORS issues.
 *
 * @param avatarSourceUrl - Ephemeral source image URL from social platform.
 * @param creatorId - Creator database identifier.
 * @param platform - Social platform enum or string.
 * @param username - Clean social username handle.
 * @returns Permanent public Supabase storage URL or null if upload fails.
 */
export async function PersistSocialAvatarToStorage(
  avatarSourceUrl: string,
  creatorId: string,
  platform: string,
  username: string,
): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'campaign_thumbnails';

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  // If already hosted on Supabase Storage, reuse existing permanent URL
  if (avatarSourceUrl.includes(supabaseUrl) || avatarSourceUrl.includes('supabase.co')) {
    return avatarSourceUrl;
  }

  try {
    const downloadResponse = await fetch(avatarSourceUrl, {
      method: 'GET',
      headers: {
        Accept: 'image/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!downloadResponse.ok) {
      return null;
    }

    const imageBuffer = await downloadResponse.arrayBuffer();
    const rawContentType = downloadResponse.headers.get('content-type') || 'image/jpeg';
    const cleanContentType = rawContentType.split(';')[0].trim();

    let extension = 'jpeg';
    if (cleanContentType.includes('png')) {
      extension = 'png';
    } else if (cleanContentType.includes('webp')) {
      extension = 'webp';
    }

    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
    const cleanPlatform = platform.toLowerCase().trim();
    const storagePath = `avatars/${creatorId}-${cleanPlatform}-${cleanUsername}.${extension}`;
    const targetUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/${bucket}/${storagePath}`;

    const uploadResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': cleanContentType,
        'x-upsert': 'true',
      },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.warn('[AvatarStorage] Failed to upload avatar to Supabase:', uploadResponse.status, errorText);
      return null;
    }

    const permanentUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/${storagePath}`;
    return permanentUrl;
  } catch (err) {
    console.warn('[AvatarStorage] Error downloading or persisting avatar:', err);
    return null;
  }
}
