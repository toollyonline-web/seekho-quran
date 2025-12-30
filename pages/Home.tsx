
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, ArrowRight, Heart, Sparkles, Sun, 
  Calendar, Compass, Hash, Target, Zap, 
  Coins, RefreshCcw, Search as SearchIcon, Book, Moon, CloudSun, 
  Quote, Loader2, PlayCircle, Trophy, ChevronRight
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
  const t = translations[currentLang] || translations['en'];

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
            const p = await fetchPrayerTimes(21.4225, 39.8262);
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
      <div className="w-16 h-16 border-[5px] border-emerald-700/20 border-t-emerald-700 rounded-full animate-spin"></div>
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Assalamu Alaikum</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Illuminating the path...</p>
      </div>
    </div>
  );

  return (
    <div className="page-transition space-y-12 px-4 md:px-8 max-w-7xl mx-auto pb-20">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); loadDashboardData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); loadDashboardData(false); }} 
        />
      )}

      {/* Modern Hero Dashboard */}
      <section className="relative pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                  {greeting.includes("Morning") ? <Sun size={24} /> : <Moon size={24} />}
               </div>
               <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800 dark:text-emerald-400">{greeting}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              Seek Light. <br />Find <span className="text-emerald-700 dark:text-emerald-500">Peace.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Your digital sanctuary for the Noble Quran. Ad-free, private, and beautifully crafted for the Ummah.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl border dark:border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-700 dark:text-emerald-400">
                        <Calendar size={32} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Islamic Calendar</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black dark:text-white">{hijri?.day} {hijri?.month}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">{hijri?.year} AH • {new Date().getFullYear()} AD</p>
                  </div>
                  <Link to="/calendar" className="mt-4 flex items-center justify-center gap-2 py-4 bg-slate-950 text-white rounded-2xl font-black hover:bg-emerald-800 transition-all text-sm">
                    View Full Calendar <ChevronRight size={18} />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Verse of the Day */}
      {randomAyah && (
        <section>
          <div className="bg-slate-900 dark:bg-black rounded-[4rem] p-10 md:p-20 shadow-2xl relative group overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent"></div>
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none transform transition-transform group-hover:scale-110 duration-1000">
              <Quote size={300} strokeWidth={2} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-12">
              <div className="px-6 py-2 bg-emerald-700/20 border border-emerald-700/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                Daily Illumination
              </div>
              <p className="font-arabic text-4xl md:text-7xl text-white leading-[1.6] max-w-6xl px-4" lang="ar" dir="rtl">
                {randomAyah[0].text}
              </p>
              <div className="space-y-6 max-w-3xl">
                <p className="text-xl md:text-2xl text-slate-400 italic font-medium leading-relaxed">
                  "{randomAyah[1].text}"
                </p>
                <Link to={`/surah/${randomAyah[0].surah.number}`} className="inline-flex items-center gap-3 text-xs font-black text-emerald-500 uppercase tracking-[0.4em] hover:text-white transition-all pt-4">
                  <BookOpen size={16} /> {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Companion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Prayer Times Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl border dark:border-white/5 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black flex items-center gap-3"><Clock className="text-emerald-700" /> Prayers</h2>
             <Link to="/calendar" className="text-[10px] font-black uppercase text-emerald-700 hover:underline">Full Times</Link>
          </div>
          {prayers ? (
            <div className="grid grid-cols-1 gap-3">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                <div key={p} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:translate-x-1 transition-transform">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">{p}</span>
                  <span className="font-mono font-black text-lg text-emerald-700 dark:text-emerald-400">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                </div>
              ))}
            </div>
          ) : <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-emerald-700" /></div>}
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-emerald-950 text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3"><Trophy className="text-amber-500" /> Progress</h2>
            <Zap className="text-amber-500" size={24} fill="currentColor" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-end justify-between">
               <span className="text-8xl font-black leading-none">{readingProgress.count}</span>
               <span className="text-sm font-black text-emerald-400 pb-2 uppercase tracking-widest">/ {readingProgress.goal} ayahs</span>
            </div>
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(100, (readingProgress.count / readingProgress.goal) * 100)}%` }}></div>
            </div>
          </div>
          <Sparkles className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none" size={150} />
        </div>

        {/* Resume Library Card */}
        <div className="bg-emerald-700 text-white rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-2">Continue Journey</p>
              <h3 className="text-3xl font-black tracking-tighter">{lastRead?.name || 'Explore Quran'}</h3>
              <p className="text-sm opacity-60 font-medium mt-1">Ayah {lastRead?.ayah || '1'} of {lastRead?.name || 'Revelation'}</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-center shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10">
              Resume <PlayCircle size={22} />
           </Link>
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>

      {/* Tool Icons Clusters */}
      <section className="space-y-10">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white px-2">Spiritual Toolbox</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { path: '/search', label: 'Search', icon: <SearchIcon size={24} />, bg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' },
            { path: '/qibla', label: 'Qibla', icon: <Compass size={24} />, bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
            { path: '/tasbeeh', label: 'Tasbeeh', icon: <Hash size={24} />, bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
            { path: '/zakat', label: 'Zakat', icon: <Coins size={24} />, bg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600' },
            { path: '/duas', label: 'Duas', icon: <Heart size={24} />, bg: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600' },
            { path: '/hadith', label: 'Hadith', icon: <Book size={24} />, bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' }
          ].map((item) => (
            <Link key={item.label} to={item.path} className="flex flex-col items-center gap-5 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className={`${item.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-6 transition-all`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Surahs Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">The Library</h2>
           <Link to="/surah" className="text-xs font-black text-emerald-700 hover:underline uppercase tracking-widest flex items-center gap-2">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:border-emerald-600 transition-all flex items-center justify-between group">
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

      {/* Corporate/Mission Footer Banner */}
      <section className="pt-20">
         <div className="bg-slate-950 text-white rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden">
            <div className="relative z-10 space-y-10 max-w-2xl">
               <div className="w-20 h-20 bg-emerald-700 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-2xl">QS</div>
               <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">Your Heart. <br /><span className="text-emerald-500">Pure Faith.</span></h2>
               <p className="text-slate-400 text-xl leading-relaxed">
                 Experience the Quran as it was meant to be—beautifully presented and easy to understand. We are a non-profit project for the global Ummah.
               </p>
               <div className="flex flex-wrap gap-4">
                  <Link to="/donate" className="px-10 py-5 bg-emerald-700 rounded-2xl font-black shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95">Support Growth</Link>
                  <Link to="/about" className="px-10 py-5 border border-white/10 rounded-2xl font-black hover:bg-white/5 transition-all">Read Our Mission</Link>
               </div>
            </div>
            <div className="relative z-10 hidden lg:block rotate-12">
               <div className="w-96 h-96 border-4 border-emerald-500/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <Sparkles size={160} className="text-emerald-500/40" />
               </div>
            </div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none"></div>
         </div>
      </section>
    </div>
  );
};

export default Home;
