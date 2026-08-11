import React from 'react';
import { useContent } from '../context/ContentContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { FeaturedCards } from '../components/FeaturedCards';
import { MediaImage } from '../components/MediaImage';
import { Plus, Trash2, Upload } from 'lucide-react';

export const Cinematics = ({ onNavigate }) => {
  const { siteData, isEditMode, updateData, removeItem, setActiveModal, uploadFile } = useContent();

  const videos = siteData.cinematicsPage.videos;
  const coverFallback = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop";

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result) updateData('cinematicsPage.coverImage', result.key);
    e.target.value = '';
  };

  return (
    <div className="w-full pt-16 sm:pt-20 pb-12 sm:pb-20 space-y-12 sm:space-y-16 animate-fade-in">
      
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] overflow-hidden bg-neutral-950">
        <MediaImage
          src={siteData.cinematicsPage.coverImage}
          fallback={coverFallback}
          alt="Cinematics Cover"
          className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />

        {/* HERO TITLE & SUBTITLE OVERLAY */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            Discipline — 02
          </span>

          {isEditMode ? (
            <input
              type="text"
              value={siteData.cinematicsPage.title}
              onChange={(e) => updateData('cinematicsPage.title', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white font-heading"
            />
          ) : (
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-white font-heading">
              {siteData.cinematicsPage.title}
            </h1>
          )}

          {isEditMode ? (
            <textarea
              value={siteData.cinematicsPage.subtitle}
              onChange={(e) => updateData('cinematicsPage.subtitle', e.target.value)}
              className="w-full bg-neutral-900/90 border border-blue-500/80 rounded p-2 text-sm text-blue-300 font-mono"
              rows={2}
            />
          ) : (
            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
              {siteData.cinematicsPage.subtitle}
            </p>
          )}
        </div>

        {/* REPLACABLE COVER BUTTON IN EDIT MODE */}
        {isEditMode && (
          <div className="absolute top-28 right-6 z-20">
            <label className="px-4 py-2 bg-blue-600/90 hover:bg-blue-500 border border-blue-400 text-white rounded-full text-xs font-semibold cursor-pointer flex items-center space-x-2 shadow-2xl backdrop-blur-md">
              <Upload size={14} />
              <span>Replace Cinematics Cover</span>
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
              onClick={() => setActiveModal('cinematics')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-lg"
            >
              <Plus size={14} />
              <span>Upload & Add Video</span>
            </button>
          </div>
        )}

        {/* CINEMATIC VIDEO GALLERY */}
        <div className="space-y-16">
          {videos.map((vid) => (
            <div 
              key={vid.id} 
              className="space-y-6 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative"
            >
              {/* VIDEO PLAYER */}
              <VideoPlayer video={vid} />

              {/* VIDEO DETAILS BELOW PLAYER */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] uppercase font-mono tracking-widest text-neutral-300">
                      {vid.category || 'Narrative'}
                    </span>
                    {vid.year && (
                      <span className="text-xs font-mono text-neutral-500">{vid.year}</span>
                    )}
                    {vid.duration && (
                      <span className="text-xs font-mono text-neutral-500">• {vid.duration}</span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading">
                    {vid.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                {/* DELETE BUTTON IN EDIT MODE */}
                {isEditMode && (
                  <button
                    onClick={() => removeItem('cinematicsPage.videos', vid.id)}
                    className="px-3 py-1.5 bg-red-950/90 border border-red-700 text-red-200 text-xs rounded-lg hover:bg-red-900 transition-colors flex items-center space-x-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Delete Video</span>
                  </button>
                )}
              </div>
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

          <FeaturedCards onSelectCard={(id) => onNavigate(id)} excludeId="cinematics" />
        </div>

      </div>

    </div>
  );
};
