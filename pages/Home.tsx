
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, ArrowRight, Sparkles, Sun, 
  Calendar, Compass, Hash, Zap, Coins, Search as SearchIcon, 
  Book, Moon, CloudSun, Quote, Loader2, PlayCircle, Trophy, ChevronRight, Bookmark
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
  const [hijri, setHijri] = useState<any>(null);
  const [greeting, setGreeting] = useState('');

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadDashboardData = useCallback(async (withLoc = false) => {
    setLoading(true);
    try {
      setGreeting(new Date().getHours() < 12 ? "Good Morning" : "Good Evening");
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('qs_location_asked')) setShowPermissionModal(true);
    const savedLast = localStorage.getItem('qs_last_read');
    if (savedLast) setLastRead(JSON.parse(savedLast));
    loadDashboardData(localStorage.getItem('qs_location_allowed') === 'true');
  }, [loadDashboardData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-emerald-900/10 border-t-emerald-800 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Preparing Sacred Space...</p>
    </div>
  );

  return (
    <div className="page-transition space-y-12 pb-20">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); loadDashboardData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); loadDashboardData(false); }} 
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-950 text-white p-10 md:p-20 rounded-[3rem] shadow-sacred border border-white/5">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center shadow-lg"><Sparkles size={20} className="text-amber-400" /></div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">{greeting}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter italic">
              Experience <br /> the <span className="text-emerald-500">Divine Word.</span>
            </h1>
            <p className="text-emerald-100/60 text-lg md:text-xl font-medium max-w-md leading-relaxed">
              Premium, distraction-free Quranic experience designed for the modern seeker.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Link to="/surah" className="px-10 py-5 bg-white text-emerald-900 rounded-2xl font-black shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-3 active:scale-95">
                  Read Quran <ArrowRight size={20} />
               </Link>
               <Link to="/tasbeeh" className="px-10 py-5 bg-emerald-900/50 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black hover:bg-emerald-800 transition-all active:scale-95">
                  Dhikr Mode
               </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
             <div className="w-96 h-96 bg-emerald-900 rounded-full flex items-center justify-center p-8 border-8 border-white/5 shadow-inner animate-float">
                <BookOpen size={180} className="text-emerald-400/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-2">Current Hijri</p>
                        <p className="text-4xl font-black">{hijri?.day} {hijri?.month}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Daily Verse */}
      {randomAyah && (
        <section className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border dark:border-white/5 shadow-sacred relative group transition-all hover:shadow-2xl">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black text-emerald-800 dark:text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                 <Quote size={20} /> Verse of the Day
              </h2>
              <Bookmark size={20} className="text-slate-300" />
           </div>
           <div className="space-y-10 text-center">
              <p className="font-arabic text-4xl md:text-6xl text-slate-900 dark:text-white leading-[1.8] max-w-5xl mx-auto" dir="rtl">
                 {randomAyah[0].text}
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                 <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
                   "{randomAyah[1].text}"
                 </p>
                 <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800 dark:text-emerald-400 hover:underline">
                    {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Prayer Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sacred flex flex-col justify-between group overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2 italic">
                <Clock className="text-emerald-700" /> Prayer Times
             </h3>
             <Link to="/calendar" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-700">All Times</Link>
          </div>
          {prayers ? (
            <div className="grid grid-cols-1 gap-3 relative z-10">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                <div key={p} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group-hover:translate-x-1 transition-transform border dark:border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p}</span>
                  <span className="font-black text-emerald-800 dark:text-emerald-400">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                </div>
              ))}
            </div>
          ) : <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-800" /></div>}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        {/* Continue Card */}
        <div className="bg-emerald-800 text-white p-8 rounded-[2.5rem] shadow-sacred flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-300 block mb-4 flex items-center gap-2">
                 <PlayCircle size={14} /> Resume Reading
              </span>
              <h3 className="text-4xl font-black tracking-tighter leading-tight italic">
                 {lastRead?.name || 'Revelation Begins'}
              </h3>
              <p className="text-emerald-200/60 font-bold mt-2 text-sm italic">Surah {lastRead?.id || '1'} • Ayah {lastRead?.ayah || '1'}</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-10 py-5 bg-white text-emerald-900 rounded-2xl font-black text-center shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10 text-[10px] uppercase tracking-widest">
              Continue Journey
           </Link>
           <Sparkles className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none group-hover:rotate-45 transition-transform duration-1000" size={240} />
        </div>

        {/* Quick Tools */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sacred">
           <h3 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2 italic mb-8">
              <Zap className="text-amber-500" /> Sacred Tools
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { path: '/qibla', label: 'Qibla', icon: <Compass />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                { path: '/zakat', label: 'Zakat', icon: <Coins />, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                { path: '/names', label: 'Names', icon: <Star />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { path: '/search', label: 'Search', icon: <SearchIcon />, color: 'text-blue-500', bg: 'bg-blue-500/10' }
              ].map((tool) => (
                <Link key={tool.label} to={tool.path} className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] hover:-translate-y-1 transition-all border dark:border-white/5">
                   <div className={`p-3 rounded-xl ${tool.color} ${tool.bg}`}>{tool.icon}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{tool.label}</span>
                </Link>
              ))}
           </div>
        </div>

      </div>

      {/* Selection Section */}
      <section className="space-y-8 pt-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-3xl font-black tracking-tight dark:text-white italic">Sacred Selection</h2>
           <Link to="/surah" className="text-[10px] font-black text-emerald-800 dark:text-emerald-500 hover:underline uppercase tracking-widest flex items-center gap-2">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:border-emerald-700 transition-all flex items-center justify-between group hover:shadow-2xl hover:-translate-y-1">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-black group-hover:bg-emerald-800 group-hover:text-white transition-all">
                     {surah.id}
                  </div>
                  <div>
                    <h3 className="font-black text-lg dark:text-white leading-none">{surah.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{surah.translation}</p>
                  </div>
               </div>
               <span className="font-arabic text-2xl dark:text-white" dir="rtl">{surah.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-slate-950 text-white rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none italic">
              Ad-Free. <br /> Private. <br /><span className="text-emerald-500">Sacred.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              We believe the Word of Allah should be accessible without trackers or noise. Support our mission to keep Quran Seekho free for everyone.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <Link to="/donate" className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black shadow-2xl hover:bg-emerald-700 transition-all hover:scale-105 text-[10px] uppercase tracking-widest">Support Us</Link>
               <Link to="/about" className="px-10 py-5 border border-white/10 text-white rounded-2xl font-black hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest">Our Story</Link>
            </div>
         </div>
         <div className="relative z-10 hidden lg:block opacity-20">
            <Sparkles size={300} />
         </div>
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-800/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Home;
