
import React, { useState, useEffect } from 'react';
import { Coins, Info, Calculator, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { translations, Language } from '../services/i18n';

const ZakatCalculator: React.FC = () => {
  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  
  const [totalWealth, setTotalWealth] = useState(0);
  const [zakatAmount, setZakatAmount] = useState(0);
  const [isNisabReached, setIsNisabReached] = useState(false);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  const NISAB_GOLD_VALUE = 6000;

  useEffect(() => {
    const total = cash + gold + silver + investments - liabilities;
    const wealth = Math.max(0, total);
    setTotalWealth(wealth);
    if (wealth >= NISAB_GOLD_VALUE) {
      setIsNisabReached(true);
      setZakatAmount(wealth * 0.025);
    } else {
      setIsNisabReached(false);
      setZakatAmount(0);
    }
  }, [cash, gold, silver, investments, liabilities]);

  const reset = () => {
    setCash(0); setGold(0); setSilver(0); setInvestments(0); setLiabilities(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-xl">
          <Coins size={40} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">{t.tools.zakatTitle}</h1>
        <p className="text-slate-500 font-medium">{t.tools.zakatSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border dark:border-slate-700">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2">
            <Calculator size={24} className="text-green-600" /> {t.tools.assets}
          </h2>
          <div className="space-y-6">
            {[
              { label: t.tools.cash, value: cash, set: setCash },
              { label: t.tools.goldSilver, value: gold, set: setGold },
              { label: t.tools.investments, value: investments, set: setInvestments },
              { label: t.tools.liabilities, value: liabilities, set: setLiabilities, color: 'text-red-400' }
            ].map((field, i) => (
              <div key={i} className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${field.color || 'text-slate-400'}`}>{field.label}</label>
                <input type="number" className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-green-600 outline-none font-black text-lg transition-all" value={field.value || ''} onChange={(e) => field.set(Number(e.target.value))} placeholder="0.00" />
              </div>
            ))}
            <button onClick={reset} className="mt-4 flex items-center justify-center gap-2 w-full py-4 text-slate-400 hover:text-red-500 transition-all font-black text-xs uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
              <RotateCcw size={18} /> {t.tools.reset}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-green-700 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-10">
              <div>
                <p className="text-green-200 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{t.tools.netWealth}</p>
                <p className="text-5xl md:text-6xl font-black leading-none">${totalWealth.toLocaleString()}</p>
              </div>
              <div className="h-px bg-white/20"></div>
              <div>
                <p className="text-green-200 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{t.tools.dueZakat} (2.5%)</p>
                <p className="text-6xl md:text-7xl font-black leading-none">${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl flex items-start gap-4 border border-white/20">
                {isNisabReached ? <ShieldCheck size={24} className="text-green-300 shrink-0" /> : <Info size={24} className="shrink-0" />}
                <p className="text-xs font-bold leading-relaxed">{isNisabReached ? "Nisab reached. Zakat is mandatory." : "Wealth below Nisab limit."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
