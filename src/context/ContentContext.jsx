import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { defaultSiteData } from '../config/siteData';
import { uploadMediaFile, migrateLargeMediaInObject, buildPublishData } from '../utils/mediaHelpers';
import { supabase, isSupabaseConfigured, getAdminEmail } from '../lib/supabaseClient';
import { fetchPortfolioFromSupabase, savePortfolioToSupabase } from '../utils/supabasePortfolio';
import {
  uploadToSupabaseStorage,
  deleteMediaUrls,
  collectMediaUrlsFromItem,
} from '../utils/supabaseStorage';
import { migrateLocalToSupabase, hasLocalMediaKeys } from '../utils/migrateLocalToSupabase';

const ContentContext = createContext(null);

const STORAGE_KEY = 'aditya_tomar_portfolio_data_v1';
const PASS_KEY = 'aditya_tomar_admin_pass_v1';
const BUNDLED_DATA_URL = '/portfolio-data.json';
const AUTO_SAVE_DELAY = 1500;
const MIGRATION_PROMPT_KEY = 'aditya_tomar_migration_prompted_v1';

export const ContentProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const autoSaveTimer = useRef(null);
  const isInitialLoad = useRef(true);
  const siteDataRef = useRef(siteData);

  useEffect(() => {
    siteDataRef.current = siteData;
  }, [siteData]);

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem(PASS_KEY) || 'aditya2026';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const cacheLocally = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Local cache write failed:', e);
    }
  }, []);

  const persistPortfolio = useCallback(
    async (data) => {
      if (isSupabaseConfigured && isAdminLoggedIn) {
        await savePortfolioToSupabase(data);
      }
      cacheLocally(data);
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    },
    [cacheLocally, isAdminLoggedIn]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isSupabaseConfigured) {
          const remote = await fetchPortfolioFromSupabase();
          if (remote) {
            setSiteData(remote);
            cacheLocally(remote);
            isInitialLoad.current = false;
            setIsHydrated(true);
            return;
          }
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const migrated = await migrateLargeMediaInObject(parsed);
          setSiteData(migrated);
          if (JSON.stringify(migrated) !== saved) {
            cacheLocally(migrated);
          }
        } else {
          try {
            const res = await fetch(BUNDLED_DATA_URL);
            if (res.ok) {
              const bundled = await res.json();
              setSiteData(bundled);
              cacheLocally(bundled);
            }
          } catch {
            // No bundled data
          }
        }
      } catch (e) {
        console.error('Error loading site data:', e);
      }
      isInitialLoad.current = false;
      setIsHydrated(true);
    };
    loadData();
  }, [cacheLocally]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
      if (!session) setIsEditMode(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isHydrated || isInitialLoad.current || !hasUnsavedChanges) return;
    if (!isAdminLoggedIn) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      try {
        await persistPortfolio(siteDataRef.current);
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [siteData, isHydrated, hasUnsavedChanges, isAdminLoggedIn, persistPortfolio]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(PASS_KEY, adminPassword);
      } catch (e) {
        console.error('Error saving admin password:', e);
      }
    }
  }, [adminPassword]);

  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }, []);

  const saveChanges = useCallback(async () => {
    setSaveStatus('saving');
    try {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      await persistPortfolio(siteDataRef.current);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      setSaveStatus('error');
      alert(
        isSupabaseConfigured
          ? 'Could not save to Supabase. Check your connection and admin login.'
          : 'Could not save changes. Storage may be full — try Export for Publish.'
      );
      return false;
    }
  }, [persistPortfolio]);

  const maybePromptMigration = useCallback(async () => {
    if (!isSupabaseConfigured || isMigrating) return;
    if (localStorage.getItem(MIGRATION_PROMPT_KEY)) return;

    const localSaved = localStorage.getItem(STORAGE_KEY);
    if (!localSaved) return;

    let localData;
    try {
      localData = JSON.parse(localSaved);
    } catch {
      return;
    }

    if (!hasLocalMediaKeys(localData)) return;

    const shouldMigrate = window.confirm(
      'Local uploads were found on this device. Migrate them to Supabase cloud storage now?'
    );

    localStorage.setItem(MIGRATION_PROMPT_KEY, '1');

    if (!shouldMigrate) return;

    setIsMigrating(true);
    try {
      const migrated = await migrateLocalToSupabase(localData);
      setSiteData(migrated);
      cacheLocally(migrated);
      setHasUnsavedChanges(false);
      alert('Migration complete! Your uploads are now stored in Supabase.');
    } catch (e) {
      console.error('Migration failed:', e);
      alert('Migration failed. Your local data is still available on this device.');
    } finally {
      setIsMigrating(false);
    }
  }, [cacheLocally, isMigrating]);

  const loginAdmin = useCallback(
    async (password) => {
      if (isSupabaseConfigured && supabase) {
        const email = getAdminEmail();
        if (!email) {
          alert('Admin email is not configured. Set VITE_ADMIN_EMAIL in .env.local');
          return false;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error('Supabase login error:', error);
          return false;
        }

        setIsAdminLoggedIn(true);
        setIsEditMode(true);
        setShowLoginModal(false);
        await maybePromptMigration();
        return true;
      }

      if (password === adminPassword) {
        setIsAdminLoggedIn(true);
        setIsEditMode(true);
        setShowLoginModal(false);
        return true;
      }
      return false;
    },
    [adminPassword, maybePromptMigration]
  );

  const logoutAdmin = useCallback(async () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('You have unsaved changes. Save before locking?');
      if (shouldSave) await saveChanges();
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setIsAdminLoggedIn(false);
    setIsEditMode(false);
  }, [hasUnsavedChanges, saveChanges]);

  const updateAdminPassword = useCallback(
    async (oldPass, newPass) => {
      if (!newPass || newPass.length < 4) {
        alert('New password must be at least 4 characters long.');
        return false;
      }

      if (isSupabaseConfigured && supabase) {
        const email = getAdminEmail();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: oldPass,
        });
        if (signInError) {
          alert('Current password does not match.');
          return false;
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPass });
        if (updateError) {
          alert('Could not update password. Please try again.');
          return false;
        }

        alert('Admin password updated successfully!');
        return true;
      }

      if (oldPass !== adminPassword) {
        alert('Current password does not match.');
        return false;
      }

      setAdminPassword(newPass);
      alert('Admin password updated successfully! Keep your new password safe.');
      return true;
    },
    [adminPassword]
  );

  const updateData = useCallback(
    (path, value) => {
      if (!isAdminLoggedIn) return;
      setSiteData((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        const parts = path.split('.');
        let current = copy;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;

        if (path === 'brand.title') copy.hero.title = value;
        if (path === 'hero.title') copy.brand.title = value;

        return copy;
      });
      markDirty();
    },
    [isAdminLoggedIn, markDirty]
  );

  const addItem = useCallback(
    (path, newItem) => {
      if (!isAdminLoggedIn) return;
      setSiteData((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        const parts = path.split('.');
        let current = copy;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        if (Array.isArray(current[parts[parts.length - 1]])) {
          current[parts[parts.length - 1]].unshift(newItem);
        }
        return copy;
      });
      markDirty();
    },
    [isAdminLoggedIn, markDirty]
  );

  const removeItem = useCallback(
    async (path, id) => {
      if (!isAdminLoggedIn) return;

      let itemToDelete = null;
      setSiteData((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        const parts = path.split('.');
        let current = copy;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        const arr = current[parts[parts.length - 1]];
        if (Array.isArray(arr)) {
          itemToDelete = arr.find((item) => item.id === id) || null;
          current[parts[parts.length - 1]] = arr.filter((item) => item.id !== id);
        }
        return copy;
      });

      if (itemToDelete) {
        try {
          await deleteMediaUrls(collectMediaUrlsFromItem(itemToDelete));
        } catch (e) {
          console.error('Failed to delete media from storage:', e);
        }
      }

      markDirty();
    },
    [isAdminLoggedIn, markDirty]
  );

  const uploadFile = useCallback(
    async (file, folder = 'misc') => {
      if (!file) return null;
      try {
        if (isSupabaseConfigured && isAdminLoggedIn) {
          const result = await uploadToSupabaseStorage(file, folder);
          markDirty();
          return { key: result.key, mimeType: result.mimeType };
        }

        const result = await uploadMediaFile(file);
        if (result) markDirty();
        return result;
      } catch (e) {
        console.error('Upload failed:', e);
        alert('Failed to upload file. Please check your connection and try again.');
        return null;
      }
    },
    [isAdminLoggedIn, markDirty]
  );

  const runLocalMigration = useCallback(async () => {
    if (!isSupabaseConfigured || !isAdminLoggedIn) return false;
    setIsMigrating(true);
    try {
      const migrated = await migrateLocalToSupabase(siteDataRef.current);
      setSiteData(migrated);
      cacheLocally(migrated);
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error('Migration failed:', e);
      return false;
    } finally {
      setIsMigrating(false);
    }
  }, [cacheLocally, isAdminLoggedIn]);

  const resetToDefault = () => {
    if (!isAdminLoggedIn) return;
    if (window.confirm('Are you sure you want to reset all portfolio content to default?')) {
      setSiteData(defaultSiteData);
      localStorage.removeItem(STORAGE_KEY);
      setHasUnsavedChanges(true);
      setSaveStatus('idle');
    }
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'aditya_tomar_portfolio_config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportForPublish = async () => {
    if (hasUnsavedChanges) await saveChanges();
    try {
      const { publishData, filesToDownload } = await buildPublishData(siteData);

      const jsonStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(publishData, null, 2));
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonStr;
      jsonLink.download = 'portfolio-data.json';
      document.body.appendChild(jsonLink);
      jsonLink.click();
      jsonLink.remove();

      for (const { filename, blob } of filesToDownload) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        await new Promise((r) => setTimeout(r, 300));
      }

      alert(
        'Publish package exported!\n\n' +
          '1. Place portfolio-data.json in your public/ folder\n' +
          '2. Place all downloaded media files in public/media/\n' +
          '3. Run npm run build and deploy'
      );
    } catch (e) {
      console.error('Export for publish failed:', e);
      alert('Export failed. Please try again.');
    }
  };

  const importJSON = (jsonString) => {
    if (!isAdminLoggedIn) return;
    try {
      const parsed = JSON.parse(jsonString);
      setSiteData(parsed);
      markDirty();
      alert('Portfolio content imported! Click "Save Changes" to persist.');
    } catch (e) {
      alert('Invalid JSON configuration file.');
    }
  };

  const value = {
    siteData,
    updateData,
    addItem,
    removeItem,
    uploadFile,
    saveChanges,
    runLocalMigration,
    isMigrating,
    hasUnsavedChanges,
    saveStatus,
    lastSavedAt,
    isHydrated,
    isEditMode,
    setIsEditMode,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    adminPassword,
    updateAdminPassword,
    showLoginModal,
    setShowLoginModal,
    activeModal,
    setActiveModal,
    resetToDefault,
    exportJSON,
    exportForPublish,
    importJSON,
    isSupabaseConfigured,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    return {
      siteData: defaultSiteData,
      updateData: () => {},
      addItem: () => {},
      removeItem: () => {},
      uploadFile: async () => null,
      saveChanges: async () => false,
      runLocalMigration: async () => false,
      isMigrating: false,
      hasUnsavedChanges: false,
      saveStatus: 'idle',
      lastSavedAt: null,
      isHydrated: true,
      isEditMode: false,
      setIsEditMode: () => {},
      isAdminLoggedIn: false,
      loginAdmin: async () => false,
      logoutAdmin: () => {},
      adminPassword: 'aditya2026',
      updateAdminPassword: async () => false,
      showLoginModal: false,
      setShowLoginModal: () => {},
      activeModal: null,
      setActiveModal: () => {},
      resetToDefault: () => {},
      exportJSON: () => {},
      exportForPublish: async () => {},
      importJSON: () => {},
      isSupabaseConfigured: false,
    };
  }
  return context;
};
