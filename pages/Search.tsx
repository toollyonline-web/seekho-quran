
import React, { useState } from 'react';
import { Search as SearchIcon, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { searchAyah } from '../services/quranApi';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return;
    setLoading(true);
    try {
      const data = await searchAyah(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center pt-10">
        <h1 className="text-4xl font-black mb-2">Search Quran</h1>
        <p className="text-slate-500 font-medium">Search for specific words or topics across the Noble Quran.</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={24} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Patience, Paradise, Heart..."
          className="w-full pl-16 pr-32 py-6 bg-white dark:bg-slate-800 border-2 border-transparent dark:border-slate-700 rounded-[2rem] shadow-xl focus:border-green-600 outline-none transition-all text-xl font-bold"
        />
        <button 
          type="submit"
          disabled={loading || query.length < 3}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-green-700 text-white rounded-2xl font-black hover:bg-green-600 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : "Search"}
        </button>
      </form>

      {results && (
        <div className="space-y-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{results.count} results found for "{query}"</p>
          <div className="grid grid-cols-1 gap-6">
            {results.results.map((result: any, i: number) => (
              <Link 
                key={i} 
                to={`/surah/${result.surah.number}`}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm hover:border-green-400 transition-all group block"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-green-700 dark:text-green-400">Surah {result.surah.englishName}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ayah {result.numberInSurah}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic mb-4">"{result.text}"</p>
                <p className="font-arabic text-2xl text-right text-green-950/40 dark:text-white/20" dir="rtl">{result.surah.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!results && !loading && query === '' && (
        <div className="text-center py-20 opacity-20">
           <BookOpen size={80} className="mx-auto mb-4" />
           <p className="font-black uppercase tracking-[0.3em]">Knowledge is Light</p>
        </div>
      )}
    </div>
  );
};

export default Search;
