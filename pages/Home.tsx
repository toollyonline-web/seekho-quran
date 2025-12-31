
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRandomAyah, fetchSurahList } from '../services/quranApi';
import { 
  Search as SearchIcon, BookOpen, Star, 
  ChevronRight, Sparkles, Heart, Sun, Share2, ArrowRight,
  Trophy, Zap, Target, History, GraduationCap, Map
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran', desc: 'Read Surah Yaseen online' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful', desc: 'Read Surah Rehman online' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave', desc: 'Read Surah Kahf online' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty', desc: 'Read Surah Mulk online' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', translation: 'The Inevitable', desc: 'Read Surah Waqiah online' },
];

const Home: React.FC = () => {
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({ count: 0, goal: 10 });
  const [lastRead, setLastRead] = useState<any>(null);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async () => {
    try {
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);
      
      const list = await fetchSurahList();
      setSurahs(list);

      const stats = JSON.parse(localStorage.getItem('qs_daily_stats') || '{}');
      const today = new Date().toDateString();
      if (stats.date === today) {
        setDailyStats(prev => ({ ...prev, count: stats.count }));
      }

      const savedLastRead = localStorage.getItem('qs_last_read');
      if (savedLastRead) {
        setLastRead(JSON.parse(savedLastRead));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const goalProgress = Math.min(100, (dailyStats.count / dailyStats.goal) * 100);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="page-transition space-y-16 pb-32">
      
      {/* Hero Section with SEO H1 */}
      <section className="bg-emerald-900 text-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 w-fit rounded-full backdrop-blur-md border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{t.home.greeting}</span>
            </div>
            
            {/* SEO H1 Heading */}
            <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter italic">
              Read Quran Online – <br/> All Surahs & Siparas
            </h1>
            
            {/* SEO Intro Paragraph */}
            <p className="text-emerald-100/70 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
              Welcome to <strong>Quran Seekho</strong>, your professional digital sanctuary for reading and listening to the Noble Quran. Explore all 114 Surahs and 30 Juz with interactive Tajweed, multi-language translations, and world-class audio recitations.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              <Link to="/surah" className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                Browse All Surahs
              </Link>
              <Link to="/search" className="px-10 py-5 bg-emerald-800/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-800 transition-all">
                Search Verses
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
             <div className="relative scale-110">
                <div className="w-56 h-56 rounded-full border-8 border-white/5 flex flex-col items-center justify-center relative bg-emerald-950/20 backdrop-blur-xl shadow-2xl">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46.5%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="292%" strokeDashoffset={`${292 * (1 - goalProgress/100)}%`} className="text-emerald-500 transition-all duration-1000" />
                   </svg>
                   <Trophy size={40} className={`mb-3 transition-transform ${goalProgress >= 100 ? 'text-amber-400 scale-125' : 'text-emerald-200'}`} />
                   <span className="text-4xl font-black">{dailyStats.count}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ayahs Today</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
      </section>

      {/* Featured SEO Links (Popular Surahs) */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <Sparkles size={24} className="text-amber-500" /> Featured Chapters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="quran-card p-8 rounded-[2.5rem] flex flex-col items-center text-center group border-white/5 hover:border-emerald-500/50 transition-all">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs text-slate-500 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {surah.id}
               </div>
               <h3 className="text-xl font-bold mb-1">{surah.name}</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{surah.translation}</p>
               <span className="font-arabic text-3xl text-emerald-500 opacity-60 mb-2" dir="rtl">{surah.arabic}</span>
               <p className="text-[9px] text-slate-600 font-medium italic mt-2">{surah.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Comprehensive Index (SEO Goldmine) */}
      <section className="bg-white/5 p-12 rounded-[4rem] border border-white/5 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
           <div className="w-16 h-16 bg-emerald-600/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Map size={32} />
           </div>
           <h2 className="text-3xl font-black italic">The Complete Quran Index</h2>
           <p className="text-slate-500 font-medium leading-relaxed">
             Quickly access any Surah or Sipara from our organized directory. This is designed for both speed of use and optimal indexing by search engines like Google.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Surah Sitemap Link Block */}
          <div className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 border-b border-white/5 pb-4">All 114 Surahs</h3>
             <div className="grid grid-cols-3 gap-y-3 gap-x-4">
                {surahs.slice(0, 114).map(s => (
                  <Link key={s.number} to={`/surah/${s.number}`} className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors py-1 truncate">
                    {s.number}. {s.englishName}
                  </Link>
                ))}
             </div>
          </div>

          {/* Juz Sitemap Link Block */}
          <div className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 border-b border-white/5 pb-4">All 30 Siparas (Juz)</h3>
             <div className="grid grid-cols-3 gap-y-3 gap-x-4">
                {Array.from({length: 30}).map((_, i) => (
                  <Link key={i+1} to={`/juz/${i+1}`} className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors py-1">
                    Juz {i+1}
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
