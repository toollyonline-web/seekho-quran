
import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck, Coffee, Server, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donation: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const paymentMethods = [
    {
      name: 'EasyPaisa',
      accountName: 'Quran Seekho Admin',
      number: '0300-1234567', // USER: Replace with your actual number
      color: 'bg-[#1fb35a]',
      icon: 'EP'
    },
    {
      name: 'JazzCash',
      accountName: 'Quran Seekho Admin',
      number: '0301-7654321', // USER: Replace with your actual number
      color: 'bg-[#ffcc00] text-black',
      icon: 'JC'
    }
  ];

  const handleCopy = (num: string, name: string) => {
    navigator.clipboard.writeText(num.replace(/-/g, ''));
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-900/10">
          <Heart size={40} fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Quran Seekho</h1>
        <p className="text-xl text-slate-500 italic max-w-2xl mx-auto">
          "The wealth of a person does not decrease by giving charity." (Prophet Muhammad PBUH)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Server className="text-green-600" /> Why Donate?
          </h2>
          <ul className="space-y-4">
            {[
              { icon: <Globe size={18} />, text: 'Domain & Hosting costs' },
              { icon: <Server size={18} />, text: 'API usage fees for translations' },
              { icon: <Sparkles size={18} />, text: 'Development of new features' },
              { icon: <Coffee size={18} />, text: 'Keeping the platform ad-free forever' }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                  {item.icon}
                </div>
                <span className="font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-800 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck /> Sadaqah Jariyah
            </h2>
            <p className="text-green-100 leading-relaxed mb-6">
              This project is a 100% voluntary effort for the Ummah. Your contribution ensures that thousands of people can continue reading the Word of Allah in a clean, beautiful environment.
            </p>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <p className="text-xs italic">
                "Whoever guides someone to goodness will have a reward like one who did it." (Sahih Muslim)
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Payment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <div key={method.name} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border dark:border-slate-700 shadow-lg relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 ${method.color.split(' ')[0]} opacity-10 rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center font-black text-xl shadow-lg`}>
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{method.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Mobile Wallet</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
                  <p className="font-bold text-lg">{method.accountName}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                    <p className="font-mono font-bold text-xl tracking-wider text-green-700 dark:text-green-400">{method.number}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(method.number, method.name)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied === method.name ? 'bg-green-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-green-600 shadow-sm'}`}
                  >
                    {copied === method.name ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <p className="mt-6 text-[10px] text-center text-slate-400 italic">
                * Please send a screenshot of the transaction to support@quranseekho.online if you'd like a confirmation.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <Link to="/" className="text-slate-500 hover:text-green-700 font-bold transition-colors">
          Return to home page
        </Link>
      </div>
    </div>
  );
};

export default Donation;
