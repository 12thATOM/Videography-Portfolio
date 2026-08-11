import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const BUCKET_NAME = 'Portfolio-media';

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/x-matroska': 'mkv',
  'video/ogg': 'ogv',
};

const getExt = (file) => {
  if (file.name && file.name.includes('.')) {
    return file.name.split('.').pop().toLowerCase();
  }
  const mime = file.type || 'application/octet-stream';
  return MIME_TO_EXT[mime] || mime.split('/')[1]?.split(';')[0] || 'bin';
};

export const isSupabaseStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes(`/storage/v1/object/public/${BUCKET_NAME}/`);
};

export const getStoragePathFromUrl = (publicUrl) => {
  if (!isSupabaseStorageUrl(publicUrl)) return null;
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
};

export const getPublicUrl = (storagePath) => {
  if (!supabase) return null;
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data.publicUrl;
};

export const uploadToSupabaseStorage = async (file, folder = 'misc') => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const ext = getExt(file);
  const prefix = folder.replace(/\/$/, '');
  const filename = `${prefix.split('/').pop()}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const storagePath = `${prefix}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    throw uploadError;
  }

  const publicUrl = getPublicUrl(storagePath);

  const { error: registryError } = await supabase.from('media_registry').insert({
    storage_path: storagePath,
    public_url: publicUrl,
    mime_type: file.type || null,
    file_size: file.size || null,
  });

  if (registryError) {
    console.warn('media_registry insert failed:', registryError);
  }

  return { key: publicUrl, mimeType: file.type || 'application/octet-stream', storagePath };
};

export const deleteFromSupabaseStorage = async (publicUrl) => {
  if (!isSupabaseConfigured || !supabase || !publicUrl) return;
  if (!isSupabaseStorageUrl(publicUrl)) return;

  const storagePath = getStoragePathFromUrl(publicUrl);
  if (!storagePath) return;

  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (storageError) {
    console.error('Supabase delete error:', storageError);
    throw storageError;
  }

  const { error: registryError } = await supabase
    .from('media_registry')
    .delete()
    .eq('storage_path', storagePath);

  if (registryError) {
    console.warn('media_registry delete failed:', registryError);
  }
};

export const deleteMediaUrls = async (urls = []) => {
  const unique = [...new Set(urls.filter(isSupabaseStorageUrl))];
  await Promise.all(unique.map((url) => deleteFromSupabaseStorage(url)));
};

export const collectMediaUrlsFromItem = (item) => {
  if (!item || typeof item !== 'object') return [];
  const urls = [];
  if (item.url) urls.push(item.url);
  if (item.videoUrl) urls.push(item.videoUrl);
  if (item.poster) urls.push(item.poster);
  if (item.coverImage) urls.push(item.coverImage);
  return urls;
};
