
import React from 'react';
import { MapPin, ShieldCheck, X } from 'lucide-react';

interface PermissionModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDecline}></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <MapPin size={32} />
        </div>
        <h2 className="text-2xl font-black mb-4">Location Permission</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          We need access to your location to provide accurate <strong>Prayer Times</strong> and <strong>Qibla direction</strong> based on your current city.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl flex items-start gap-3 border border-green-100 dark:border-green-800 mb-8">
          <ShieldCheck size={20} className="text-green-600 shrink-0" />
          <p className="text-xs text-green-800 dark:text-green-300 font-medium">
            Your data is processed locally and never stored on our servers.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onAccept}
            className="w-full py-4 bg-green-700 text-white rounded-2xl font-black shadow-lg shadow-green-900/20 hover:bg-green-600 transition-all"
          >
            Allow Location
          </button>
          <button 
            onClick={onDecline}
            className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
