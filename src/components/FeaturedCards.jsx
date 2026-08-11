import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowUpRight, Edit2, Upload } from 'lucide-react';
import { MediaImage } from './MediaImage';

const COVER_FALLBACKS = {
  photography: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
  cinematics: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
  videography: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop',
};

export const FeaturedCards = ({ onSelectCard, excludeId = null }) => {
  const { siteData, isEditMode, updateData, uploadFile } = useContent();

  const cards = siteData.featuredWork.filter((card) => card.id !== excludeId);

  const getFallback = (card) => {
    const pageKey = `${card.id}Page`;
    const pageCover = siteData[pageKey]?.coverImage;
    return pageCover || COVER_FALLBACKS[card.id] || COVER_FALLBACKS.photography;
  };

  const handleCoverUpload = async (e, origIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result) {
      const updated = [...siteData.featuredWork];
      updated[origIndex].coverImage = result.key;
      updateData('featuredWork', updated);
    }
    e.target.value = '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
      {cards.map((card) => {
        const origIndex = siteData.featuredWork.findIndex((item) => item.id === card.id);
        const fallback = getFallback(card);

        return (
          <div
            key={card.id}
            onClick={() => !isEditMode && onSelectCard(card.id)}
            className="group relative featured-card h-[320px] xs:h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-neutral-600 transition-all duration-500 shadow-2xl bg-neutral-950"
          >
            <div className="absolute inset-0 overflow-hidden">
              <MediaImage
                src={card.coverImage}
                fallback={fallback}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/20 group-hover:from-[#0A0A0A] group-hover:via-black/60 group-hover:to-black/30 transition-colors duration-500" />

            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700/60 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-300 font-medium">
                {card.badge || 'PORTFOLIO'}
              </span>
            </div>

            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-neutral-700/50 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
              <ArrowUpRight size={16} />
            </div>

            {isEditMode && (
              <div
                className="absolute top-16 sm:top-20 left-4 sm:left-6 right-4 sm:right-6 z-20 bg-neutral-900/95 backdrop-blur-md border border-blue-500/50 p-3 rounded-lg space-y-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-1.5 text-blue-400 font-mono text-[11px] font-semibold">
                  <Edit2 size={12} />
                  <span>Edit {card.title} Cover</span>
                </div>
                <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                  <Upload size={14} />
                  <span>Upload Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverUpload(e, origIndex)}
                  />
                </label>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10 flex flex-col justify-end">
              <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                {isEditMode ? (
                  <input
                    type="text"
                    value={card.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const updated = [...siteData.featuredWork];
                      updated[origIndex].title = e.target.value;
                      updateData('featuredWork', updated);
                    }}
                    className="bg-neutral-900 border border-blue-500/50 rounded px-2 py-1 text-xl sm:text-2xl font-bold text-white uppercase tracking-wider w-full"
                  />
                ) : (
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-white font-heading">
                    {card.title}
                  </h3>
                )}
              </div>

              <div className="mt-2 sm:mt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                {isEditMode ? (
                  <textarea
                    value={card.description}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const updated = [...siteData.featuredWork];
                      updated[origIndex].description = e.target.value;
                      updateData('featuredWork', updated);
                    }}
                    className="w-full bg-neutral-900 border border-blue-500/50 rounded p-2 text-xs text-neutral-300 mt-2"
                    rows={2}
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-2 group-hover:line-clamp-none">
                    {card.description}
                  </p>
                )}
              </div>

              <div className="mt-3 sm:mt-4 flex items-center space-x-2 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-neutral-400 group-hover:text-white transition-colors">
                <span>Explore Category</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
