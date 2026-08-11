import React from 'react';
import { useContent } from '../context/ContentContext';
import { FeaturedCards } from '../components/FeaturedCards';
import { MediaImage } from '../components/MediaImage';
import { Camera, Film, Sliders, Palette, Compass, BookOpen, Upload } from 'lucide-react';

export const About = ({ onNavigate }) => {
  const { siteData, isEditMode, updateData, uploadFile } = useContent();

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result) updateData('about.profileImage', result.key);
    e.target.value = '';
  };

  const getSkillIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'cinematography': return <Film className="w-5 h-5 text-neutral-300" />;
      case 'photography': return <Camera className="w-5 h-5 text-neutral-300" />;
      case 'video editing': return <Sliders className="w-5 h-5 text-neutral-300" />;
      case 'color grading': return <Palette className="w-5 h-5 text-neutral-300" />;
      case 'creative direction': return <Compass className="w-5 h-5 text-neutral-300" />;
      case 'storytelling': return <BookOpen className="w-5 h-5 text-neutral-300" />;
      default: return <Camera className="w-5 h-5 text-neutral-300" />;
    }
  };

  return (
    <div className="w-full pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-20 animate-fade-in">
      
      {/* PAGE HEADING */}
      <div className="space-y-2 border-b border-neutral-900 pb-6">
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-500 block">
          Biography & Discipline
        </span>
        {isEditMode ? (
          <input
            type="text"
            value={siteData.about.title}
            onChange={(e) => updateData('about.title', e.target.value)}
            className="w-full bg-neutral-900 border border-blue-500/80 rounded p-2 text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white font-heading"
          />
        ) : (
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-wider text-white font-heading">
            {siteData.about.title}
          </h1>
        )}
      </div>

      {/* DESKTOP SIDE-BY-SIDE / MOBILE STACKED BIOGRAPHY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* IMAGE SIDE (5 COLUMNS ON DESKTOP) */}
        <div className="lg:col-span-5 relative group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
          <MediaImage
            src={siteData.about.profileImage}
            alt="Aditya Tomar Profile"
            fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-[350px] sm:h-[450px] md:h-[550px] object-cover filter contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono block">Director of Photography</span>
            <h3 className="text-2xl font-bold uppercase text-white font-heading">{siteData.brand.title}</h3>
          </div>

          {/* UPLOAD PROFILE IMAGE IN EDIT MODE */}
          {isEditMode && (
            <div className="absolute top-4 right-4 z-20">
              <label className="px-3 py-2 bg-blue-600/90 border border-blue-400 text-white rounded-full text-xs font-semibold cursor-pointer flex items-center space-x-1.5 shadow-xl">
                <Upload size={14} />
                <span>Replace Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
              </label>
            </div>
          )}
        </div>

        {/* LARGE EDITABLE BIOGRAPHY TEXT AREA (7 COLUMNS ON DESKTOP) */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-blue-400 block">
            Visual Storyteller
          </span>

          {isEditMode ? (
            <div className="space-y-4">
              <span className="text-xs text-neutral-400 font-mono">Edit Paragraphs:</span>
              {siteData.about.bio.map((paragraph, index) => (
                <textarea
                  key={index}
                  value={paragraph}
                  onChange={(e) => {
                    const updated = [...siteData.about.bio];
                    updated[index] = e.target.value;
                    updateData('about.bio', updated);
                  }}
                  className="w-full bg-neutral-900 border border-blue-500/80 rounded p-3 text-sm text-neutral-200"
                  rows={3}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              {siteData.about.bio.map((paragraph, idx) => (
                <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-white">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* EDITABLE SKILLS CARDS SECTION */}
      <div className="space-y-8 pt-8">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-500 block mb-1">Core Expertise</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white font-heading">
              Technical & Creative Skills
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteData.about.skills.map((skill, index) => (
            <div
              key={skill.id}
              className="p-6 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 space-y-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-600 transition-colors">
                {getSkillIcon(skill.title)}
              </div>

              <div>
                {isEditMode ? (
                  <input
                    type="text"
                    value={skill.title}
                    onChange={(e) => {
                      const updated = [...siteData.about.skills];
                      updated[index].title = e.target.value;
                      updateData('about.skills', updated);
                    }}
                    className="w-full bg-neutral-900 border border-blue-500/80 rounded p-1 text-base font-bold text-white uppercase tracking-wider"
                  />
                ) : (
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                    {skill.title}
                  </h3>
                )}

                {isEditMode ? (
                  <textarea
                    value={skill.desc}
                    onChange={(e) => {
                      const updated = [...siteData.about.skills];
                      updated[index].desc = e.target.value;
                      updateData('about.skills', updated);
                    }}
                    className="w-full bg-neutral-900 border border-blue-500/80 rounded p-1 text-xs text-neutral-300 mt-2"
                    rows={2}
                  />
                ) : (
                  <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
                    {skill.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: CONTINUE EXPLORING */}
      <div className="pt-16 border-t border-neutral-900 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-white font-heading">
            Continue Exploring
          </h2>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Portfolio Disciplines</span>
        </div>

        {/* Display Photography, Cinematics, Videography cards */}
        <FeaturedCards onSelectCard={(id) => onNavigate(id)} />
      </div>

    </div>
  );
};
