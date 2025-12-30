
import React, { useState, useEffect } from 'react';
import { RotateCcw, Hash, Settings2, Target } from 'lucide-react';
import { translations, Language } from '../services/i18n';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(33);
  const [total, setTotal] = useState(0);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  useEffect(() => {
    const savedTotal = localStorage.getItem('qs_tasbeeh_total');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  const handleClick = () => {
    const nextCount = count + 1;
    const nextTotal = total + 1;
    if ('vibrate' in navigator) navigator.vibrate(50);
    if (nextCount > limit) {
      setCount(1);
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    } else {
      setCount(nextCount);
    }
    setTotal(nextTotal);
    localStorage.setItem('qs_tasbeeh_total', nextTotal.toString());
  };

  const reset = () => {
    if (confirm(t.tools.reset + '?')) setCount(0);
  };

  return (
    <div className="max-w-lg mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black">{t.tools.tasbeehTitle}</h1>
        <p className="text-slate-500 font-medium">{t.tools.tasbeehSubtitle}</p>
      </div>

      <div className="relative group cursor-pointer" onClick={handleClick}>
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all group-active:scale-95 bg-white dark:bg-slate-800 shadow-2xl">
          <span className="text-7xl md:text-8xl font-mono font-black text-green-700 dark:text-green-400 leading-none">{count}</span>
          <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-4">{t.tools.target}: {limit}</span>
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="300%" strokeDashoffset={`${300 * (1 - count / limit)}%`} className="text-green-600 transition-all duration-300" />
          </svg>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-700 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
          {t.tools.tapToCount}
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border dark:border-slate-700 text-center shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.tools.total}</p>
          <p className="font-black text-2xl">{total}</p>
        </div>
        <button onClick={reset} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border dark:border-slate-700 flex flex-col items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group shadow-sm">
          <RotateCcw className="text-slate-400 group-hover:text-red-500 mb-1" size={24} />
          <span className="text-[10px] font-black uppercase">{t.tools.reset}</span>
        </button>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border dark:border-slate-700 text-center flex flex-col items-center justify-center relative shadow-sm">
          <select className="absolute inset-0 opacity-0 cursor-pointer" value={limit} onChange={(e) => { setLimit(parseInt(e.target.value)); setCount(0); }}>
            <option value="33">33</option><option value="100">100</option><option value="999">∞</option>
          </select>
          <Target className="text-slate-400 mb-1" size={24} />
          <span className="text-[10px] font-black uppercase">{t.tools.target}</span>
        </div>
      </div>

      <div className="p-6 bg-green-50 dark:bg-slate-900 rounded-3xl border border-green-100 dark:border-slate-800 text-center max-w-xs shadow-inner">
        <p className="text-xs text-green-800 dark:text-green-400 italic font-medium leading-relaxed">"Verily, in the remembrance of Allah do hearts find rest." (13:28)</p>
      </div>
    </div>
  );
};

export default Tasbeeh;
