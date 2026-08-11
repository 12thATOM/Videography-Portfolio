import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EditModal } from './components/EditModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SaveToast } from './components/SaveToast';
import { Home } from './pages/Home';
import { Photography } from './pages/Photography';
import { Cinematics } from './pages/Cinematics';
import { Videography } from './pages/Videography';
import { About } from './pages/About';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const { isEditMode, isAdminLoggedIn } = useContent();
  const scrollToWorkRef = useRef(null);

  const scrollToFeaturedWork = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById('featured-work');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  scrollToWorkRef.current = scrollToFeaturedWork;

  useEffect(() => {
    if (currentTab !== 'work') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === 'work') {
      scrollToFeaturedWork();
    }
  }, [currentTab, scrollToFeaturedWork]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0A] text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onWorkClick={scrollToFeaturedWork}
      />

      <SaveToast />

      <main className={`flex-1 w-full ${isAdminLoggedIn && isEditMode ? 'pb-20 sm:pb-24' : ''}`}>
        {(currentTab === 'home' || currentTab === 'work') && (
          <Home
            onNavigate={(target) => setCurrentTab(target)}
            isWorkView={currentTab === 'work'}
          />
        )}
        {currentTab === 'photography' && (
          <Photography onNavigate={(target) => setCurrentTab(target)} />
        )}
        {currentTab === 'cinematics' && (
          <Cinematics onNavigate={(target) => setCurrentTab(target)} />
        )}
        {currentTab === 'videography' && (
          <Videography onNavigate={(target) => setCurrentTab(target)} />
        )}
        {currentTab === 'about' && (
          <About onNavigate={(target) => setCurrentTab(target)} />
        )}
      </main>

      <AdminLoginModal />
      <EditModal />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainApp />
    </ContentProvider>
  );
}
