import React from 'react';
import { useContent } from '../context/ContentContext';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export const SaveToast = () => {
  const { saveStatus, hasUnsavedChanges } = useContent();

  if (saveStatus === 'idle' && !hasUnsavedChanges) return null;

  return (
    <div
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[55] animate-fade-in pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {saveStatus === 'saving' && (
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-neutral-900/95 border border-neutral-700 rounded-full shadow-2xl backdrop-blur-md">
          <Loader2 size={14} className="animate-spin text-blue-400" />
          <span className="text-xs text-neutral-200 font-medium">Saving changes…</span>
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-950/95 border border-emerald-700 rounded-full shadow-2xl backdrop-blur-md">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs text-emerald-200 font-medium">All changes saved!</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-red-950/95 border border-red-700 rounded-full shadow-2xl backdrop-blur-md">
          <AlertCircle size={14} className="text-red-400" />
          <span className="text-xs text-red-200 font-medium">Save failed — try again</span>
        </div>
      )}

      {saveStatus === 'idle' && hasUnsavedChanges && (
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-amber-950/95 border border-amber-700/60 rounded-full shadow-2xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-amber-200 font-medium">Unsaved changes</span>
        </div>
      )}
    </div>
  );
};
