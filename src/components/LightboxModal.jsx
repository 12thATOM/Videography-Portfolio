import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { MediaImage } from './MediaImage';

export const LightboxModal = ({ photos, currentIndex, onClose, onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStartX, setTouchStartX] = useState(null);

  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    const nextIdx = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(nextIdx);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    const nextIdx = (currentIndex + 1) % photos.length;
    onNavigate(nextIdx);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.75 : 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) handleNext();
    else if (diffX < -50) handlePrev();
    setTouchStartX(null);
  };

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in p-2 sm:p-4 md:p-8 select-none safe-top safe-bottom"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20 text-neutral-300">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-mono text-neutral-400 truncate max-w-[50%]">
          <span>{currentIndex + 1}</span> / <span>{photos.length}</span>
          <span className="hidden sm:inline"> — {currentPhoto.category || 'Portfolio'}</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleZoom}
            className="p-2 sm:p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all touch-target"
            title="Toggle Zoom"
            aria-label="Toggle zoom"
          >
            {zoomLevel > 1 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
          </button>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all touch-target"
            title="Close"
            aria-label="Close lightbox"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/50 border border-neutral-800 hover:bg-neutral-900 text-neutral-300 hover:text-white transition-all group touch-target"
        title="Previous"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="relative w-full max-w-6xl max-h-[70vh] sm:max-h-[80vh] flex flex-col items-center justify-center overflow-hidden z-10 px-8 sm:px-12">
        <MediaImage
          src={currentPhoto.url}
          alt={currentPhoto.title}
          style={{ transform: `scale(${zoomLevel})` }}
          className="max-h-[55vh] sm:max-h-[65vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded shadow-2xl transition-transform duration-300 cursor-zoom-in"
          onClick={toggleZoom}
        />

        <div className="mt-3 sm:mt-4 text-center max-w-xl px-2">
          <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-wider font-heading">
            {currentPhoto.title}
          </h3>
          {currentPhoto.description && (
            <p className="text-[10px] sm:text-xs text-neutral-400 font-light mt-1 line-clamp-2 sm:line-clamp-none">
              {currentPhoto.description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/50 border border-neutral-800 hover:bg-neutral-900 text-neutral-300 hover:text-white transition-all group touch-target"
        title="Next"
        aria-label="Next image"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
