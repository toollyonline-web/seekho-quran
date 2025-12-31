
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';

const JuzList: React.FC = () => {
  const juzArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-12 page-transition pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic dark:text-white">Juz Browser</h1>
          <p className="text-slate-500 font-medium max-w-md">The Quran is divided into 30 equal parts (Juz) for systematic reading throughout the month.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-800 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest">
           <Sparkles size={16} /> Reading Progress Saved
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {juzArray.map((num) => (
          <Link
            key={num}
            to={`/juz/${num}`}
            className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-white/5 flex flex-col items-center justify-center hover:border-emerald-700 hover:shadow-2xl transition-all group relative overflow-hidden h-52"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <BookOpen size={64} />
            </div>
            
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-500 mb-3 tracking-[0.4em] uppercase">Part</span>
            <span className="text-5xl font-black tracking-tighter dark:text-white group-hover:scale-110 transition-transform italic">{num}</span>
            
            <div className="mt-6 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-300 group-hover:text-emerald-700 transition-colors">
               Read Part <ChevronRight size={10} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JuzList;
