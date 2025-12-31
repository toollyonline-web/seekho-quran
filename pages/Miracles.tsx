
import React, { useState } from 'react';
import { 
  Microscope, Sparkles, Binary, PenTool, 
  ChevronRight, ArrowRight, BookOpenCheck,
  Scale, Globe, Atom, Info, Star, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Miracle {
  id: string;
  category: 'Scientific' | 'Linguistic' | 'Mathematical';
  title: string;
  arabicTitle: string;
  ayahRef: string;
  ayahArabic: string;
  explanation: string;
  icon: React.ReactElement; // Changed from ReactNode to ReactElement to support cloning
}

const MIRACLES: Miracle[] = [
  {
    id: 'expanding-universe',
    category: 'Scientific',
    title: 'The Expanding Universe',
    arabicTitle: 'توسع الكون',
    ayahRef: 'Surah Adh-Dhariyat (51:47)',
    ayahArabic: 'وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ',
    explanation: 'Modern cosmology discovered the expansion of the universe in the 20th century. However, 1,400 years ago, the Quran clearly stated: "And the heaven We constructed with strength, and indeed, We are [its] expander."',
    icon: <Globe className="text-blue-400" />
  },
  {
    id: 'embryology',
    category: 'Scientific',
    title: 'Stages of Embryology',
    arabicTitle: 'أطوار الجنين',
    ayahRef: 'Surah Al-Mu’minun (23:12-14)',
    ayahArabic: 'ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً',
    explanation: 'The Quran describes the development of the human embryo using precise terms like "Alaqah" (clinging substance) and "Mudghah" (chewed-like flesh), matching modern embryological observations long before microscopes existed.',
    icon: <Atom className="text-emerald-400" />
  },
  {
    id: 'mountains',
    category: 'Scientific',
    title: 'Mountains as Pegs',
    arabicTitle: 'الجبال أوتادا',
    ayahRef: 'Surah An-Naba (78:6-7)',
    ayahArabic: 'أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا وَالْجِبَالَ أَوْتَادًا',
    explanation: 'Geology confirms that mountains have deep roots underground, much like pegs (Awtad) that help stabilize the earth’s crust. This structural description was explicitly mentioned in the Quran.',
    icon: <Scale className="text-amber-400" />
  },
  {
    id: 'linguistic-challenge',
    category: 'Linguistic',
    title: 'The Inimitable Challenge',
    arabicTitle: 'التحدي اللغوي',
    ayahRef: 'Surah Al-Baqarah (2:23)',
    ayahArabic: 'فَأْتُوا بِسُورَةٍ مِنْ مِثْلِهِ',
    explanation: 'The Quran contains a standing challenge: "Produce a Surah like it." Despite the Arabic language being at its peak during revelation, no one has ever matched its unique rhythm, legal precision, and rhythmic prose.',
    icon: <PenTool className="text-rose-400" />
  },
  {
    id: 'word-balance',
    category: 'Mathematical',
    title: 'The Balance of Words',
    arabicTitle: 'التوازن العددي',
    ayahRef: 'Linguistic Symmetry',
    ayahArabic: 'الميزان الرقمي',
    explanation: 'The Quran displays uncanny mathematical symmetry. For example, the word "Dunya" (this life) appears 115 times, and "Akhirah" (afterlife) also appears exactly 115 times. "Angel" and "Devil" both appear 88 times.',
    icon: <Binary className="text-purple-400" />
  }
];

const MiracleCard: React.FC<{ miracle: Miracle }> = ({ miracle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="quran-card p-8 md:p-12 rounded-[3.5rem] border-white/5 group relative overflow-hidden transition-all hover:border-emerald-500/50">
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              {miracle.icon}
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 block">
                {miracle.category} Sign
              </span>
              <h3 className="text-2xl font-black italic text-white group-hover:text-emerald-400 transition-colors">
                {miracle.title}
              </h3>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-arabic text-3xl opacity-20 group-hover:opacity-60 transition-opacity" dir="rtl">
              {miracle.arabicTitle}
            </p>
          </div>
        </div>

        <div className="bg-emerald-950/20 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
           <p className="font-arabic text-3xl text-right leading-relaxed text-emerald-100/90" dir="rtl">
             {miracle.ayahArabic}
           </p>
           <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {miracle.ayahRef}
              </span>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Explore Sign'} <ChevronRight size={14} className={isExpanded ? 'rotate-90' : ''} />
              </button>
           </div>
        </div>

        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {miracle.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-1000">
         {React.cloneElement(miracle.icon as React.ReactElement<any>, { size: 280 })}
      </div>
    </div>
  );
};

const Miracles: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Scientific', 'Linguistic', 'Mathematical'];
  const filtered = activeCategory === 'All' 
    ? MIRACLES 
    : MIRACLES.filter(m => m.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="text-center space-y-8 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-emerald-500 transition-colors mb-4">
           <ChevronLeft size={14} /> Back to Portal
        </Link>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <Sparkles size={200} className="text-emerald-500" />
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-white drop-shadow-2xl relative z-10">
            Miracles of <br/> The Quran
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Evidence beyond human reach. Discover the signs that prove the divine origin of the Noble Revelation.
        </p>
      </div>

      {/* Discovery Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/30 scale-105' 
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Signs */}
      <div className="grid grid-cols-1 gap-12">
        {filtered.map(miracle => (
          <MiracleCard key={miracle.id} miracle={miracle} />
        ))}
      </div>

      {/* Spiritual Summary Footer */}
      <section className="bg-emerald-900 text-white p-12 md:p-20 rounded-[4rem] text-center space-y-10 relative overflow-hidden border border-white/5 shadow-2xl mt-24">
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-xl border border-white/20">
             <BookOpenCheck size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic leading-none">A Book of Signs</h2>
          <p className="text-emerald-50 max-w-2xl mx-auto text-xl leading-relaxed font-medium opacity-80">
            "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth."
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/surah" className="px-12 py-6 bg-white text-emerald-950 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
              Read the Text <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-[100px]"></div>
      </section>

      <div className="text-center py-12">
         <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">Quran Seekho • Rational Foundation</p>
      </div>
    </div>
  );
};

export default Miracles;
