
import React, { useEffect, useState } from 'react';
import { fetchSurahList } from '../services/quranApi';
import { Surah } from '../types';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Hash } from 'lucide-react';
import { translations, Language } from '../services/i18n';

const SurahList: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filtered, setFiltered] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahList().then(data => {
      setSurahs(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(surahs.filter(s => 
      s.englishName.toLowerCase().includes(term) || 
      s.number.toString() === term ||
      s.name.includes(term)
    ));
  }, [searchTerm, surahs]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-900/10 border-t-emerald-800 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Library...</p>
    </div>
  );

  return (
    <div className="space-y-12 page-transition pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic dark:text-white">Quran Library</h1>
          <p className="text-slate-500 font-medium max-w-sm">Discover the 114 revelations in a clean, high-typography environment.</p>
        </div>
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name, number..."
            className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border dark:border-white/5 rounded-3xl shadow-sm focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((s) => (
          <Link
            key={s.number}
            to={`/surah/${s.number}`}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 hover:border-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between group h-64"
          >
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-black text-lg group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-sm">
                  {s.number}
               </div>
               <ChevronRight className="text-slate-200 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
            </div>
            
            <div className="space-y-1 mt-auto">
               <h3 className="font-black text-2xl dark:text-white tracking-tight group-hover:text-emerald-700 transition-colors">{s.englishName}</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.englishNameTranslation}</p>
            </div>

            <div className="flex justify-between items-end mt-6 pt-4 border-t dark:border-white/5">
               <p className="font-arabic text-2xl dark:text-white">{s.name}</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700/60">{s.numberOfAyahs} Ayahs</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border dark:border-white/5">
             <Search size={64} className="mx-auto text-slate-100 mb-6" />
             <h3 className="text-xl font-bold dark:text-white">No Revelations Found</h3>
             <p className="text-slate-400 mt-2">Try a different name or Surah number.</p>
          </div>
      )}
    </div>
  );
};

export default SurahList;
