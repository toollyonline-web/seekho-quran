
import React, { useEffect, useState } from 'react';
import { fetchSurahList } from '../services/quranApi';
import { Surah } from '../types';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-[#2ca4ab] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 page-transition pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">Surahs</h1>
          <p className="text-slate-500 font-medium">Browse and read the 114 chapters of the Quran.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search surah name or number..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#181a1b] border dark:border-[#2c2e30] rounded-xl outline-none focus:ring-2 focus:ring-[#2ca4ab] transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link
            key={s.number}
            to={`/surah/${s.number}`}
            className="quran-card p-6 rounded-2xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-[#2ca4ab] group-hover:text-white transition-all">
                  {s.number}
               </div>
               <div>
                 <h3 className="font-bold text-lg dark:text-white group-hover:text-[#2ca4ab] transition-colors">{s.englishName}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.englishNameTranslation}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="font-arabic text-xl dark:text-white mb-1">{s.name}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.numberOfAyahs} Ayahs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
