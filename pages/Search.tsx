
import React, { useState } from 'react';
import { Search as SearchIcon, BookOpen, ChevronRight, Loader2, Compass, Heart, Shield, Zap, Sparkles, Star } from 'lucide-react';
import { searchAyah } from '../services/quranApi';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const SearchTopics = [
  { label: 'Patience', query: 'patience', icon: <Shield size={16} />, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Success', query: 'success', icon: <Star size={16} />, color: 'text-amber-500 bg-amber-500/10' },
  { label: 'Gratitude', query: 'grateful', icon: <Heart size={16} />, color: 'text-rose-500 bg-rose-500/10' },
  { label: 'Paradise', query: 'paradise', icon: <Sparkles size={16} />, color: 'text-emerald-500 bg-emerald-500/10' },
  { label: 'Guidance', query: 'guidance', icon: <Compass size={16} />, color: 'text-purple-500 bg-purple-500/10' },
  { label: 'Strength', query: 'strength', icon: <Zap size={16} />, color: 'text-orange-500 bg-orange-500/10' },
];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const executeSearch = async (searchTerm: string) => {
    if (searchTerm.length < 3) return;
    setLoading(true);
    try {
      const data = await searchAyah(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    executeSearch(topic);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
      <div className="text-center pt-10 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Search</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{t.ui.search}</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Charity, Wisdom, Hearts..."
          className="w-full pl-16 pr-32 py-6 bg-white/5 border-2 border-transparent dark:border-white/5 rounded-[2.5rem] shadow-2xl focus:border-emerald-600 outline-none transition-all text-xl font-bold placeholder:text-slate-700"
        />
        <button 
          type="submit"
          disabled={loading || query.length < 3}
          className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : "Search"}
        </button>
      </form>

      {!results && !loading && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div className="flex items-center gap-4">
              <div className="h-px bg-white/5 flex-grow"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.ui.discover}</span>
              <div className="h-px bg-white/5 flex-grow"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SearchTopics.map((topic) => (
                <button 
                  key={topic.label} 
                  onClick={() => handleTopicClick(topic.query)}
                  className="quran-card p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/50"
                >
                  <div className="flex items-center gap-3">
                     <div className={`p-2.5 rounded-xl ${topic.color}`}>
                        {topic.icon}
                     </div>
                     <span className="font-black text-xs uppercase tracking-widest">{topic.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
           </div>
        </div>
      )}

      {results && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{results.count} results found</p>
            <button onClick={() => { setResults(null); setQuery(''); }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {results.results.map((result: any, i: number) => (
              <Link 
                key={i} 
                to={`/surah/${result.surah.number}`}
                className="quran-card p-8 md:p-12 rounded-[3rem] border-white/5 group block transition-all"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center font-black text-sm">
                      {result.surah.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-black group-hover:text-emerald-500 transition-colors">{result.surah.englishName}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ayah {result.numberInSurah}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-slate-600 group-hover:text-emerald-500 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed italic mb-4">"{result.text}"</p>
                <div className="flex justify-end">
                  <p className="font-arabic text-3xl opacity-20" dir="rtl">{result.surah.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-emerald-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Searching Revelation...</p>
        </div>
      )}
    </div>
  );
};

export default Search;
