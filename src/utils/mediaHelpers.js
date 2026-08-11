import {
  saveMediaBlob,
  saveMedia,
  getMediaBlob,
  deleteMedia,
  getAllMediaRecords,
} from './mediaStore';

export const MEDIA_PREFIX = 'idb:';

export const isMediaKey = (val) => typeof val === 'string' && val.startsWith(MEDIA_PREFIX);

export const stripMediaPrefix = (val) =>
  isMediaKey(val) ? val.slice(MEDIA_PREFIX.length) : val;

export const makeMediaKey = (id) => `${MEDIA_PREFIX}${id}`;

/** In-memory blob URL cache — avoids re-creating URLs and fixes video reload issues */
const blobUrlCache = new Map();

const MIME_TO_EXT = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/x-matroska': 'mkv',
  'video/mpeg': 'mpeg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const getExtFromMime = (mime) => {
  if (!mime) return 'bin';
  if (MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
  const parts = mime.split('/');
  return parts[1]?.split(';')[0] || 'bin';
};

/** Upload any file type to IndexedDB as a Blob — returns { key, mimeType } */
export const uploadMediaFile = async (file) => {
  const id = `media_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const mimeType = file.type || 'application/octet-stream';
  await saveMediaBlob(id, file, mimeType);
  return { key: makeMediaKey(id), mimeType };
};

/** Resolve idb key, static path, or URL to a playable src */
export const resolveMediaUrl = async (value) => {
  if (!value) return null;

  if (isMediaKey(value)) {
    if (blobUrlCache.has(value)) return blobUrlCache.get(value);

    const media = await getMediaBlob(stripMediaPrefix(value));
    if (!media?.blob) return null;

    const url = URL.createObjectURL(media.blob);
    blobUrlCache.set(value, url);
    return url;
  }

  // Deployed static media in public/media/
  if (value.startsWith('/media/') || value.startsWith('media/')) {
    return value.startsWith('/') ? value : `/${value}`;
  }

  return value;
};

/** Get MIME type for a stored media key */
export const resolveMediaMime = async (value) => {
  if (!value || !isMediaKey(value)) return null;
  const media = await getMediaBlob(stripMediaPrefix(value));
  return media?.mimeType || null;
};

export const revokeMediaUrl = (value) => {
  if (isMediaKey(value) && blobUrlCache.has(value)) {
    URL.revokeObjectURL(blobUrlCache.get(value));
    blobUrlCache.delete(value);
  }
};

export const clearBlobUrlCache = () => {
  blobUrlCache.forEach((url) => URL.revokeObjectURL(url));
  blobUrlCache.clear();
};

/** Migrate inline data URLs to IndexedDB */
export const migrateDataUrlToIndexedDB = async (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  const id = `migrated_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await saveMediaBlob(id, blob, blob.type);
  return makeMediaKey(id);
};

export const isLargeDataUrl = (value) =>
  typeof value === 'string' && value.startsWith('data:') && value.length > 50000;

export const migrateLargeMediaInObject = async (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => migrateLargeMediaInObject(item)));
  }
  const copy = { ...obj };
  for (const key of Object.keys(copy)) {
    const val = copy[key];
    if (typeof val === 'string' && isLargeDataUrl(val)) {
      copy[key] = await migrateDataUrlToIndexedDB(val);
    } else if (typeof val === 'object' && val !== null) {
      copy[key] = await migrateLargeMediaInObject(val);
    }
  }
  return copy;
};

/** Collect all idb: media keys from siteData */
export const collectMediaKeys = (obj, keys = new Set()) => {
  if (!obj || typeof obj !== 'object') return keys;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectMediaKeys(item, keys));
    return keys;
  }
  for (const val of Object.values(obj)) {
    if (typeof val === 'string' && isMediaKey(val)) {
      keys.add(val);
    } else if (typeof val === 'object' && val !== null) {
      collectMediaKeys(val, keys);
    }
  }
  return keys;
};

/** Export siteData with /media/ paths for static deployment */
export const buildPublishData = async (siteData) => {
  const mediaKeys = collectMediaKeys(siteData);
  const keyToPath = new Map();
  const filesToDownload = [];

  for (const mediaKey of mediaKeys) {
    const id = stripMediaPrefix(mediaKey);
    const media = await getMediaBlob(id);
    if (!media) continue;
    const ext = getExtFromMime(media.mimeType);
    const filename = `${id}.${ext}`;
    const publicPath = `/media/${filename}`;
    keyToPath.set(mediaKey, publicPath);
    filesToDownload.push({ filename, blob: media.blob });
  }

  const replaceKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(replaceKeys);
    const copy = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && keyToPath.has(v)) {
        copy[k] = keyToPath.get(v);
      } else if (typeof v === 'object' && v !== null) {
        copy[k] = replaceKeys(v);
      } else {
        copy[k] = v;
      }
    }
    return copy;
  };

  return {
    publishData: replaceKeys(JSON.parse(JSON.stringify(siteData))),
    filesToDownload,
  };
};

export { deleteMedia, getAllMediaRecords, saveMedia };
