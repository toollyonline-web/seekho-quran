
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';

const JuzList: React.FC = () => {
  const juzArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-12 page-transition pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 w-fit rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Structured Reading</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic text-white">Juz Browser</h1>
          <p className="text-slate-500 font-medium max-w-md leading-relaxed">
            The Quran is divided into 30 equal parts (Juz) for systematic reading. Each section is designed for easy navigation.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full text-slate-400 font-black text-[10px] uppercase tracking-widest border border-white/5 shadow-xl">
           <Sparkles size={16} className="text-amber-500" /> Reading Progress Saved
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {juzArray.map((num) => (
          <Link
            key={num}
            to={`/juz/${num}`}
            className="quran-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center group relative overflow-hidden h-60 border-white/5 hover:border-emerald-500/40 transition-all"
          >
            {/* Background Decorative Icon */}
            <div className="absolute -right-4 -bottom-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700 text-white">
               <BookOpen size={120} />
            </div>
            
            <span className="text-[10px] font-black text-emerald-500 mb-3 tracking-[0.4em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">Part</span>
            <span className="text-6xl font-black tracking-tighter text-white group-hover:scale-110 group-hover:text-emerald-50 transition-all duration-500 italic drop-shadow-2xl">
              {num}
            </span>
            
            <div className="mt-8 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors">
               Read Part <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </Link>
        ))}
      </div>

      <div className="mt-20 p-10 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold">Khatm-ul-Quran</h4>
            <p className="text-sm text-slate-500">Reading one Juz a day allows you to complete the entire Quran in 30 days.</p>
         </div>
         <Link to="/surah" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all">
            Switch to Surah View
         </Link>
      </div>
    </div>
  );
};

export default JuzList;
