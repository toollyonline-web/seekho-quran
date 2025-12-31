
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Clock, BookOpen, Star, ArrowRight, Sparkles, Compass, 
  Hash, Search as SearchIcon, Loader2, PlayCircle, Quote, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';
import PermissionModal from '../components/PermissionModal';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart' },
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

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async (withLoc = false) => {
    setLoading(true);
    try {
      setHijri(getHijriParts());
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);

      if (withLoc) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const p = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
            setPrayers(p);
          },
          async () => setPrayers(await fetchPrayerTimes(21.4225, 39.8262))
        );
      } else {
        setPrayers(await fetchPrayerTimes(21.4225, 39.8262));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('qs_location_asked')) setShowPermissionModal(true);
    const saved = localStorage.getItem('qs_last_read');
    if (saved) setLastRead(JSON.parse(saved));
    loadData(localStorage.getItem('qs_location_allowed') === 'true');
  }, [loadData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-emerald-900/10 border-t-emerald-800 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Summoning Sacred Data...</p>
    </div>
  );

  return (
    <div className="page-transition space-y-12 pb-10">
      {showPermissionModal && (
        <PermissionModal 
          onAccept={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'true'); setShowPermissionModal(false); loadData(true); }} 
          onDecline={() => { localStorage.setItem('qs_location_asked', 'true'); localStorage.setItem('qs_location_allowed', 'false'); setShowPermissionModal(false); loadData(false); }} 
        />
      )}

      {/* Hero Dashboard */}
      <section className="relative overflow-hidden bg-emerald-950 text-white p-8 md:p-16 rounded-[3.5rem] shadow-sacred">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center shadow-lg"><Sparkles size={18} className="text-amber-400" /></div>
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">{hijri?.day} {hijri?.month} {hijri?.year} AH</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter italic">
              Seek the <br /><span className="text-emerald-500">Divine Light.</span>
            </h1>
            <p className="text-emerald-100/60 text-lg font-medium max-w-sm leading-relaxed">
              Experience the Noble Quran in a distraction-free digital sanctuary.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
               <Link to="/surah" className="px-8 py-4 bg-white text-emerald-950 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-widest">
                  Read Now <ArrowRight size={16} />
               </Link>
               <Link to="/tasbeeh" className="px-8 py-4 bg-emerald-900/50 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black hover:bg-emerald-800 transition-all text-xs uppercase tracking-widest">
                  Tasbeeh
               </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
             <div className="w-80 h-80 bg-emerald-900/40 rounded-full flex items-center justify-center p-8 border border-white/5 animate-float relative">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <BookOpen size={160} className="text-emerald-400/20" />
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center rotate-6">
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Juz</p>
                   <p className="text-3xl font-black">{hijri?.day || '30'}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Core Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Continue Reading Card */}
        <div className="bg-emerald-800 text-white p-8 rounded-[2.5rem] shadow-sacred flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-4 flex items-center gap-2">
                 <PlayCircle size={14} /> Resume Journey
              </p>
              <h3 className="text-3xl font-black tracking-tight leading-none italic">
                 {lastRead?.name || 'Revelation'}
              </h3>
              <p className="text-emerald-200/60 font-bold mt-2 text-xs italic">Surah {lastRead?.id || '1'} • Ayah {lastRead?.ayah || '1'}</p>
           </div>
           <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="mt-8 py-4 bg-white text-emerald-900 rounded-xl font-black text-center shadow-lg hover:scale-105 active:scale-95 transition-all relative z-10 text-[9px] uppercase tracking-widest">
              Continue
           </Link>
           <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
             <BookOpen size={240} />
           </div>
        </div>

        {/* Prayer Times Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sacred relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black dark:text-white flex items-center gap-2 italic">
                <Clock size={18} className="text-emerald-700" /> Prayer
             </h3>
             <span className="text-[8px] font-black uppercase text-slate-400">Mecca standard</span>
          </div>
          {prayers ? (
            <div className="space-y-2 relative z-10">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                <div key={p} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-white/5 transition-transform group-hover:translate-x-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{p}</span>
                  <span className="font-black text-sm text-emerald-800 dark:text-emerald-400">{prayers[p as keyof PrayerTimes].split(' ')[0]}</span>
                </div>
              ))}
            </div>
          ) : <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-800" /></div>}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-white/5 shadow-sacred">
           <h3 className="text-lg font-black dark:text-white flex items-center gap-2 italic mb-6">
              <Compass size={18} className="text-rose-500" /> Utilities
           </h3>
           <div className="grid grid-cols-2 gap-3">
              {[
                { path: '/qibla', label: 'Qibla', icon: <Compass />, color: 'text-rose-500' },
                { path: '/names', label: 'Names', icon: <Sparkles />, color: 'text-amber-500' },
                { path: '/juz', label: 'Juz', icon: <Star />, color: 'text-blue-500' },
                { path: '/search', label: 'Search', icon: <SearchIcon />, color: 'text-teal-500' }
              ].map((tool) => (
                <Link key={tool.label} to={tool.path} className="flex flex-col items-center gap-2.5 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all border dark:border-white/5 group">
                   <div className={`p-2 rounded-lg ${tool.color} group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                   <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">{tool.label}</span>
                </Link>
              ))}
           </div>
        </div>
      </div>

      {/* Featured Verses */}
      {randomAyah && (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] border dark:border-white/5 shadow-sacred relative group text-center overflow-hidden">
           <Quote className="absolute top-10 right-10 text-emerald-500/5 group-hover:scale-125 transition-transform duration-1000" size={240} />
           <div className="relative z-10 space-y-8">
              <h4 className="text-[10px] font-black text-emerald-800 dark:text-emerald-500 uppercase tracking-[0.4em]">Daily Reflection</h4>
              <p className="font-arabic text-3xl md:text-5xl text-slate-900 dark:text-white leading-[1.8] max-w-4xl mx-auto" dir="rtl">
                 {randomAyah[0].text}
              </p>
              <div className="space-y-3 max-w-2xl mx-auto">
                 <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 italic font-medium">"{randomAyah[1].text}"</p>
                 <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400 hover:underline inline-block">
                    {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* Popular Surahs List */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-2xl font-black tracking-tight dark:text-white italic">Featured Surahs</h2>
           <Link to="/surah" className="text-[9px] font-black text-emerald-800 dark:text-emerald-500 hover:underline uppercase tracking-widest flex items-center gap-2">Explore Library <ChevronRight size={12} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PopularSurahs.map((surah) => (
            <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-white/5 shadow-sm hover:border-emerald-700 transition-all flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-black text-xs group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-inner">
                     {surah.id}
                  </div>
                  <div>
                    <h3 className="font-black text-base dark:text-white leading-none">{surah.name}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{surah.translation}</p>
                  </div>
               </div>
               <span className="font-arabic text-xl dark:text-white opacity-40 group-hover:opacity-100 transition-opacity" dir="rtl">{surah.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Footer Info */}
      <section className="bg-slate-950 text-white rounded-[3.5rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
         <div className="relative z-10 space-y-6 max-w-xl text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black leading-none italic">
              Ad-Free. <br />Private. <span className="text-emerald-500">Global.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              We believe the Word of Allah should be accessible without trackers, noise, or distractions. Join the Ummah in reading.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
               <Link to="/about" className="px-8 py-4 bg-emerald-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Our Vision</Link>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[120px] -z-10"></div>
      </section>
    </div>
  );
};

export default Home;
