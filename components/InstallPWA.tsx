
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);

  useEffect(() => {
    // Check if user has permanently dismissed the prompt before
    const dismissed = localStorage.getItem('qs_pwa_dismissed') === 'true';
    setIsPermanentlyDismissed(dismissed);

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Only show if not permanently dismissed and not already in standalone mode
      if (!dismissed && !window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handlePermanentDismiss = () => {
    localStorage.setItem('qs_pwa_dismissed', 'true');
    setIsPermanentlyDismissed(true);
    setIsVisible(false);
  };

  const handleClose = () => {
    // Just hide for this session
    setIsVisible(false);
  };

  if (!isVisible || isPermanentlyDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-8 md:right-8 md:left-auto z-[60] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-green-700 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-green-600">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Download size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Install QuranSeekho</p>
            <p className="text-[10px] opacity-80">Access offline & from your home screen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={handlePermanentDismiss}
            className="px-3 py-2 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
          <button 
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-green-800 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors shadow-sm"
          >
            Install
          </button>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
