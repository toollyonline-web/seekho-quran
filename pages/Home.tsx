
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, ArrowRight, Heart, Sparkles, Sun, 
  Calendar, Compass, Hash, Target, Zap, 
  Coins, RefreshCcw, Search as SearchIcon, Book, Moon, CloudSun, 
  Quote, Loader2, PlayCircle, Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';
import PermissionModal from '../components/PermissionModal';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'Sovereignty' },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [lastRead, setLastRead] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState({ count: 0, goal: 10 });
  const [hijri, setHijri] = useState<any>(null);
  const [greeting, setGreeting] = useState('');

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  const determineGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Tahajjud Time";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const loadDashboardData = useCallback(async (withLoc = false) => {
    setLoading(true);
    try {
      setGreeting(determineGreeting());
      setHijri(getHijriParts());
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);

      if (withLoc) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const p = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
            setPrayers(p);
          },
          async () => {
            const p = await fetchPrayerTimes(21.4225, 39.8262); // Fallback Mecca
            setPrayers(p);
          }
        );
      } else {
        const p = await fetchPrayerTimes(21.4225, 39.8262);
        setPrayers(p);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (!localStorage.getItem('qs_location_asked')) setShowPermissionModal(true);

    const savedLast = localStorage.getItem('qs_last_read');
    if (savedLast) setLastRead(JSON.parse(savedLast));

    const savedCount = localStorage.getItem('qs_reading_progress');
    const savedDate = localStorage.getItem('qs_reading_date');
    if (savedDate === today && savedCount) {
      setReadingProgress(prev => ({ ...prev, count: parseInt(savedCount) }));
    }

    loadDashboardData(localStorage.getItem('qs_location_allowed') === 'true');
  }, [loadDashboardData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">Assalamu Alaikum</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing with the Sacred...</p>
      </div>
    </div>
  );

  return (
    <div className="page-transition space-y-12 px-4 md:px-8 max-w-7xl mx-auto">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); loadDashboardData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); loadDashboardData(false); }} 
        />
      )}

      {/* Hero Dash */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
             {greeting.includes("Morning") || greeting.includes("Afternoon") ? <CloudSun size={24} /> : <Moon size={24} />}
             <span className="text-xs font-black uppercase tracking-[0.3em]">{greeting}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
            Light for <br /><span className="text-emerald-700">Your Journey.</span>
          </h1>
        </div>
        <div className="lg:col-span-4 bg-emerald-700 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Islamic Calendar</p>
            <p className="text-2xl font-black">{hijri?.day} {hijri?.month}</p>
            <p className="text-sm opacity-80 font-bold mt-1">{hijri?.year} AH</p>
          </div>
          <Calendar size={60} className="opacity-20 -mr-4 group-hover:rotate-12 transition-transform duration-700" strokeWidth={1.5} />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Primary Feature: Verse of the Day */}
      {randomAyah && (
        <section>
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border dark:border-white/5 shadow-2xl shadow-emerald-900/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform rotate-12 transition-transform group-hover:rotate-0 duration-1000">
              <Quote size={280} strokeWidth={3} />
            </div>
            <div className="relative z-10 space-y-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-amber-100 dark:ring-amber-900/40">
                <Sparkles size={14} /> Sacred Verse of the Day
              </div>
              <p className="font-arabic text-4xl md:text-6xl text-slate-900 dark:text-white leading-[1.6] max-w-5xl" lang="ar" dir="rtl">
                {randomAyah[0].text}
              </p>
              <div className="space-y-6 max-w-3xl">
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
                  "{randomAyah[1].text}"
                </p>
                <div className="pt-6 flex items-center justify-center gap-6">
                   <div className="h-px w-16 bg-slate-100 dark:bg-white/10"></div>
                   <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.3em] hover:text-amber-600 transition-colors">
                      {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                   </Link>
                   <div className="h-px w-16 bg-slate-100 dark:white/10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid: Tools & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Prayer Time Widget */}
        <div className="bg-slate-950 text-white rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10 flex items-center justify-between mb-8">
             <h2 className="text-xl font-black flex items-center gap-3"><Clock className="text-emerald-500" /> Prayer Times</h2>
             <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full uppercase tracking-tighter">Mecca Standard</span>
          </div>
          {prayers ? (
            <div className="grid grid-cols-5 gap-3 relative z-10">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                <div key={p} className="flex flex-col items-center gap-4">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p}</div>
                  <div className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-center group-hover:border-emerald-500/30 transition-all">
                    <span className="font-mono text-xs font-black">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <Loader2 className="animate-spin mx-auto text-emerald-500" />}
          <Sun size={140} className="absolute bottom-0 right-0 opacity-5 -mb-10 -mr-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        </div>

        {/* Learning Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl border dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3"><Trophy className="text-amber-500" /> Reading Goal</h2>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl"><Zap size={20} fill="currentColor" /></div>
          </div>
          <div className="space-y-6">
            <div className="flex items-end justify-between">
               <span className="text-7xl font-black text-slate-900 dark:text-white leading-none">{readingProgress.count}</span>
               <span className="text-sm font-black text-slate-400 pb-2 uppercase tracking-widest">/ {readingProgress.goal} Ayahs today</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${Math.min(100, (readingProgress.count / readingProgress.goal) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Continue Reading */}
        <div className="bg-emerald-800 text-white rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between group overflow-hidden">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-2 flex items-center gap-2"><PlayCircle size={14} /> Resume Reading</p>
              <h3 className="text-3xl font-black tracking-tight">{lastRead?.name || 'Open Quran'}</h3>
              <p className="text-sm opacity-60 font-bold mt-1">Ayah {lastRead?.ayah || '1'} of Section {lastRead?.id || '1'}</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-10 py-5 bg-white text-emerald-900 rounded-2xl font-black text-center shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10">
              Open Reader <ArrowRight size={20} />
           </Link>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>

      {/* Action Grid: Toolbox */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Spiritual Toolbox</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { id: 'search', path: '/search', label: 'Search', icon: <SearchIcon size={26} />, bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { id: 'qibla', path: '/qibla', label: 'Qibla', icon: <Compass size={26} />, bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
            { id: 'tasbeeh', path: '/tasbeeh', label: 'Tasbeeh', icon: <Hash size={26} />, bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
            { id: 'zakat', path: '/zakat', label: 'Zakat', icon: <Coins size={26} />, bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
            { id: 'duas', path: '/duas', label: 'Duas', icon: <Heart size={26} />, bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            { id: 'hadith', path: '/hadith', label: 'Hadith', icon: <Book size={26} />, bg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' }
          ].map((item) => (
            <Link key={item.id} to={item.path} className="flex flex-col items-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className={`${item.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-all shadow-inner`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Explorations */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sacred Library</h2>
           <Link to="/surah" className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-2">Explore All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:border-emerald-400 transition-all flex items-center justify-between group">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black group-hover:bg-emerald-700 group-hover:text-white transition-all">
                     {surah.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{surah.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{surah.translation}</p>
                  </div>
               </div>
               <span className="font-arabic text-3xl group-hover:scale-110 transition-transform dark:text-white" dir="rtl">{surah.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission Footer Banner */}
      <section>
         <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8 max-w-2xl">
               <div className="w-24 h-24 bg-emerald-700 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-2xl">QS</div>
               <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">Pure Faith. <br /><span className="text-emerald-500">Ad-Free Forever.</span></h2>
               <p className="text-slate-400 text-xl leading-relaxed">
                 Experience the Noble Quran in its purest digital form. Built with love for the global Ummah, with zero trackers and a total focus on the sacred text.
               </p>
               <div className="flex flex-wrap gap-4 pt-6">
                  <Link to="/donate" className="px-12 py-5 bg-emerald-700 rounded-2xl font-black shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95">Support Our Mission</Link>
                  <Link to="/about" className="px-12 py-5 border border-white/10 rounded-2xl font-black hover:bg-white/5 transition-all">Our Story</Link>
               </div>
            </div>
            <div className="relative z-10 hidden lg:block rotate-12">
               <div className="w-[400px] h-[400px] border-2 border-emerald-500/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <Sparkles size={160} className="text-emerald-500/30" />
               </div>
            </div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none"></div>
         </div>
      </section>
    </div>
  );
};

export default Home;
