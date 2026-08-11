import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { defaultSiteData } from '../config/siteData';
import { uploadMediaFile, migrateLargeMediaInObject, buildPublishData } from '../utils/mediaHelpers';

const ContentContext = createContext(null);

const STORAGE_KEY = 'aditya_tomar_portfolio_data_v1';
const PASS_KEY = 'aditya_tomar_admin_pass_v1';
const BUNDLED_DATA_URL = '/portfolio-data.json';
const AUTO_SAVE_DELAY = 1500;

export const ContentProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultSiteData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const autoSaveTimer = useRef(null);
  const isInitialLoad = useRef(true);

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem(PASS_KEY) || 'aditya2026';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const persistToStorage = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastSavedAt(new Date());
    setHasUnsavedChanges(false);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const migrated = await migrateLargeMediaInObject(parsed);
          setSiteData(migrated);
          if (JSON.stringify(migrated) !== saved) {
            try {
              persistToStorage(migrated);
            } catch (e) {
              console.warn('Could not re-save migrated data:', e);
            }
          }
        } else {
          try {
            const res = await fetch(BUNDLED_DATA_URL);
            if (res.ok) {
              const bundled = await res.json();
              setSiteData(bundled);
              persistToStorage(bundled);
            }
          } catch {
            // No bundled data
          }
        }
      } catch (e) {
        console.error('Error loading saved site data:', e);
      }
      isInitialLoad.current = false;
      setIsHydrated(true);
    };
    loadData();
  }, [persistToStorage]);

  // Debounced auto-save when content changes
  useEffect(() => {
    if (!isHydrated || isInitialLoad.current || !hasUnsavedChanges) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
        setLastSavedAt(new Date());
        setHasUnsavedChanges(false);
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [siteData, isHydrated, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
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
    try {
      localStorage.setItem(PASS_KEY, adminPassword);
    } catch (e) {
      console.error('Error saving admin password:', e);
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
      persistToStorage(siteData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      setSaveStatus('error');
      alert('Could not save changes. Storage may be full — try Export for Publish.');
      return false;
    }
  }, [siteData, persistToStorage]);

  const loginAdmin = (password) => {
    if (password === adminPassword) {
      setIsAdminLoggedIn(true);
      setIsEditMode(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = async () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('You have unsaved changes. Save before locking?');
      if (shouldSave) await saveChanges();
    }
    setIsAdminLoggedIn(false);
    setIsEditMode(false);
  };

  const updateAdminPassword = (oldPass, newPass) => {
    if (oldPass !== adminPassword) {
      alert('Current password does not match.');
      return false;
    }
    if (!newPass || newPass.length < 4) {
      alert('New password must be at least 4 characters long.');
      return false;
    }
    setAdminPassword(newPass);
    alert('Admin password updated successfully! Keep your new password safe.');
    return true;
  };

  const updateData = useCallback((path, value) => {
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
  }, [isAdminLoggedIn, markDirty]);

  const addItem = useCallback((path, newItem) => {
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
  }, [isAdminLoggedIn, markDirty]);

  const removeItem = useCallback((path, id) => {
    if (!isAdminLoggedIn) return;
    setSiteData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      const arr = current[parts[parts.length - 1]];
      if (Array.isArray(arr)) {
        current[parts[parts.length - 1]] = arr.filter((item) => item.id !== id);
      }
      return copy;
    });
    markDirty();
  }, [isAdminLoggedIn, markDirty]);

  const uploadFile = useCallback(async (file) => {
    if (!file) return null;
    try {
      const result = await uploadMediaFile(file);
      if (result) markDirty();
      return result;
    } catch (e) {
      console.error('Upload failed:', e);
      alert('Failed to upload file. The file may be too large for browser storage.');
      return null;
    }
  }, [markDirty]);

  const resetToDefault = () => {
    if (!isAdminLoggedIn) return;
    if (window.confirm('Are you sure you want to reset all portfolio content to default?')) {
      setSiteData(defaultSiteData);
      localStorage.removeItem(STORAGE_KEY);
      setHasUnsavedChanges(false);
      setSaveStatus('idle');
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteData, null, 2));
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

      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(publishData, null, 2));
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
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
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
      hasUnsavedChanges: false,
      saveStatus: 'idle',
      lastSavedAt: null,
      isHydrated: true,
      isEditMode: false,
      setIsEditMode: () => {},
      isAdminLoggedIn: false,
      loginAdmin: () => false,
      logoutAdmin: () => {},
      adminPassword: 'aditya2026',
      updateAdminPassword: () => false,
      showLoginModal: false,
      setShowLoginModal: () => {},
      activeModal: null,
      setActiveModal: () => {},
      resetToDefault: () => {},
      exportJSON: () => {},
      exportForPublish: async () => {},
      importJSON: () => {},
    };
  }
  return context;
};
