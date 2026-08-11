import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { LightboxModal } from '../components/LightboxModal';
import { FeaturedCards } from '../components/FeaturedCards';
import { MediaImage } from '../components/MediaImage';
import { Plus, Maximize2, Trash2, Upload } from 'lucide-react';

export const Photography = ({ onNavigate }) => {
  const { siteData, isEditMode, updateData, removeItem, setActiveModal, uploadFile } = useContent();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const photos = siteData.photographyPage.photos;
  const coverFallback = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop";

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file, 'covers/photography');
    if (result) updateData('photographyPage.coverImage', result.key);
    e.target.value = '';
  };

  return (
    <div className="w-full pt-16 sm:pt-20 pb-12 sm:pb-20 space-y-12 sm:space-y-16 animate-fade-in">
      
      {/* PAGE HERO COVER BANNER */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] overflow-hidden bg-neutral-950">
        <MediaImage
          src={siteData.photographyPage.coverImage}
          fallback={coverFallback}
          alt="Photography Cover"
          className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />

        {/* HERO TITLE & SUBTITLE OVERLAY */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            Discipline — 01
          </span>

          {isEditMode ? (
            <input
              type="text"
              value={siteData.photographyPage.title}
              onChange={(e) => updateData('photographyPage.title', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white font-heading"
            />
          ) : (
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-white font-heading">
              {siteData.photographyPage.title}
            </h1>
          )}

          {isEditMode ? (
            <textarea
              value={siteData.photographyPage.subtitle}
              onChange={(e) => updateData('photographyPage.subtitle', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-sm text-blue-300 font-mono"
              rows={2}
            />
          ) : (
            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
              {siteData.photographyPage.subtitle}
            </p>
          )}
        </div>

        {/* REPLACABLE COVER BUTTON IN EDIT MODE */}
        {isEditMode && (
          <div className="absolute top-28 right-6 z-20">
            <label className="px-4 py-2 bg-blue-600/90 hover:bg-blue-500 border border-blue-400 text-white rounded-full text-xs font-semibold cursor-pointer flex items-center space-x-2 shadow-2xl backdrop-blur-md">
              <Upload size={14} />
              <span>Replace Photography Cover</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        
        {/* ADD PHOTO BUTTON IN EDIT MODE */}
        {isEditMode && (
          <div className="flex justify-end">
            <button
              onClick={() => setActiveModal('photos')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-lg"
            >
              <Plus size={14} />
              <span>Upload & Add Photos</span>
            </button>
          </div>
        )}

        {/* RESPONSIVE MASONRY / GRID GALLERY */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-neutral-500 transition-all duration-500 bg-neutral-950 shadow-xl"
            >
              {/* PHOTO IMAGE */}
              <MediaImage
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* DARK OVERLAY ON HOVER */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-1">
                  {photo.category}
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-xs text-neutral-300 font-light mt-1 line-clamp-2">
                    {photo.description}
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-mono text-neutral-300">
                  <Maximize2 size={12} />
                  <span>Click to expand</span>
                </div>
              </div>

              {/* DELETE BUTTON IN EDIT MODE */}
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem('photographyPage.photos', photo.id);
                  }}
                  className="absolute top-3 right-3 z-20 p-2 bg-red-950/90 border border-red-700 text-red-200 rounded-full hover:bg-red-900 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL */}
        {selectedImageIndex !== null && (
          <LightboxModal
            photos={photos}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onNavigate={(newIdx) => setSelectedImageIndex(newIdx)}
          />
        )}

        {/* BOTTOM SECTION: CONTINUE EXPLORING */}
        <div className="pt-16 border-t border-neutral-900 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white font-heading">
              Continue Exploring
            </h2>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Other Disciplines</span>
          </div>

          <FeaturedCards onSelectCard={(id) => onNavigate(id)} excludeId="photography" />
        </div>

      </div>

    </div>
  );
};
