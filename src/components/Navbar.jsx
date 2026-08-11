import React from 'react';
import { useContent } from '../context/ContentContext';
import { Edit3, Menu, X, Lock, Download, ShieldCheck, Save, Check } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, onWorkClick }) => {
  const {
    siteData,
    isEditMode,
    setIsEditMode,
    isAdminLoggedIn,
    setShowLoginModal,
    setActiveModal,
    exportJSON,
    exportForPublish,
    logoutAdmin,
    saveChanges,
    hasUnsavedChanges,
    saveStatus,
  } = useContent();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        setShowLoginModal(true);
      }
      if (e.ctrlKey && e.key === 's' && isAdminLoggedIn && isEditMode) {
        e.preventDefault();
        saveChanges();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowLoginModal, isAdminLoggedIn, isEditMode, saveChanges]);

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'Photography', id: 'photography' },
    { label: 'Cinematics', id: 'cinematics' },
    { label: 'Videography', id: 'videography' },
    { label: 'About', id: 'about' },
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    if (id === 'work' && onWorkClick) {
      onWorkClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEditButtonClick = () => {
    if (!isAdminLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  const isSaving = saveStatus === 'saving';
  const justSaved = saveStatus === 'saved';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 safe-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 group text-left touch-target"
              aria-label="Go to home"
            >
              {siteData.brand.logoImage ? (
                <img
                  src={siteData.brand.logoImage}
                  alt="Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full border border-neutral-700"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-[10px] sm:text-xs tracking-widest text-neutral-200 group-hover:border-neutral-400 transition-colors">
                  {siteData.brand.logoText || 'AT'}
                </div>
              )}
            </button>
          </div>

          <div className="hidden xl:flex justify-center overflow-hidden">
            <button
              onClick={() => handleNavClick('home')}
              className="text-sm xl:text-base tracking-[0.2em] xl:tracking-[0.25em] font-semibold uppercase text-neutral-100 hover:text-white transition-colors font-heading truncate max-w-[200px] 2xl:max-w-none"
            >
              {siteData.brand.title}
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-end space-x-3 xl:space-x-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[10px] xl:text-xs uppercase tracking-[0.15em] xl:tracking-[0.2em] font-medium transition-colors whitespace-nowrap touch-target px-1 ${
                  (item.id === 'work' && (currentTab === 'home' || currentTab === 'work')) ||
                  currentTab === item.id
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2 ml-1">
                {isEditMode && (
                  <button
                    onClick={saveChanges}
                    disabled={isSaving}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 border touch-target ${
                      justSaved
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : hasUnsavedChanges
                        ? 'bg-amber-600 text-white border-amber-400 animate-pulse'
                        : 'bg-blue-600 text-white border-blue-400'
                    } disabled:opacity-60`}
                    title="Save all changes (Ctrl+S)"
                  >
                    {justSaved ? <Check size={12} /> : <Save size={12} />}
                    <span className="hidden xl:inline">{justSaved ? 'Saved' : 'Save'}</span>
                  </button>
                )}

                <button
                  onClick={handleEditButtonClick}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase transition-all duration-300 border touch-target ${
                    isEditMode
                      ? 'bg-neutral-800 text-blue-300 border-blue-500/50'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  <Edit3 size={12} />
                  <span className="hidden xl:inline">{isEditMode ? 'Editing' : 'Edit'}</span>
                </button>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="p-1.5 sm:p-2 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-400 hover:border-neutral-600 touch-target"
                  title="Owner Menu"
                >
                  <ShieldCheck size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="p-1.5 sm:p-2 rounded-full text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-colors touch-target"
                title="Owner Login (Ctrl + Shift + E)"
              >
                <Lock size={14} />
              </button>
            )}
          </div>

          <div className="flex lg:hidden items-center justify-end space-x-1.5 sm:space-x-2">
            {isAdminLoggedIn && isEditMode && (
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className={`p-2 rounded-full border touch-target ${
                  justSaved
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : hasUnsavedChanges
                    ? 'bg-amber-600 border-amber-400 text-white'
                    : 'bg-blue-600 border-blue-400 text-white'
                }`}
                title="Save changes"
                aria-label="Save changes"
              >
                {justSaved ? <Check size={16} /> : <Save size={16} />}
              </button>
            )}

            <button
              onClick={() => setShowLoginModal(true)}
              className={`p-1.5 sm:p-2 rounded-full border touch-target ${
                isAdminLoggedIn
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}
              aria-label="Owner login"
            >
              {isAdminLoggedIn ? <ShieldCheck size={14} /> : <Lock size={14} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-neutral-300 hover:text-white touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden glass-modal border-t border-neutral-800 px-4 sm:px-6 py-4 space-y-0.5 animate-fade-in max-h-[75vh] overflow-y-auto safe-bottom">
            <div className="text-center pb-3 mb-2 border-b border-neutral-800">
              <span className="text-xs sm:text-sm tracking-[0.15em] font-bold text-white uppercase">
                {siteData.brand.title}
              </span>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left py-3 px-2 text-sm uppercase tracking-[0.15em] transition-colors touch-target ${
                  currentTab === item.id || (item.id === 'work' && currentTab === 'home')
                    ? 'text-white font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => {
                    handleEditButtonClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-3 px-2 text-sm uppercase tracking-[0.15em] touch-target ${
                    isEditMode ? 'text-blue-400' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                </button>
                {isEditMode && (
                  <button
                    onClick={() => {
                      saveChanges();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-2 text-sm uppercase tracking-[0.15em] text-emerald-400 touch-target"
                  >
                    Save All Changes
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </nav>

      {/* Edit mode bottom toolbar — full width on mobile, floating on desktop */}
      {isAdminLoggedIn && isEditMode && (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-auto sm:right-4 sm:w-auto z-50 safe-bottom">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 bg-neutral-950/95 sm:bg-neutral-950/90 backdrop-blur-md border-t sm:border border-neutral-700/80 px-3 py-2.5 sm:px-4 sm:py-2.5 sm:rounded-full shadow-2xl text-xs sm:max-w-[calc(100vw-2rem)]">
            {hasUnsavedChanges && (
              <span className="hidden sm:flex items-center space-x-1 text-amber-400 text-[10px] mr-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Unsaved</span>
              </span>
            )}

            <button
              onClick={saveChanges}
              disabled={isSaving}
              className={`flex items-center space-x-1.5 px-3 py-2 sm:py-1.5 rounded-full font-semibold transition-colors touch-target ${
                justSaved
                  ? 'bg-emerald-600 text-white'
                  : hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              } disabled:opacity-60`}
            >
              {justSaved ? <Check size={14} /> : <Save size={14} />}
              <span className="text-[11px] sm:text-xs">{justSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>

            <button
              onClick={() => setActiveModal('json-editor')}
              className="flex items-center space-x-1 px-2.5 py-2 sm:py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-full transition-colors touch-target"
            >
              <Edit3 size={12} />
              <span className="text-[11px] sm:text-xs">Manage</span>
            </button>

            <button
              onClick={exportForPublish}
              className="flex items-center space-x-1 px-2.5 py-2 sm:py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-full transition-colors touch-target"
              title="Export for publish"
            >
              <Download size={12} />
              <span className="text-[11px] sm:text-xs hidden xs:inline">Publish</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center space-x-1 px-2.5 py-2 sm:py-1.5 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded-full transition-colors touch-target"
              title="Lock edit mode"
            >
              <Lock size={12} />
              <span className="text-[11px] sm:text-xs">Lock</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
