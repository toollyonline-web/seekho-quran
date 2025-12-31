
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

      const stats = JSON.parse(localStorage.getItem('qs_daily_stats') || '{"count":0,"date":""}');
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
      
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 w-fit rounded-full backdrop-blur-md border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{t.home.greeting}</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter italic">
              Experience the Noble Quran <br/> with Pure Clarity
            </h1>
            
            <p className="text-emerald-100/70 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
              Access 114 Surahs and 30 Juz with interactive Tajweed, scholarly translations, and world-class audio recitations. Designed for deep study and daily reflection.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              {lastRead ? (
                <Link to={`/${lastRead.type}/${lastRead.id}`} className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                  <History size={18} /> Resume: {lastRead.name}
                </Link>
              ) : (
                <Link to="/surah" className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Start Reading
                </Link>
              )}
              <Link to="/search" className="px-10 py-5 bg-emerald-800/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-800 transition-all">
                Discovery Mode
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
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ayahs Recited</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
      </section>

      {/* Daily Bread Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="quran-card p-10 rounded-[3rem] space-y-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verse of the Day</span>
               <Sparkles size={18} className="text-amber-500" />
            </div>
            {randomAyah ? (
              <div className="space-y-6">
                <p className="font-arabic text-3xl text-right leading-relaxed" dir="rtl">{randomAyah[0].text}</p>
                <p className="text-slate-400 italic text-sm font-medium">"{randomAyah[1].text}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                   <span className="text-[10px] font-black uppercase text-slate-600">{randomAyah[0].surah.englishName} {randomAyah[0].numberInSurah}</span>
                   <Link to={`/surah/${randomAyah[0].surah.number}?ayah=${randomAyah[0].numberInSurah}`} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Study Context</Link>
                </div>
              </div>
            ) : <p className="text-slate-500">Connecting to wisdom...</p>}
         </div>

         <div className="grid grid-cols-2 gap-6">
            <Link to="/vocabulary" className="quran-card p-8 rounded-[2.5rem] flex flex-col justify-center gap-4 hover:border-amber-500/50 transition-all group">
               <div className="w-12 h-12 bg-amber-600/10 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><GraduationCap size={24}/></div>
               <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Vocabulary</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">500 Core Words</p>
               </div>
            </Link>
            <Link to="/ai" className="quran-card p-8 rounded-[2.5rem] flex flex-col justify-center gap-4 hover:border-emerald-500/50 transition-all group">
               <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Sparkles size={24}/></div>
               <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Soul Guide</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Spiritual Chat</p>
               </div>
            </Link>
            <Link to="/history-map" className="quran-card p-8 rounded-[2.5rem] flex flex-col justify-center gap-4 hover:border-blue-500/50 transition-all group">
               <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Map size={24}/></div>
               <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">History Map</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Explore Sites</p>
               </div>
            </Link>
            <Link to="/moods" className="quran-card p-8 rounded-[2.5rem] flex flex-col justify-center gap-4 hover:border-rose-500/50 transition-all group">
               <div className="w-12 h-12 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Heart size={24}/></div>
               <div>
                  <h4 className="font-black text-sm uppercase tracking-widest mb-1">Moods</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Spiritual Remedy</p>
               </div>
            </Link>
         </div>
      </section>

      {/* Featured Chapters */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <Star size={24} className="text-amber-500" /> Quick Access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="quran-card p-8 rounded-[2.5rem] flex flex-col items-center text-center group border-white/5 hover:border-emerald-500/50 transition-all">
               <span className="font-arabic text-4xl text-emerald-500 opacity-60 mb-3 group-hover:opacity-100 transition-opacity" dir="rtl">{surah.arabic}</span>
               <h3 className="text-xl font-bold mb-1">{surah.name}</h3>
               <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{surah.translation}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
