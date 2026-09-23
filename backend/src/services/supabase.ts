/**
 * Configuration helper for Supabase Storage.
 */
function GetSupabaseStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'campaign_thumbnails';

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const cleanUrl = supabaseUrl.replace(/\/+$/, '');
  const config = {
    supabaseUrl: cleanUrl,
    serviceRoleKey,
    bucket,
  };

  return config;
}

/**
 * Uploads a raw buffer to Supabase Storage and returns its permanent public URL.
 *
 * @param path - Destination storage path (e.g. 'avatars/creator-123.jpg').
 * @param buffer - File contents as ArrayBuffer or Buffer.
 * @param contentType - MIME type of the file.
 * @returns Public URL string or null on failure.
 */
export async function UploadToSupabaseStorage(
  path: string,
  buffer: ArrayBuffer | Buffer,
  contentType: string,
): Promise<string | null> {
  const config = GetSupabaseStorageConfig();
  if (!config) {
    return null;
  }

  const targetUrl = `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${path}`;

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.serviceRoleKey}`,
      apikey: config.serviceRoleKey,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.warn(`[Supabase Storage] Upload failed (${response.status}):`, errorText);
    return null;
  }

  const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/${config.bucket}/${path}`;
  return publicUrl;
}

/**
 * Downloads an image from an external URL (e.g. TikTok CDN) and persists it permanently to Supabase Storage.
 * Generates a permanent public asset URL that avoids CDN link expiry.
 *
 * @param avatarSourceUrl - Ephemeral source image URL.
 * @param creatorId - Creator database identifier.
 * @param platform - Social media platform name.
 * @param username - Clean username handle.
 * @returns Permanent public Supabase storage URL or null if failed.
 */
export async function PersistSocialAvatarToStorage(
  avatarSourceUrl: string,
  creatorId: string,
  platform: string,
  username: string,
): Promise<string | null> {
  const config = GetSupabaseStorageConfig();
  if (!config) {
    return null;
  }

  // If already hosted on Supabase Storage, reuse existing permanent URL
  if (avatarSourceUrl.includes(config.supabaseUrl) || avatarSourceUrl.includes('supabase.co')) {
    return avatarSourceUrl;
  }

  try {
    const downloadResponse = await fetch(avatarSourceUrl, {
      headers: {
        Accept: 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!downloadResponse.ok) {
      return null;
    }

    const imageBuffer = await downloadResponse.arrayBuffer();
    const contentType = downloadResponse.headers.get('content-type')?.split(';')[0].trim() || 'image/jpeg';
    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpeg';

    const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
    const cleanPlatform = platform.toLowerCase().trim();
    const storagePath = `avatars/${creatorId}-${cleanPlatform}-${cleanUsername}.${extension}`;

    const uploadedUrl = await UploadToSupabaseStorage(storagePath, imageBuffer, contentType);
    return uploadedUrl;
  } catch (err) {
    console.warn('[Supabase Storage] Failed to persist social avatar:', err);
    return null;
  }
}
