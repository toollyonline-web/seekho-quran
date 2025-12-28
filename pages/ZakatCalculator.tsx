
import React, { useState, useEffect } from 'react';
import { Coins, Info, Calculator, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

const ZakatCalculator: React.FC = () => {
  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  
  const [totalWealth, setTotalWealth] = useState(0);
  const [zakatAmount, setZakatAmount] = useState(0);
  const [isNisabReached, setIsNisabReached] = useState(false);

  // Approximate Nisab (Current global averages for example purposes)
  const NISAB_GOLD_VALUE = 6000; // USD approx

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
    setCash(0);
    setGold(0);
    setSilver(0);
    setInvestments(0);
    setLiabilities(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12">
          <Coins size={40} />
        </div>
        <h1 className="text-4xl font-bold">Zakat Calculator</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed italic">
          "Take from their wealth a charity by which you purify them and cause them increase." (9:103)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-green-600" /> Assets & Wealth
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Cash (Home & Bank)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-green-600 outline-none font-bold"
                  value={cash || ''}
                  onChange={(e) => setCash(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Gold & Silver Value</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-green-600 outline-none font-bold"
                  value={gold + silver || ''}
                  onChange={(e) => setGold(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Investments / Shares</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-green-600 outline-none font-bold"
                  value={investments || ''}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div className="pt-4 border-t dark:border-slate-700">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-red-400">Debts & Liabilities</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-none focus:ring-2 focus:ring-red-500 outline-none font-bold text-red-600"
                    value={liabilities || ''}
                    onChange={(e) => setLiabilities(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={reset}
              className="mt-8 flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <RotateCcw size={16} /> Reset All Fields
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-green-700 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div>
                <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">Net Zakatable Wealth</p>
                <p className="text-5xl font-bold">${totalWealth.toLocaleString()}</p>
              </div>

              <div className="h-px bg-white/20"></div>

              <div>
                <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">Total Zakat Due (2.5%)</p>
                <p className="text-6xl font-bold">${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>

              {!isNisabReached ? (
                <div className="bg-white/10 p-4 rounded-2xl flex items-start gap-3">
                  <Info size={20} className="shrink-0" />
                  <p className="text-xs leading-relaxed">
                    Your wealth is below the estimated Nisab ({NISAB_GOLD_VALUE}). Zakat is not mandatory, but optional Sadaqah is always rewarded.
                  </p>
                </div>
              ) : (
                <div className="bg-white/10 p-4 rounded-2xl flex items-start gap-3 border border-white/20">
                  <ShieldCheck size={20} className="shrink-0 text-green-300" />
                  <p className="text-xs leading-relaxed font-bold">
                    Alhamdulillah, your wealth has reached the Nisab. Paying Zakat is an obligation and a means of purification.
                  </p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border dark:border-slate-700">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info size={16} className="text-green-600" /> Important Guidelines
            </h3>
            <ul className="text-sm text-slate-500 space-y-4">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                <span>Zakat is only mandatory if wealth has been held for one lunar year (Hawl).</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                <span>The Nisab is equal to 87.48g of gold or 612.36g of silver.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                <span>Ensure values are in your local currency for accuracy.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
