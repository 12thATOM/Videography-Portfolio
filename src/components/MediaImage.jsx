import React from 'react';
import { useMediaUrl } from '../hooks/useMediaUrl';

export const MediaImage = ({ src, alt, className, fallback, ...props }) => {
  const { url, loading } = useMediaUrl(src);
  const displaySrc = url || fallback;

  if (loading && !displaySrc) {
    return (
      <div className={`bg-neutral-900 animate-pulse ${className || ''}`} {...props} />
    );
  }

  if (!displaySrc) {
    return (
      <div className={`bg-neutral-900 flex items-center justify-center ${className || ''}`} {...props}>
        <span className="text-neutral-600 text-xs uppercase tracking-wider">No Image</span>
      </div>
    );
  }

  return <img src={displaySrc} alt={alt || ''} className={className} {...props} />;
};
