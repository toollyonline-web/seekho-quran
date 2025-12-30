
import React, { useState, useEffect } from 'react';
import { RotateCcw, Hash, Settings2, Target, Zap } from 'lucide-react';
import { translations, Language } from '../services/i18n';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(33);
  const [total, setTotal] = useState(0);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const tFull = translations[currentLang] || translations['en'];
  // Fallback to ensure no crash if tFull.tools is missing
  const t = tFull.tools || {
    tasbeehTitle: "Tasbeeh",
    tasbeehSubtitle: "Dhikr Counter",
    tapToCount: "Tap to count",
    target: "Target",
    total: "Total",
    reset: "Reset"
  };

  useEffect(() => {
    const savedTotal = localStorage.getItem('qs_tasbeeh_total');
    if (savedTotal) setTotal(parseInt(savedTotal));
    
    const savedLimit = localStorage.getItem('qs_tasbeeh_limit');
    if (savedLimit) setLimit(parseInt(savedLimit));
  }, []);

  const handleClick = () => {
    const nextCount = count + 1;
    const nextTotal = total + 1;
    
    // Physical feedback
    if ('vibrate' in navigator) {
      if (nextCount === limit) {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate(50);
      }
    }

    if (nextCount > limit) {
      setCount(1);
    } else {
      setCount(nextCount);
    }
    
    setTotal(nextTotal);
    localStorage.setItem('qs_tasbeeh_total', nextTotal.toString());
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCount(0);
    localStorage.setItem('qs_tasbeeh_limit', newLimit.toString());
  };

  const resetCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t.reset + '?')) setCount(0);
  };

  return (
    <div className="max-w-xl mx-auto min-h-[80vh] flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-500 pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black tracking-tighter dark:text-white">{t.tasbeehTitle}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t.tasbeehSubtitle}</p>
      </div>

      <div 
        className="relative group cursor-pointer active:scale-95 transition-all"
        onClick={handleClick}
      >
        {/* Modern Circular Counter */}
        <div className="w-72 h-72 md:w-96 md:h-96 rounded-full glass border-[12px] border-slate-50 dark:border-slate-900 flex flex-col items-center justify-center relative shadow-2xl transition-all group-active:shadow-inner">
          <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20 animate-spin-slow"></div>
          
          <span className="text-8xl md:text-9xl font-mono font-black text-emerald-800 dark:text-emerald-400 leading-none select-none tracking-tighter">
            {count}
          </span>
          <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-6 flex items-center gap-2">
            <Target size={12} /> {t.target}: {limit === 999 ? '∞' : limit}
          </span>

          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle 
              cx="50%" cy="50%" r="48%" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="12" 
              strokeDasharray="300%" 
              strokeDashoffset={`${300 * (1 - count / limit)}%`} 
              className="text-emerald-600 transition-all duration-300 stroke-round" 
            />
          </svg>
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
          <Zap size={14} className="text-amber-500" /> {t.tapToCount}
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-white/5 text-center shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.total}</p>
          <p className="font-black text-2xl dark:text-white">{total}</p>
        </div>
        
        <button 
          onClick={resetCount}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-white/5 flex flex-col items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group shadow-lg"
        >
          <RotateCcw className="text-slate-400 group-hover:text-rose-600 mb-1" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600">{t.reset}</span>
        </button>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-white/5 flex flex-col items-center justify-center relative shadow-lg overflow-hidden group">
          <select 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            value={limit} 
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
            <option value="33">33</option>
            <option value="100">100</option>
            <option value="999">Infinite</option>
          </select>
          <Settings2 className="text-slate-400 group-hover:text-emerald-600 mb-1" size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">{t.target}</span>
        </div>
      </div>

      <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800 text-center max-w-sm">
        <p className="text-sm text-emerald-800 dark:text-emerald-400 italic font-medium leading-relaxed">
          "The most beloved of actions to Allah are those that are most consistent, even if they are small."
        </p>
      </div>
    </div>
  );
};

export default Tasbeeh;
