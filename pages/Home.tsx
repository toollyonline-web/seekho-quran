
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, ArrowRight, Heart, Sparkles, Sun, 
  Calendar, Compass, Hash, Target, Zap, 
  Coins, RefreshCcw, Search as SearchIcon, Book, Moon, CloudSun, Coffee,
  Quote, Loader2
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
    setLoading(true);
    try {
      setGreeting(getGreeting());
      setHijri(getHijriParts());
      const rAyah = await fetchRandomAyah();
      setRandomAyah(rAyah);

      if (withLocation) {
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
      console.error("Home Init Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const hasAsked = localStorage.getItem('qs_location_asked');
    if (!hasAsked) setShowPermissionModal(true);

    const savedLastRead = localStorage.getItem('qs_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));

    const savedProgress = localStorage.getItem('qs_reading_progress');
    const progressDate = localStorage.getItem('qs_reading_date');
    if (progressDate === today && savedProgress) {
      setReadingProgress(prev => ({ ...prev, count: parseInt(savedProgress) }));
    }

    initData(localStorage.getItem('qs_location_allowed') === 'true');
  }, [initData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center page-transition">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Connecting with the Sacred...</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Preparing your daily guidance</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 md:px-8 page-transition">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); initData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); initData(false); }} 
        />
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            {getGreeting().includes("Morning") ? <CloudSun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-black uppercase tracking-widest">{greeting}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
            Assalamu Alaikum, <br /><span className="text-green-700">Explore the Light.</span>
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl border dark:border-slate-700 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Islamic Date</p>
            <p className="font-bold text-lg dark:text-white leading-none mt-1">{hijri?.day} {hijri?.month}, {hijri?.year}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>
      </header>

      {/* Verse of the Day Card */}
      {randomAyah && (
        <section>
          <div className="relative group overflow-hidden bg-white dark:bg-slate-800 rounded-[3rem] p-10 md:p-16 shadow-2xl border dark:border-slate-700">
            <div className="absolute top-0 right-0 p-12 text-green-700/5 group-hover:rotate-12 transition-transform duration-700">
              <Quote size={250} strokeWidth={3} />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={14} /> Verse of the Day
              </div>
              <p className="font-arabic text-3xl md:text-6xl text-slate-800 dark:text-white leading-tight" lang="ar" dir="rtl">
                {randomAyah[0].text}
              </p>
              <div className="space-y-4 max-w-3xl">
                <p className="text-xl md:text-2xl italic text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  "{randomAyah[1].text}"
                </p>
                <div className="pt-8 flex items-center justify-center gap-6">
                   <div className="h-px w-16 bg-slate-100 dark:bg-slate-700"></div>
                   <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-[0.2em] hover:underline">
                      {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                   </Link>
                   <div className="h-px w-16 bg-slate-100 dark:bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Tracker */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border dark:border-slate-700 flex flex-col justify-between">
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
               <div className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${Math.min(100, (readingProgress.count / readingProgress.goal) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Prayer Times */}
        <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="flex items-center justify-between relative z-10 mb-8">
              <h2 className="text-xl font-black flex items-center gap-3"><Clock className="text-green-500" /> {t.home.prayerTimes}</h2>
              <span className="text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-tighter">Mecca (Default)</span>
           </div>
           {prayers ? (
             <div className="grid grid-cols-5 gap-2 relative z-10">
               {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                 <div key={p} className="flex flex-col items-center gap-3 group">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p}</div>
                   <div className="bg-white/10 border border-white/5 p-3 rounded-2xl w-full text-center group-hover:bg-green-600/30 transition-all">
                      <span className="font-mono text-xs font-bold leading-none">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center py-4"><Loader2 className="animate-spin text-green-500" /></div>
           )}
           <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none rotate-12">
              <Sun size={150} />
           </div>
        </div>

        {/* Resume Reading */}
        <div className="bg-green-800 text-white rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between group">
           <div>
              <p className="text-[10px] font-black text-green-300 uppercase tracking-widest mb-2">{t.home.resumeReading}</p>
              <h3 className="text-2xl font-black mb-1">{lastRead?.name || 'Start Journey'}</h3>
              <p className="text-sm text-green-100/60 font-medium">Ayah {lastRead?.ayah || '1'} of the Quran</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-8 py-5 bg-white text-green-900 rounded-2xl font-black text-center shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              {t.home.continue} <ArrowRight size={20} />
           </Link>
        </div>
      </div>

      {/* Tools Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white px-2">Spiritual Tools</h2>
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
              <div className={`${item.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-all`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <section>
         <div className="bg-slate-950 text-white rounded-[3.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="relative z-10 space-y-8 max-w-xl">
               <div className="w-20 h-20 bg-green-700 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl">QS</div>
               <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">Quran Seekho. <br /><span className="text-green-500">Ad-Free. Forever.</span></h2>
               <p className="text-slate-400 text-xl leading-relaxed">
                 Pure Quranic study for the global community. Built by the Ummah, for the Ummah. No trackers, no data-mining, only light.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/donate" className="px-10 py-5 bg-green-700 rounded-2xl font-black shadow-xl hover:bg-green-600 transition-all">Support Growth</Link>
                  <Link to="/about" className="px-10 py-5 border border-slate-800 rounded-2xl font-black hover:bg-slate-900 transition-all">Our Story</Link>
               </div>
            </div>
            <div className="relative z-10 opacity-30 md:opacity-100 rotate-12">
               <div className="w-80 h-80 border-4 border-green-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                  <Sparkles size={120} className="text-green-500" />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
