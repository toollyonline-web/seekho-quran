
import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck, Coffee, Server, Globe, Sparkles, Star, ChevronRight, Gift, HandsPraying } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donation: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const paymentMethods = [
    {
      name: 'EasyPaisa',
      accountName: 'HUZAIFA BIN SARDAR',
      number: '03165864192',
      display: '0316-5864192',
      color: 'bg-[#1fb35a]',
      icon: 'EP'
    },
    {
      name: 'JazzCash',
      accountName: 'HUZAIFA BIN SARDAR',
      number: '03165864192',
      display: '0316-5864192',
      color: 'bg-[#ffcc00] text-black',
      icon: 'JC'
    }
  ];

  const handleCopy = (num: string, name: string) => {
    navigator.clipboard.writeText(num);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700 pb-32">
      {/* Premium Hero Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
           <Heart size={300} className="text-rose-500" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-500/20 rotate-3">
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-white drop-shadow-2xl">
            Sadaqah Jariyah
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 italic max-w-3xl mx-auto leading-relaxed font-medium">
            "When a person dies, his deeds come to an end except for three: Ongoing charity..."
          </p>
          <div className="flex justify-center pt-4">
             <span className="px-6 py-2 bg-emerald-600/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.4em]">100% Voluntary Project</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Mission Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="quran-card p-10 md:p-14 rounded-[4rem] border-white/5 space-y-10 relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <h2 className="text-3xl font-black italic flex items-center gap-4">
                   <Star className="text-amber-500" fill="currentColor" /> Our Commitment
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                   Quran Seekho is a labor of love for the Ummah. We provide a pure, ad-free digital sanctuary for the Word of Allah. To keep our high-speed servers and AI features running globally, we rely on the generosity of our brothers and sisters.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                   {[
                     { icon: <Globe />, title: "Global Hosting", desc: "Fast access from any country" },
                     { icon: <Server />, title: "AI compute", desc: "Powering our Soul Guide" },
                     { icon: <Sparkles />, title: "No Ads", desc: "Distraction-free reading" },
                     { icon: <Coffee />, title: "Free Updates", desc: "Continuous improvement" }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="w-10 h-10 bg-emerald-600/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                           {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
                        </div>
                        <div>
                           <p className="font-black text-xs uppercase text-white tracking-widest">{item.title}</p>
                           <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="lg:col-span-5">
           <div className="h-full bg-emerald-900 rounded-[4rem] p-12 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                 <ShieldCheck size={200} />
              </div>
              <div className="relative z-10 space-y-6">
                 <Gift size={48} className="text-emerald-400 mb-4" />
                 <h3 className="text-3xl font-black italic leading-tight">Invest in your Akhirah</h3>
                 <p className="text-emerald-100/70 text-lg font-medium leading-relaxed">
                    Every letter read on this platform becomes a potential reward for you. Your $1 or $10 helps us reach thousands of seekers every month.
                 </p>
              </div>
              <div className="relative z-10 mt-12 p-6 bg-emerald-950/40 rounded-[2.5rem] border border-white/10">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                       <HandsPraying className="text-white" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Dua for Donors</p>
                       <p className="text-sm font-bold">May Allah barakah your wealth.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-12">
        <div className="flex items-center gap-6">
           <div className="h-px bg-white/5 flex-grow"></div>
           <h2 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 shrink-0">Payment Channels (Pakistan)</h2>
           <div className="h-px bg-white/5 flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {paymentMethods.map((method) => (
            <div key={method.name} className="quran-card p-10 md:p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className={`absolute top-0 right-0 w-32 h-32 ${method.color.split(' ')[0]} opacity-5 rounded-bl-[6rem] group-hover:scale-125 transition-transform`}></div>
              
              <div className="flex items-center gap-6 mb-10">
                <div className={`w-16 h-16 rounded-[1.5rem] ${method.color} flex items-center justify-center font-black text-2xl shadow-xl`}>
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic text-white">{method.name}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Direct Wallet Transfer</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Holder</p>
                  <p className="font-black text-xl text-white">{method.accountName}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group/field hover:bg-white/[0.08] transition-colors">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Number</p>
                    <p className="font-mono font-black text-3xl tracking-tighter text-emerald-500">{method.display}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(method.number, method.name)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${copied === method.name ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'bg-white/10 text-slate-400 hover:text-white shadow-xl active:scale-90'}`}
                  >
                    {copied === method.name ? <Check size={24} /> : <Copy size={24} />}
                  </button>
                </div>
              </div>

              <p className="mt-8 text-[10px] text-center text-slate-600 italic font-bold uppercase tracking-widest">
                * Please notify us via email for confirmation.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Worldwide Support */}
      <div className="mt-24 p-12 bg-white/5 rounded-[4rem] border border-dashed border-white/10 text-center space-y-6 max-w-2xl mx-auto">
         <Globe size={48} className="mx-auto text-slate-700 animate-spin-slow" />
         <h3 className="text-2xl font-black italic">International Support</h3>
         <p className="text-slate-500 font-medium leading-relaxed">
            For donations from outside Pakistan (Paypal/Credit Card), please reach out to our team directly. We are currently working on integrating global payment gateways.
         </p>
         <a href="mailto:support@quranseekho.online" className="inline-flex items-center gap-3 text-emerald-500 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-colors">
            Contact Support <ChevronRight size={16} />
         </a>
      </div>

      <div className="mt-20 text-center">
        <Link to="/" className="text-slate-700 hover:text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em] transition-all">
          Return to Portal
        </Link>
      </div>
    </div>
  );
};

export default Donation;
