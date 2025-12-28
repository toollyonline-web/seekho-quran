
import React, { useEffect, useState } from 'react';
import { fetchSurahList } from '../services/quranApi';
import { Surah } from '../types';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const SurahList: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahList();
      setSurahs(data);
      setFilteredSurahs(data);
      setLoading(false);
    };
    loadSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter(s =>
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      s.number.toString() === searchTerm
    );
    setFilteredSurahs(filtered);
  }, [searchTerm, surahs]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Holy Quran Chapters</h1>
          <p className="text-slate-500 dark:text-slate-400">Browse and search all 114 Surahs</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or number..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/surah/${surah.number}`}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-700 dark:text-green-400 font-bold rotate-45 group-hover:rotate-0 transition-transform">
                <span className="-rotate-45 group-hover:rotate-0 transition-transform">{surah.number}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{surah.englishName}</h3>
                <p className="text-xs opacity-60">{surah.englishNameTranslation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-arabic text-xl mb-1">{surah.name}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-50">{surah.numberOfAyahs} Ayahs</p>
            </div>
          </Link>
        ))}
      </div>
      {filteredSurahs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
             <Search size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500">No Surahs found matching your search.</p>
          </div>
      )}
    </div>
  );
};

export default SurahList;
