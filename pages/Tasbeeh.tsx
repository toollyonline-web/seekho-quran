
import React, { useState, useEffect } from 'react';
// Added Quote to the imports from lucide-react
import { RotateCcw, Hash, Settings2, Target, Zap, Trophy, Quote } from 'lucide-react';
import { translations, Language } from '../services/i18n';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(33);
  const [totalSession, setTotalSession] = useState(0);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const tFull = translations[currentLang] || translations['en'];
  const t = tFull.tools || {
    tasbeehTitle: "Tasbeeh",
    tasbeehSubtitle: "Dhikr Counter",
    tapToCount: "Tap to count",
    target: "Target",
    total: "Total",
    reset: "Reset"
  };

  useEffect(() => {
    const savedTotal = localStorage.getItem('qs_tasbeeh_session');
    if (savedTotal) setTotalSession(parseInt(savedTotal));
    
    const savedLimit = localStorage.getItem('qs_tasbeeh_limit');
    if (savedLimit) setLimit(parseInt(savedLimit));
  }, []);

  const handleClick = () => {
    const nextCount = count + 1;
    const nextTotal = totalSession + 1;
    
    // Tactile Feedback API
    if (window.navigator && window.navigator.vibrate) {
      if (nextCount === limit) {
        window.navigator.vibrate([150, 50, 150]); // Multi-pulse for goal
      } else {
        window.navigator.vibrate(40); // Soft click
      }
    }

    if (nextCount > limit) {
      setCount(1);
    } else {
      setCount(nextCount);
    }
    
    setTotalSession(nextTotal);
    localStorage.setItem('qs_tasbeeh_session', nextTotal.toString());
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCount(0);
    localStorage.setItem('qs_tasbeeh_limit', newLimit.toString());
  };

  const resetCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t.reset + '?')) {
      setCount(0);
      setTotalSession(0);
      localStorage.setItem('qs_tasbeeh_session', '0');
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[75vh] flex flex-col items-center justify-center space-y-12 page-transition pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic dark:text-white">{t.tasbeehTitle}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">{t.tasbeehSubtitle}</p>
      </div>

      <div 
        className="relative group cursor-pointer active:scale-95 transition-all touch-none select-none"
        onClick={handleClick}
      >
        {/* Kinetic Ring Design */}
        <div className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full glass border-[16px] border-slate-100 dark:border-slate-900 flex flex-col items-center justify-center relative shadow-2xl transition-all group-active:shadow-inner group-active:scale-[0.98]">
          <div className="absolute inset-6 rounded-full border-[2px] border-dashed border-emerald-500/10 animate-spin-slow"></div>
          <div className="absolute inset-10 rounded-full border-[1px] border-emerald-500/5 rotate-45"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <span className="text-9xl md:text-[12rem] font-mono font-black text-emerald-800 dark:text-emerald-400 leading-none tracking-tighter drop-shadow-lg">
                {count}
             </span>
             <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-8 flex items-center gap-3">
                <Target size={14} className="text-emerald-600" /> {t.target}: {limit === 9999 ? '∞' : limit}
             </span>
          </div>

          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle 
              cx="50%" cy="50%" r="46.5%" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="16" 
              strokeDasharray="292%" 
              strokeDashoffset={`${292 * (1 - count / limit)}%`} 
              className="text-emerald-700 transition-all duration-300 stroke-round" 
            />
          </svg>
        </div>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-10 py-5 bg-slate-950 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 border border-white/10 group-hover:bg-emerald-800 transition-colors">
          <Zap size={18} className="text-amber-500 animate-pulse" /> {t.tapToCount}
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-6 pt-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 text-center shadow-xl group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Trophy size={12} className="text-amber-500" /> {t.total}</p>
          <p className="font-black text-3xl dark:text-white group-hover:scale-110 transition-transform">{totalSession}</p>
        </div>
        
        <button 
          onClick={resetCount}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 flex flex-col items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all group shadow-xl active:scale-90"
        >
          <RotateCcw className="text-slate-400 group-hover:text-rose-600 mb-2 transition-transform group-hover:-rotate-90" size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600">{t.reset}</span>
        </button>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 flex flex-col items-center justify-center relative shadow-xl overflow-hidden group active:scale-90">
          <select 
            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            value={limit} 
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
            <option value="33">33 Dhikr</option>
            <option value="100">100 Dhikr</option>
            <option value="1000">1000 Dhikr</option>
            <option value="9999">Infinite Mode</option>
          </select>
          <Settings2 className="text-slate-400 group-hover:text-emerald-700 mb-2 transition-transform group-hover:rotate-45" size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-700">{t.target}</span>
        </div>
      </div>

      <div className="p-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] border border-emerald-100 dark:border-emerald-800 text-center max-w-lg shadow-inner">
        <Quote className="mx-auto text-emerald-300 mb-4" size={32} />
        <p className="text-lg text-emerald-900 dark:text-emerald-400 italic font-bold leading-relaxed">
          "Truly, in the remembrance of Allah do hearts find rest." (13:28)
        </p>
      </div>
    </div>
  );
};

export default Tasbeeh;
