import React from 'react';
import { useContent } from '../context/ContentContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { FeaturedCards } from '../components/FeaturedCards';
import { MediaImage } from '../components/MediaImage';
import { Plus, Trash2, Upload } from 'lucide-react';

export const Videography = ({ onNavigate }) => {
  const { siteData, isEditMode, updateData, removeItem, setActiveModal, uploadFile } = useContent();

  const videos = siteData.videographyPage.videos;
  const coverFallback = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop";

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file, 'covers/videography');
    if (result) updateData('videographyPage.coverImage', result.key);
    e.target.value = '';
  };

  return (
    <div className="w-full pt-16 sm:pt-20 pb-12 sm:pb-20 space-y-12 sm:space-y-16 animate-fade-in">
      
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] overflow-hidden bg-neutral-950">
        <MediaImage
          src={siteData.videographyPage.coverImage}
          fallback={coverFallback}
          alt="Videography Cover"
          className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />

        {/* HERO TITLE & SUBTITLE OVERLAY */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            Discipline — 03
          </span>

          {isEditMode ? (
            <input
              type="text"
              value={siteData.videographyPage.title}
              onChange={(e) => updateData('videographyPage.title', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white font-heading"
            />
          ) : (
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-white font-heading">
              {siteData.videographyPage.title}
            </h1>
          )}

          {isEditMode ? (
            <textarea
              value={siteData.videographyPage.subtitle}
              onChange={(e) => updateData('videographyPage.subtitle', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-sm text-blue-300 font-mono"
              rows={2}
            />
          ) : (
            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
              {siteData.videographyPage.subtitle}
            </p>
          )}
        </div>

        {/* REPLACABLE COVER BUTTON IN EDIT MODE */}
        {isEditMode && (
          <div className="absolute top-28 right-6 z-20">
            <label className="px-4 py-2 bg-blue-600/90 hover:bg-blue-500 border border-blue-400 text-white rounded-full text-xs font-semibold cursor-pointer flex items-center space-x-2 shadow-2xl backdrop-blur-md">
              <Upload size={14} />
              <span>Replace Videography Cover</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        
        {/* ADD VIDEO BUTTON IN EDIT MODE */}
        {isEditMode && (
          <div className="flex justify-end">
            <button
              onClick={() => setActiveModal('videography')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-lg"
            >
              <Plus size={14} />
              <span>Upload Commercial Video</span>
            </button>
          </div>
        )}

        {/* RESPONSIVE LANDSCAPE VIDEO GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((vid) => (
            <div 
              key={vid.id} 
              className="space-y-4 bg-neutral-950/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between"
            >
              {/* VIDEO PLAYER */}
              <VideoPlayer video={vid} />

              {/* VIDEO DETAILS */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] uppercase font-mono tracking-widest text-neutral-300">
                    {vid.category || 'Commercial'}
                  </span>
                  {vid.resolution && (
                    <span className="text-[11px] font-mono text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                      {vid.resolution}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                  {vid.title}
                </h3>

                {vid.client && (
                  <p className="text-xs text-neutral-400 font-mono">
                    Client: <span className="text-neutral-200">{vid.client}</span>
                  </p>
                )}

                <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3">
                  {vid.description}
                </p>
              </div>

              {/* EDIT DELETE BUTTON */}
              {isEditMode && (
                <button
                  onClick={() => removeItem('videographyPage.videos', vid.id)}
                  className="mt-2 w-full py-1.5 bg-red-950/90 border border-red-700 text-red-200 text-xs rounded hover:bg-red-900 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 size={13} />
                  <span>Delete Video</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: CONTINUE EXPLORING */}
        <div className="pt-16 border-t border-neutral-900 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white font-heading">
              Continue Exploring
            </h2>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Other Disciplines</span>
          </div>

          <FeaturedCards onSelectCard={(id) => onNavigate(id)} excludeId="videography" />
        </div>

      </div>

    </div>
  );
};
