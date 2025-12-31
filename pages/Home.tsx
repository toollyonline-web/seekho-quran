
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { 
  Search as SearchIcon, BookOpen, Star, 
  ChevronRight, Sparkles, Heart, Sun, Share2, ArrowRight,
  Trophy, Zap, Target, History, Bookmark
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const MoodCards = [
  { label: 'Anxious', icon: <Zap size={20} />, color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20', path: '/search?q=patience' },
  { label: 'Sad', icon: <Heart size={20} />, color: 'bg-rose-500/10 text-rose-500', border: 'border-rose-500/20', path: '/search?q=comfort' },
  { label: 'Grateful', icon: <Sun size={20} />, color: 'bg-amber-500/10 text-amber-500', border: 'border-amber-500/20', path: '/search?q=gratitude' },
  { label: 'Lost', icon: <Sparkles size={20} />, color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20', path: '/search?q=guidance' },
];

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
];

const Home: React.FC = () => {
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({ count: 0, goal: 10 });
  const [lastRead, setLastRead] = useState<any>(null);
  const navigate = useNavigate();

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async () => {
    try {
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);
      
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

  const handleShareApp = async () => {
    const shareData = {
      title: 'Quran Seekho',
      text: 'Experience the Noble Quran in a beautiful OLED Dark sanctuary.',
      url: 'https://quranseekho.online/',
    };
    if (navigator.share) await navigator.share(shareData);
    else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied!');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  const goalProgress = Math.min(100, (dailyStats.count / dailyStats.goal) * 100);

  return (
    <div className="page-transition space-y-10 pb-24">
      
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 w-fit rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{t.home.greeting}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter italic">
              {t.home.heroTitle}
            </h1>
            <p className="text-emerald-100/70 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/surah" className="px-8 py-4 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                {t.home.browseSurahs}
              </Link>
              <button onClick={handleShareApp} className="px-8 py-4 bg-emerald-800/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-800 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
             <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-white/5 flex flex-col items-center justify-center relative bg-emerald-950/20 backdrop-blur-xl shadow-2xl">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46.5%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="292%" strokeDashoffset={`${292 * (1 - goalProgress/100)}%`} className="text-emerald-500 transition-all duration-1000" />
                   </svg>
                   <Trophy size={32} className={`mb-2 transition-transform ${goalProgress >= 100 ? 'text-amber-400 scale-125' : 'text-emerald-200'}`} />
                   <span className="text-3xl font-black">{dailyStats.count}</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Ayahs Today</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
      </section>

      {/* Resume Card (Dynamic) */}
      {lastRead && (
        <section className="animate-in slide-in-from-left duration-500">
           <Link to={`/surah/${lastRead.id}`} className="quran-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-emerald-500/20 bg-emerald-500/[0.03]">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <History size={24} />
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{t.home.resumeReading}</p>
                    <h2 className="text-2xl font-black">{lastRead.name}</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Surah {lastRead.id} • Ayah {lastRead.ayah}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                 Continue <ArrowRight size={14} />
              </div>
           </Link>
        </section>
      )}

      {/* Discover Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Target size={20} className="text-emerald-500" /> Seek Guidance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MoodCards.map((mood) => (
            <Link key={mood.label} to={mood.path} className={`p-6 rounded-[2.5rem] border-2 ${mood.border} ${mood.color} flex flex-col items-center justify-center gap-3 group transition-all hover:scale-105 active:scale-95`}>
              <div className="p-3 bg-white/10 rounded-2xl">
                {mood.icon}
              </div>
              <span className="font-black text-xs uppercase tracking-widest">{mood.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Surahs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-500" /> {t.home.popularSurahs}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {PopularSurahs.map((surah) => (
              <Link key={surah.id} to={`/surah/${surah.id}`} className="quran-card p-6 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{surah.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{surah.translation}</p>
                  </div>
                </div>
                <span className="font-arabic text-3xl opacity-10 group-hover:opacity-40 transition-opacity absolute right-6" dir="rtl">{surah.arabic}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Ayah of the Day */}
        <section className="space-y-6">
           <h2 className="text-xl font-black flex items-center gap-2">
             <Sparkles size={20} className="text-amber-500" /> {t.home.knowledgeDay}
           </h2>
           {randomAyah && (
             <div className="quran-card p-10 rounded-[3rem] text-center space-y-8 bg-gradient-to-br from-[#121415] to-[#0b0c0d] h-full flex flex-col justify-center">
                <p className="font-arabic text-3xl text-emerald-500 leading-relaxed" dir="rtl">
                   {randomAyah[0].text}
                </p>
                <div className="h-px bg-white/5 w-1/2 mx-auto"></div>
                <p className="text-slate-400 italic leading-relaxed text-sm">
                   "{randomAyah[1].text}"
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                   Surah {randomAyah[0].surah?.englishName || 'Al-Quran'}
                </p>
             </div>
           )}
        </section>
      </div>

    </div>
  );
};

export default Home;
