
import React, { useState, useEffect } from 'react';
import { RotateCcw, Hash, Settings2, Target } from 'lucide-react';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(33);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('qs_tasbeeh_total');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  const handleClick = () => {
    const nextCount = count + 1;
    const nextTotal = total + 1;
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
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
    if (confirm('Are you sure you want to reset current cycle?')) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Tasbeeh Counter</h1>
        <p className="text-slate-500">Perform your daily dhikr with ease.</p>
      </div>

      {/* Progress Ring / Display */}
      <div className="relative group cursor-pointer" onClick={handleClick}>
        <div className="w-64 h-64 rounded-full border-8 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center transition-all group-active:scale-95 bg-white dark:bg-slate-800 shadow-2xl shadow-green-900/10">
          <span className="text-6xl font-mono font-bold text-green-700 dark:text-green-400">{count}</span>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Target: {limit}</span>
          
          {/* Progress Circle Visual */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="124"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 124}
              strokeDashoffset={2 * Math.PI * 124 * (1 - count / limit)}
              className="text-green-600 transition-all duration-300"
            />
          </svg>
        </div>
        
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Tap to Count
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="w-full grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
          <p className="font-bold text-xl">{total}</p>
        </div>
        <button 
          onClick={reset}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 flex flex-col items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
        >
          <RotateCcw className="text-slate-400 group-hover:text-red-500 mb-1" size={18} />
          <span className="text-[10px] font-bold uppercase">Reset</span>
        </button>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 text-center flex flex-col items-center justify-center relative">
          <select 
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={limit}
            onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setCount(0);
            }}
          >
            <option value="33">33</option>
            <option value="100">100</option>
            <option value="999">Infinite</option>
          </select>
          <Target className="text-slate-400 mb-1" size={18} />
          <span className="text-[10px] font-bold uppercase">Target</span>
        </div>
      </div>

      <div className="p-4 bg-green-50 dark:bg-slate-900 rounded-2xl border border-green-100 dark:border-slate-800 text-center max-w-xs">
        <p className="text-xs text-green-800 dark:text-green-400 italic">"Verily, in the remembrance of Allah do hearts find rest." (13:28)</p>
      </div>
    </div>
  );
};

export default Tasbeeh;
