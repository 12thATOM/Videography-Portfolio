import React, { useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { FeaturedCards } from '../components/FeaturedCards';
import { MediaImage } from '../components/MediaImage';
import { ArrowDown } from 'lucide-react';
import { SocialIcon } from '../components/SocialIcons';

export const Home = ({ onNavigate, isWorkView = false }) => {
  const { siteData, isEditMode, updateData } = useContent();

  const scrollToWork = () => {
    const el = document.getElementById('featured-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (isWorkView) {
      scrollToWork();
    }
  }, [isWorkView]);

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-12 sm:pb-16 animate-fade-in">
      {/* FULLSCREEN HERO SECTION */}
      <section className="hero-section relative w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex flex-col items-center justify-center overflow-hidden pt-14 sm:pt-16 md:pt-20">
        <div className="absolute inset-0">
          <MediaImage
            src={siteData.hero.bgImage}
            alt="Hero Background"
            fallback="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=2500&auto=format&fit=crop"
            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.15] scale-105 animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium text-neutral-400 block">
              Portfolio & Visual Archive
            </span>

            {isEditMode ? (
              <input
                type="text"
                value={siteData.hero.title}
                onChange={(e) => updateData('hero.title', e.target.value)}
                className="bg-neutral-900/90 border border-blue-500/80 rounded px-3 sm:px-4 py-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white text-center w-full font-heading"
              />
            ) : (
              <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-[0.06em] sm:tracking-[0.1em] md:tracking-[0.12em] text-white font-heading leading-tight drop-shadow-2xl break-words px-2">
                {siteData.hero.title}
              </h1>
            )}
          </div>

          <div className="pt-1 sm:pt-2">
            {isEditMode ? (
              <input
                type="text"
                value={siteData.brand.subtitleRole}
                onChange={(e) => updateData('brand.subtitleRole', e.target.value)}
                className="bg-neutral-900/90 border border-blue-500/80 rounded px-3 py-1.5 text-xs sm:text-sm md:text-base text-blue-300 font-mono text-center w-full"
              />
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm lg:text-base font-light tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase text-neutral-300">
                {siteData.brand.subtitleRole.split('|').map((role, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span className="hover:text-white transition-colors">{role.trim()}</span>
                    {idx < arr.length - 1 && (
                      <span className="text-neutral-600 font-bold hidden sm:inline">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <p className="max-w-2xl mx-auto text-[11px] sm:text-xs md:text-sm text-neutral-400 font-light leading-relaxed tracking-wide pt-1 sm:pt-2 px-2">
            {siteData.brand.tagline}
          </p>
        </div>

        <button
          onClick={scrollToWork}
          className="absolute bottom-6 sm:bottom-10 z-10 flex flex-col items-center space-y-2 text-neutral-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono">Scroll</span>
          <ArrowDown size={14} className="sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </section>

      {/* FEATURED WORK SECTION */}
      <section id="featured-work" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 scroll-mt-20 sm:scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-900 pb-4 sm:pb-6">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono text-neutral-500 block mb-1 sm:mb-2">
              01 — Selection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white font-heading">
              Featured Work
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 max-w-md font-light">
            Select a discipline below to view high-resolution photography archives, cinematic video showreels, or commercial videography campaigns.
          </p>
        </div>

        <FeaturedCards onSelectCard={(id) => onNavigate(id)} />
      </section>

      {/* DIRECTOR STATEMENT */}
      <section className="w-full bg-neutral-950 border-y border-neutral-900 py-12 sm:py-20 px-4 sm:px-6 my-8 sm:my-12">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-neutral-500 font-medium">
            Director Statement
          </span>
          {isEditMode ? (
            <textarea
              value={siteData.hero.quote}
              onChange={(e) => updateData('hero.quote', e.target.value)}
              className="w-full bg-neutral-900 border border-blue-500/80 rounded p-3 sm:p-4 text-base sm:text-xl md:text-2xl font-serif-luxury text-blue-200 text-center font-light leading-relaxed"
              rows={2}
            />
          ) : (
            <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif-luxury text-neutral-200 font-light italic leading-tight max-w-4xl mx-auto px-2">
              {siteData.hero.quote}
            </h3>
          )}

          <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {siteData.footer.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 hover:text-white transition-colors group px-3 sm:px-4 py-2 rounded-full border border-neutral-800 hover:border-neutral-600 bg-neutral-900/50"
              >
                <SocialIcon name={social.label} size={14} className="group-hover:scale-110 transition-transform" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
