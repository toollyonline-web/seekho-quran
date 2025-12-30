
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, ISLAMIC_EVENTS, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, Info, ArrowRight, Heart, Sparkles, Sun, 
  Calendar, Share2, Compass, Hash, PlayCircle, Target, Zap, LayoutGrid, 
  Coins, RefreshCcw, Search as SearchIcon, Book, Moon, CloudSun, Coffee,
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';
import PermissionModal from '../components/PermissionModal';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [lastRead, setLastRead] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState({ count: 0, goal: 5 });
  const [hijri, setHijri] = useState<any>(null);
  const [greeting, setGreeting] = useState('');

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const initData = useCallback(async (withLocation = false) => {
    try {
      setGreeting(getGreeting());
      const hParts = getHijriParts();
      setHijri(hParts);

      // Fetch random Ayah for the "Verse of the Day"
      const rAyah = await fetchRandomAyah();
      setRandomAyah(rAyah);

      if (withLocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const p = await fetchPrayerTimes(latitude, longitude);
            setPrayers(p);
          },
          async () => {
            const p = await fetchPrayerTimes(21.4225, 39.8262); // Mecca fallback
            setPrayers(p);
          }
        );
      } else {
        const p = await fetchPrayerTimes(21.4225, 39.8262); // Mecca default
        setPrayers(p);
      }
    } catch (err) {
      console.error("Home Init Error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    
    // Check location permission
    const hasAsked = localStorage.getItem('qs_location_asked');
    if (!hasAsked) setShowPermissionModal(true);

    // Load states
    const savedLastRead = localStorage.getItem('qs_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));

    const savedProgress = localStorage.getItem('qs_reading_progress');
    const progressDate = localStorage.getItem('qs_reading_date');
    if (progressDate === today && savedProgress) {
      setReadingProgress(prev => ({ ...prev, count: parseInt(savedProgress) }));
    }

    initData(localStorage.getItem('qs_location_allowed') === 'true');
  }, [initData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    initData(localStorage.getItem('qs_location_allowed') === 'true');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Your Experience...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); initData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); initData(false); }} 
        />
      )}

      {/* Header & Hijri Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
            {getGreeting() === "Good Morning" ? <CloudSun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-black uppercase tracking-widest">{getGreeting()}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            Assalamu Alaikum, <br /><span className="text-green-700">Explore the Light.</span>
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl shadow-green-900/5 border dark:border-slate-700 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Islamic Date</p>
            <p className="font-bold text-lg dark:text-white">{hijri?.day} {hijri?.month}, {hijri?.year}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>
      </header>

      {/* Verse of the Day Card */}
      {randomAyah && (
        <section className="px-4">
          <div className="relative group overflow-hidden bg-white dark:bg-slate-800 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-green-900/10 border dark:border-slate-700">
            <div className="absolute top-0 right-0 p-8 text-green-700/5 group-hover:rotate-12 transition-transform duration-700">
              {/* Fix: Quote is now correctly imported from lucide-react */}
              <Quote size={200} strokeWidth={3} />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={14} /> Verse of the Day
              </div>
              <p className="font-arabic text-3xl md:text-5xl text-slate-800 dark:text-white leading-relaxed" lang="ar" dir="rtl">
                {randomAyah[0].text}
              </p>
              <div className="space-y-4 max-w-3xl">
                <p className="text-xl italic text-slate-500 dark:text-slate-400 font-medium">
                  "{randomAyah[1].text}"
                </p>
                <div className="pt-6 flex items-center justify-center gap-4">
                   <div className="h-px w-10 bg-slate-200 dark:bg-slate-700"></div>
                   <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-sm font-black text-green-700 dark:text-green-400 uppercase tracking-widest hover:underline">
                      {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                   </Link>
                   <div className="h-px w-10 bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reading Progress & Prayer Times Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        
        {/* Progress Tracker */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-green-900/5 border dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3"><Target className="text-rose-500" /> {t.home.readingGoal}</h2>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl"><Zap size={20} fill="currentColor" /></div>
          </div>
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <span className="text-6xl font-black text-slate-900 dark:text-white">{readingProgress.count}</span>
              <span className="text-lg font-bold text-slate-400 pb-2">/ {readingProgress.goal} ayahs</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg" 
                 style={{ width: `${Math.min(100, (readingProgress.count / readingProgress.goal) * 100)}%` }}
               ></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Consistent reading leads to mastery.</p>
          </div>
        </div>

        {/* Prayer Times (Live Widget) */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="flex items-center justify-between relative z-10 mb-8">
              <h2 className="text-xl font-black flex items-center gap-3"><Clock className="text-green-500" /> {t.home.prayerTimes}</h2>
              <span className="text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-tighter">Live calculation</span>
           </div>
           {prayers ? (
             <div className="grid grid-cols-5 gap-2 relative z-10">
               {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                 <div key={p} className="flex flex-col items-center gap-3 group">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">{p}</div>
                   <div className="bg-white/5 border border-white/5 p-3 rounded-2xl w-full text-center group-hover:bg-green-600/20 group-hover:border-green-500 transition-all">
                      <span className="font-mono text-xs font-bold">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center py-4"><RefreshCcw className="animate-spin text-green-500" /></div>
           )}
           <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sun size={150} />
           </div>
        </div>

        {/* Continue Reading Card */}
        <div className="bg-green-700 text-white rounded-[2.5rem] p-8 shadow-xl shadow-green-950/20 flex flex-col justify-between group">
           <div>
              <p className="text-[10px] font-black text-green-300 uppercase tracking-widest mb-2">{t.home.resumeReading}</p>
              <h3 className="text-2xl font-black mb-2">{lastRead?.name || 'Start Journey'}</h3>
              <p className="text-sm text-green-100/60 font-medium">Ayah {lastRead?.ayah || '1'} of {lastRead?.name ? 'Surah' : 'the Quran'}</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-8 py-4 bg-white text-green-800 rounded-2xl font-black text-center shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              {t.home.continue} <ArrowRight size={20} />
           </Link>
        </div>
      </div>

      {/* Quick Discovery Grid */}
      <section className="px-4 space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.home.quickActions}</h2>
           <div className="h-1 flex-grow mx-8 bg-slate-100 dark:bg-slate-800 rounded-full hidden md:block"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { id: 'search', path: '/search', label: 'Search', icon: <SearchIcon size={24} />, bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { id: 'qibla', path: '/qibla', label: 'Qibla', icon: <Compass size={24} />, bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
            { id: 'tasbeeh', path: '/tasbeeh', label: 'Dhikr', icon: <Hash size={24} />, bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
            { id: 'zakat', path: '/zakat', label: 'Zakat', icon: <Coins size={24} />, bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
            { id: 'duas', path: '/duas', label: 'Duas', icon: <Heart size={24} />, bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            { id: 'hadith', path: '/hadith', label: 'Hadith', icon: <Book size={24} />, bg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' }
          ].map((item) => (
            <Link key={item.id} to={item.path} className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className={`${item.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-all shadow-inner`}>
                {item.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Surahs List */}
      <section className="px-4 space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.home.popularSurahs}</h2>
           <Link to="/surah" className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest hover:underline flex items-center gap-2">
              View All <ArrowRight size={14} />
           </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm hover:border-green-400 transition-all flex items-center justify-between group">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 font-black group-hover:bg-green-700 group-hover:text-white transition-all">
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

      {/* Community & Mission Footer Card */}
      <section className="px-4">
         <div className="bg-slate-950 text-white rounded-[3.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="relative z-10 space-y-6 max-w-xl">
               <div className="w-16 h-16 bg-green-700 rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl">QS</div>
               <h2 className="text-4xl font-black leading-tight">Quran Seekho is for the Ummah. <br /><span className="text-green-500">Ad-Free. Forever.</span></h2>
               <p className="text-slate-400 text-lg leading-relaxed">
                 Experience the Noble Quran as it was meant to be—pure, accessible, and beautiful. Built with 100% voluntary effort for the global community.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/about" className="px-8 py-4 bg-green-700 rounded-2xl font-black shadow-xl hover:bg-green-600 transition-all">Our Vision</Link>
                  <Link to="/donate" className="px-8 py-4 border border-slate-800 rounded-2xl font-black hover:bg-slate-900 transition-all flex items-center gap-2">Support Us <Heart size={18} fill="currentColor" /></Link>
               </div>
            </div>
            <div className="relative z-10 shrink-0 opacity-20 md:opacity-100">
               <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-green-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                  <Sparkles size={100} className="text-green-500" />
               </div>
            </div>
            <div className="absolute top-0 right-0 p-20 bg-green-700/10 blur-[120px] rounded-full"></div>
         </div>
      </section>
    </div>
  );
};

export default Home;
