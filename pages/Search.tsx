
import React, { useState } from 'react';
import { Search as SearchIcon, BookOpen, ChevronRight, Loader2, Compass, Heart, Shield, Zap, Sparkles, Star, AlertCircle } from 'lucide-react';
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
    setResults(null); // Clear old results to show loading state properly
    try {
      const data = await searchAyah(searchTerm);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults({ matches: [], count: 0 });
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
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none">Discovery</h1>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{t.ui.search}</p>
      </div>

      {/* Modern Search Input */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
        <div className="relative">
          <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-all group-focus-within:scale-110" size={24} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Surahs, Wisdom, or specific terms..."
            className="w-full pl-16 pr-36 py-6 md:py-8 bg-white/5 border-2 border-white/5 rounded-[2.5rem] shadow-2xl focus:border-emerald-600/50 focus:bg-white/[0.07] outline-none transition-all text-xl md:text-2xl font-black placeholder:text-slate-700"
          />
          <button 
            type="submit"
            disabled={loading || query.length < 3}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Search"}
          </button>
        </div>
      </form>

      {/* Empty State / Discovery Topics */}
      {!results && !loading && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div className="flex items-center gap-6">
              <div className="h-px bg-white/5 flex-grow"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-600 shrink-0">Explore Topics</span>
              <div className="h-px bg-white/5 flex-grow"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {SearchTopics.map((topic) => (
                <button 
                  key={topic.label} 
                  onClick={() => handleTopicClick(topic.query)}
                  className="quran-card p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] transition-all"
                >
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${topic.color} group-hover:scale-110 transition-transform shadow-inner`}>
                        {topic.icon}
                     </div>
                     <span className="font-black text-xs uppercase tracking-[0.2em]">{topic.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:translate-x-1 transition-transform group-hover:text-emerald-500" />
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Search Results */}
      {results && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center font-black">
                {results.count}
              </div>
              <h2 className="text-2xl font-black italic">Matches Found</h2>
            </div>
            <button 
              onClick={() => { setResults(null); setQuery(''); }} 
              className="px-6 py-2.5 bg-white/5 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-white/5"
            >
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {results.matches && results.matches.length > 0 ? (
              results.matches.map((match: any, i: number) => (
                <Link 
                  key={i} 
                  to={`/surah/${match.surah.number}?ayah=${match.numberInSurah}`}
                  className="quran-card p-10 md:p-14 rounded-[3.5rem] border-white/5 group block transition-all hover:bg-emerald-500/[0.02] relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl text-emerald-500 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        {match.surah.number}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black italic text-white group-hover:text-emerald-500 transition-colors leading-none">{match.surah.englishName}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Chapter {match.surah.number} • Verse {match.numberInSurah}</p>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-emerald-600/10 group-hover:text-emerald-500 transition-all shadow-sm">
                      <BookOpen size={24} />
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-slate-400 leading-relaxed italic font-medium mb-8 relative z-10">
                    "{match.text}"
                  </p>

                  <div className="flex justify-between items-end border-t border-white/5 pt-10 relative z-10">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60">
                       <Sparkles size={16} /> Reading in English
                    </div>
                    <p className="font-arabic text-4xl text-white/10 group-hover:text-emerald-500/20 transition-all" dir="rtl">{match.surah.name}</p>
                  </div>

                  {/* Aesthetic Background Watermark */}
                  <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity pointer-events-none">
                    <span className="text-9xl font-black italic">{match.surah.number}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-32 bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <AlertCircle size={40} />
                </div>
                <h2 className="text-3xl font-black italic text-white mb-4">No Matches Found</h2>
                <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg">We couldn't find any verses matching your search criteria. Please try different keywords or a broader topic.</p>
                <button 
                  onClick={() => { setResults(null); setQuery(''); }}
                  className="mt-10 px-10 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 transition-all"
                >
                   Try Discovery Topics
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
          <div className="w-20 h-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="space-y-2 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-emerald-500 shadow-emerald-500/20">Searching Revelation</p>
            <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Querying Global Databases...</p>
          </div>
        </div>
      )}

      {/* Footer Quote */}
      {!loading && !results && (
        <div className="text-center pt-12">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.8em]">Quran Seekho • Semantic Engine</p>
        </div>
      )}
    </div>
  );
};

export default Search;
