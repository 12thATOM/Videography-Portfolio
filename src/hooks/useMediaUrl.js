import { useState, useEffect } from 'react';
import { resolveMediaUrl, resolveMediaMime } from '../utils/mediaHelpers';

/** Resolves idb: keys, /media/ paths, or URLs to a usable src */
export const useMediaUrl = (value) => {
  const [url, setUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!value) {
      setUrl(null);
      setMimeType(null);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    Promise.all([resolveMediaUrl(value), resolveMediaMime(value)])
      .then(([resolved, mime]) => {
        if (!cancelled) {
          setUrl(resolved);
          setMimeType(mime);
          setLoading(false);
          if (!resolved) setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(null);
          setLoading(false);
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  return { url, mimeType, loading, error };
};
