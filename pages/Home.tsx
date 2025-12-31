
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { 
  Search as SearchIcon, BookOpen, Star, 
  ChevronRight, Sparkles, Heart, Sun, Share2, ArrowRight,
  Trophy, Zap, Target
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
    <div className="page-transition space-y-10 pb-20">
      
      {/* Hero with Goal Tracker */}
      <section className="bg-emerald-800 text-white p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter italic">
              {t.home.heroTitle}
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl font-medium leading-relaxed opacity-80 max-w-xl">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/surah" className="px-8 py-4 bg-emerald-950/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900/60 transition-all">
                Browse Revelation
              </Link>
              <button onClick={handleShareApp} className="px-8 py-4 bg-emerald-600/50 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600/70 transition-all">
                <Share2 size={18} /> Share Light
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
             <div className="relative group">
                <div className="w-48 h-48 rounded-full border-8 border-white/10 flex flex-col items-center justify-center relative bg-emerald-900/20 backdrop-blur-xl shadow-2xl">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46.5%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="292%" strokeDashoffset={`${292 * (1 - goalProgress/100)}%`} className="text-emerald-400 transition-all duration-1000" />
                   </svg>
                   <Trophy size={32} className={`mb-2 transition-transform ${goalProgress >= 100 ? 'text-amber-400 scale-125' : 'text-emerald-300'}`} />
                   <span className="text-3xl font-black">{dailyStats.count}</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Ayahs Today</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-emerald-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                   {goalProgress >= 100 ? t.home.goalSuccess : `${t.home.ayahGoal}: ${dailyStats.goal}`}
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </section>

      {/* Mood Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Target size={20} className="text-emerald-500" /> Seek Guidance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MoodCards.map((mood) => (
            <Link key={mood.label} to={mood.path} className={`p-5 rounded-[2rem] border-2 ${mood.border} ${mood.color} flex items-center justify-between group transition-all hover:scale-105 active:scale-95`}>
              <div className="flex items-center gap-3">
                <span className="shrink-0">{mood.icon}</span>
                <span className="font-bold text-sm">{mood.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Surahs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-500" /> {t.home.popularSurahs}
          </h2>
          <Link to="/surah" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="quran-card p-6 rounded-[2rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {surah.id}
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{surah.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{surah.translation}</p>
                </div>
              </div>
              <span className="font-arabic text-2xl opacity-40 group-hover:opacity-100 transition-opacity" dir="rtl">{surah.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ayah of the Day */}
      {randomAyah && (
        <section className="space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" /> {t.home.knowledgeDay}
          </h2>
          <div className="quran-card p-10 md:p-16 rounded-[3rem] text-center space-y-10 relative overflow-hidden group">
            <p className="font-arabic text-4xl md:text-6xl text-white leading-[2.2] max-w-4xl mx-auto quran-text transition-transform group-hover:scale-[1.02]" dir="rtl">
              {randomAyah[0].text}
            </p>
            <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 text-left space-y-3">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">English Translation</p>
              <p className="text-lg md:text-xl text-slate-400 italic leading-relaxed font-medium">
                "{randomAyah[1].text}"
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
