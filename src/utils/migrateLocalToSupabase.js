import { collectMediaKeys, stripMediaPrefix } from './mediaHelpers';
import { getMediaBlob } from './mediaStore';
import { uploadToSupabaseStorage } from './supabaseStorage';
import { savePortfolioToSupabase } from './supabasePortfolio';

const folderForKey = (keyPath, siteData) => {
  const json = JSON.stringify(siteData);
  if (json.indexOf(`"${keyPath}"`) === -1) {
    // fallback by scanning paths
  }

  if (siteData.hero?.bgImage === keyPath) return 'hero';
  if (siteData.about?.profileImage === keyPath) return 'profile';
  if (siteData.photographyPage?.coverImage === keyPath) return 'covers/photography';
  if (siteData.cinematicsPage?.coverImage === keyPath) return 'covers/cinematics';
  if (siteData.videographyPage?.coverImage === keyPath) return 'covers/videography';

  for (const card of siteData.featuredWork || []) {
    if (card.coverImage === keyPath) return 'covers/featured';
  }

  for (const photo of siteData.photographyPage?.photos || []) {
    if (photo.url === keyPath) return 'photos';
  }

  for (const vid of siteData.cinematicsPage?.videos || []) {
    if (vid.videoUrl === keyPath) return 'videos/cinematics';
    if (vid.poster === keyPath) return 'posters';
  }

  for (const vid of siteData.videographyPage?.videos || []) {
    if (vid.videoUrl === keyPath) return 'videos/videography';
    if (vid.poster === keyPath) return 'posters';
  }

  return 'misc';
};

const replaceInObject = (obj, keyPath, newUrl) => {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => replaceInObject(item, keyPath, newUrl));
    return;
  }
  for (const k of Object.keys(obj)) {
    if (obj[k] === keyPath) {
      obj[k] = newUrl;
    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
      replaceInObject(obj[k], keyPath, newUrl);
    }
  }
};

export const hasLocalMediaKeys = (siteData) => {
  return collectMediaKeys(siteData).size > 0;
};

export const migrateLocalToSupabase = async (siteData, onProgress) => {
  const copy = JSON.parse(JSON.stringify(siteData));
  const keys = [...collectMediaKeys(copy)];

  if (keys.length === 0) {
    await savePortfolioToSupabase(copy);
    return copy;
  }

  let done = 0;
  for (const mediaKey of keys) {
    const id = stripMediaPrefix(mediaKey);
    const media = await getMediaBlob(id);
    if (!media?.blob) {
      done += 1;
      onProgress?.({ done, total: keys.length, current: mediaKey, skipped: true });
      continue;
    }

    const folder = folderForKey(mediaKey, copy);
    const file = new File([media.blob], `${id}.${media.mimeType?.split('/')[1] || 'bin'}`, {
      type: media.mimeType || media.blob.type || 'application/octet-stream',
    });

    const uploaded = await uploadToSupabaseStorage(file, folder);
    replaceInObject(copy, mediaKey, uploaded.key);

    done += 1;
    onProgress?.({ done, total: keys.length, current: mediaKey, skipped: false });
  }

  await savePortfolioToSupabase(copy);
  return copy;
};
