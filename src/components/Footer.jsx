import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowUp } from 'lucide-react';
import { SocialIcon } from './SocialIcons';

export const Footer = () => {
  const { siteData, isEditMode, updateData } = useContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#080808] border-t border-neutral-900 text-neutral-400 py-10 sm:py-12 md:py-16 px-4 sm:px-6 relative safe-bottom">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-neutral-500 font-medium">
            Visual Philosophy
          </p>
          {isEditMode ? (
            <textarea
              value={siteData.footer.quote}
              onChange={(e) => updateData('footer.quote', e.target.value)}
              className="w-full bg-neutral-900 border border-blue-500/50 rounded-lg p-3 text-base sm:text-lg md:text-xl font-serif-luxury text-neutral-200 text-center focus:outline-none"
              rows={2}
            />
          ) : (
            <p className="text-base sm:text-lg md:text-xl font-serif-luxury text-neutral-300 italic leading-relaxed">
              {siteData.footer.quote}
            </p>
          )}
        </div>

        <div className="h-px bg-neutral-900 w-full" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-center md:text-left">
            {isEditMode ? (
              <input
                type="text"
                value={siteData.footer.copyright}
                onChange={(e) => updateData('footer.copyright', e.target.value)}
                className="bg-neutral-900 border border-blue-500/50 rounded px-2 py-1 text-xs text-neutral-300 font-mono w-full max-w-xs"
              />
            ) : (
              <p className="text-[10px] sm:text-xs tracking-wider text-neutral-500">
                {siteData.footer.copyright}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {siteData.footer.socials.map((social, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] text-neutral-400 hover:text-white transition-colors flex items-center space-x-1.5 group touch-target"
                >
                  <SocialIcon name={social.label} size={14} className="group-hover:scale-110 transition-transform" />
                  <span>{social.label}</span>
                </a>
                {isEditMode && (
                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => {
                      const updated = [...siteData.footer.socials];
                      updated[index].url = e.target.value;
                      updateData('footer.socials', updated);
                    }}
                    className="w-full sm:w-28 bg-neutral-950 border border-blue-500/50 rounded px-1 text-[10px] text-blue-300 font-mono"
                    title={`Edit ${social.label} URL`}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all touch-target"
            title="Back to Top"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
