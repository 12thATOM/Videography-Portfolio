/**
 * IndexedDB media store — stores Blobs for reliable video/image playback.
 * Legacy dataUrl entries are still supported for backward compatibility.
 */

const DB_NAME = 'AdityaTomarPortfolioMedia';
const DB_VERSION = 2;
const STORE_NAME = 'media';

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = (e) => {
      console.error('IndexedDB open error:', e);
      reject(e);
    };
  });
};

/** Save a File/Blob directly (preferred for videos) */
export const saveMediaBlob = async (key, blob, mimeType = '') => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, blob, mimeType: mimeType || blob.type || 'application/octet-stream' });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};

/** Legacy: save as data URL string */
export const saveMedia = async (key, dataUrl) => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, dataUrl });
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};

/** Retrieve stored media as { blob, mimeType } */
export const getMediaBlob = async (key) => {
  try {
    const database = await openDB();
    const record = await new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e);
    });

    if (!record) return null;

    if (record.blob) {
      return { blob: record.blob, mimeType: record.mimeType || record.blob.type || '' };
    }

    // Legacy dataUrl support
    if (record.dataUrl) {
      const res = await fetch(record.dataUrl);
      const blob = await res.blob();
      return { blob, mimeType: blob.type || record.mimeType || '' };
    }

    return null;
  } catch (err) {
    console.error('getMediaBlob error:', err);
    return null;
  }
};

export const getMedia = async (key) => {
  const media = await getMediaBlob(key);
  if (!media) return null;
  return URL.createObjectURL(media.blob);
};

export const deleteMedia = async (key) => {
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e);
    });
  } catch (err) {
    console.error('deleteMedia error:', err);
  }
};

export const getAllMediaKeys = async () => {
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e);
    });
  } catch (err) {
    return [];
  }
};

export const getAllMediaRecords = async () => {
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e);
    });
  } catch (err) {
    return [];
  }
};
