import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Lock, KeyRound, X, Check, ShieldCheck, ShieldAlert } from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    loginAdmin, 
    isAdminLoggedIn, 
    logoutAdmin, 
    updateAdminPassword 
  } = useContent();

  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPassInput, setOldPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');

  if (!showLoginModal) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(inputPass);
    if (success) {
      setErrorMsg('');
      setInputPass('');
    } else {
      setErrorMsg('Incorrect master passcode. Please try again.');
    }
  };

  const handleChangePassSubmit = async (e) => {
    e.preventDefault();
    const success = await updateAdminPassword(oldPassInput, newPassInput);
    if (success) {
      setOldPassInput('');
      setNewPassInput('');
      setShowChangePass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* LOGGED IN STATUS VIEW */}
        {isAdminLoggedIn ? (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                Owner Access Unlocked
              </h3>
              <p className="text-xs text-neutral-400">
                You are currently authenticated as the website owner. Edit mode is active.
              </p>
            </div>

            {!showChangePass ? (
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowChangePass(true)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                >
                  <KeyRound size={14} />
                  <span>Change Admin Passcode</span>
                </button>

                <button
                  onClick={() => {
                    logoutAdmin();
                    setShowLoginModal(false);
                  }}
                  className="w-full py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-200 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Lock & Exit Admin Mode
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassSubmit} className="space-y-3 pt-2 text-left text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-400">Current Passcode</label>
                  <input
                    type="password"
                    required
                    value={oldPassInput}
                    onChange={(e) => setOldPassInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">New Passcode</label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePass(false)}
                    className="flex-1 py-2 bg-neutral-800 text-neutral-300 rounded font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                  >
                    Save Passcode
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN PROMPT */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-blue-400">
                <Lock size={22} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                Owner Authentication
              </h3>
              <p className="text-xs text-neutral-400">
                Enter your master passcode to unlock Visual Edit Mode.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-neutral-300 font-medium">Master Passcode</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg p-3 text-white focus:outline-none font-mono text-sm"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                  <ShieldAlert size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                  Default Master Passcode:
                </span>
                <code className="text-xs font-mono text-blue-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 inline-block">
                  aditya2026
                </code>
                <p className="text-[10px] text-neutral-500 font-light pt-1">
                  (You can change this password anytime inside the admin menu).
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-[0.15em] rounded-full transition-colors flex items-center justify-center space-x-2"
              >
                <Lock size={14} />
                <span>Unlock Portfolio Editor</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
