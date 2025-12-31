
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Search as SearchIcon, BookOpen, Clock, Star, 
  ChevronRight, PlayCircle, Loader2, Sparkles,
  ShieldCheck, Heart, Sun, Share2, ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const MoodCards = [
  { label: 'Anxious', icon: <ShieldCheck size={20} />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', path: '/search?q=patience' },
  { label: 'Sad', icon: <Heart size={20} />, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', path: '/search?q=comfort' },
  { label: 'Grateful', icon: <Sun size={20} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', path: '/search?q=gratitude' },
  { label: 'Lost', icon: <Sparkles size={20} />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', path: '/search?q=guidance' },
];

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', translation: 'The Inevitable' },
];

const Home: React.FC = () => {
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hijri, setHijri] = useState<any>(null);
  const navigate = useNavigate();

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async () => {
    try {
      setHijri(getHijriParts());
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Seekho',
          text: 'Read & Learn the Holy Quran in a beautiful, distraction-free environment.',
          url: 'https://quranseekho.online/',
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText('https://quranseekho.online/');
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="page-transition space-y-10 pb-20">
      
      {/* Hero Section */}
      <section className="bg-emerald-700 text-white p-8 md:p-14 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Quran Seekho: Read & Learn the Holy Quran
          </h1>
          <p className="text-emerald-50 text-lg md:text-xl font-medium leading-relaxed opacity-90">
            A beautiful, distraction-free environment for spiritual growth. Explore 114 Surahs and 30 Juz with accurate translations and daily Islamic tools.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/surah" className="px-8 py-4 bg-emerald-900/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900/60 transition-all active:scale-95">
              Browse Surahs
            </Link>
            <button 
              onClick={handleShareApp}
              className="px-8 py-4 bg-emerald-600/50 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600/70 transition-all flex items-center gap-2 active:scale-95"
            >
              <Share2 size={18} /> Share App
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </section>

      {/* Intro Text */}
      <div className="bg-white/5 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          Quran Seekho is a free, ad-free Islamic platform. Whether you are seeking a specific Surah, browsing by Juz (Sipara), or checking Prayer Times, we offer a seamless interface designed for the Ummah.
        </p>
      </div>

      {/* Mood Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2 dark:text-white">
          <Heart size={20} className="text-rose-500 fill-rose-500" /> How are you feeling?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MoodCards.map((mood) => (
            <Link 
              key={mood.label} 
              to={mood.path}
              className={`p-4 rounded-2xl border ${mood.border} ${mood.color} flex items-center justify-between group transition-all hover:shadow-md active:scale-95`}
            >
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
          <h2 className="text-xl font-black flex items-center gap-2 dark:text-white">
            <BookOpen size={20} className="text-emerald-600" /> Popular Surahs
          </h2>
          <Link to="/surah" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PopularSurahs.map((surah) => (
            <Link 
              key={surah.id} 
              to={`/surah/${surah.id}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-white/5 shadow-sm hover:border-emerald-600 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {surah.id}
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white group-hover:text-emerald-600 transition-colors">{surah.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{surah.translation}</p>
                </div>
              </div>
              <span className="font-arabic text-2xl dark:text-white opacity-60 group-hover:opacity-100 transition-opacity" dir="rtl">{surah.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ayah of the Day */}
      {randomAyah && (
        <section className="space-y-6">
          <h2 className="text-xl font-black flex items-center gap-2 dark:text-white">
            <Star size={20} className="text-amber-500 fill-amber-500" /> Ayah of the Day
          </h2>
          <div className="bg-white/5 dark:bg-slate-900/40 p-8 md:p-14 rounded-[3rem] border border-white/5 text-center space-y-10 relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
              <p className="font-arabic text-4xl md:text-6xl text-slate-900 dark:text-white leading-[2] max-w-4xl mx-auto quran-text" dir="rtl">
                {randomAyah[0].text}
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-white/5 text-left space-y-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">English Translation</p>
                <p className="text-lg text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  {randomAyah[1].text}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <BookOpen size={240} />
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
