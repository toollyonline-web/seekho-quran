
import React, { useEffect, useState, useCallback } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  Search as SearchIcon, BookOpen, Clock, Star, 
  ChevronRight, PlayCircle, Loader2, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<any>(null);
  const [hijri, setHijri] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async () => {
    try {
      setHijri(getHijriParts());
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);
      
      const locAllowed = localStorage.getItem('qs_location_allowed') === 'true';
      if (locAllowed) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => setPrayers(await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude)),
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
    const saved = localStorage.getItem('qs_last_read');
    if (saved) setLastRead(JSON.parse(saved));
    loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2ca4ab] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="page-transition space-y-12 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-8">
        <div className="flex justify-center mb-4">
           <div className="w-16 h-16 bg-[#2ca4ab] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">QS</div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight dark:text-white">The Noble Quran</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2ca4ab] transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Search, Surah, Juz, or Ayah..."
            className="w-full pl-16 pr-8 py-5 bg-white dark:bg-[#181a1b] border-2 border-transparent dark:border-[#2c2e30] rounded-2xl shadow-xl focus:border-[#2ca4ab] outline-none transition-all text-lg font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
           <span>Suggested:</span>
           <Link to="/surah/36" className="text-[#2ca4ab] hover:underline">Surah Yaseen</Link>
           <Link to="/surah/55" className="text-[#2ca4ab] hover:underline">Ar-Rahman</Link>
           <Link to="/surah/18" className="text-[#2ca4ab] hover:underline">Al-Kahf</Link>
           <Link to="/surah/67" className="text-[#2ca4ab] hover:underline">Al-Mulk</Link>
        </div>
      </section>

      {/* Quick Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Read */}
        <Link to={lastRead ? `/surah/${lastRead.id}` : '/surah'} className="quran-card p-8 rounded-3xl flex flex-col justify-between group">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                 <PlayCircle size={14} className="text-[#2ca4ab]" /> Resume Reading
              </p>
              <h3 className="text-2xl font-bold dark:text-white group-hover:text-[#2ca4ab] transition-colors">
                {lastRead?.name || 'Surah Al-Fatihah'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">Ayah {lastRead?.ayah || '1'}</p>
           </div>
           <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#2ca4ab]">
              Go to Verse <ChevronRight size={14} />
           </div>
        </Link>

        {/* Prayer Times */}
        <div className="quran-card p-8 rounded-3xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                 <Clock size={18} className="text-[#2ca4ab]" /> Prayer Times
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{hijri?.day} {hijri?.month}</span>
           </div>
           {prayers ? (
             <div className="grid grid-cols-5 gap-1">
               {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                 <div key={p} className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-[8px] uppercase font-bold text-slate-400">{p}</p>
                    <p className="text-[10px] font-bold dark:text-white mt-1">{prayers[p as keyof PrayerTimes].split(' ')[0]}</p>
                 </div>
               ))}
             </div>
           ) : <Loader2 size={18} className="animate-spin mx-auto text-slate-300" />}
        </div>

        {/* Tools Shortcut */}
        <div className="quran-card p-8 rounded-3xl flex flex-col justify-center gap-4">
           <div className="grid grid-cols-2 gap-4">
              <Link to="/juz" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-[#2ca4ab]/10 transition-colors">
                 <Star size={16} className="text-amber-500" />
                 <span className="text-xs font-bold dark:text-white">Juz</span>
              </Link>
              <Link to="/tasbeeh" className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-[#2ca4ab]/10 transition-colors">
                 <Sparkles size={16} className="text-purple-500" />
                 <span className="text-xs font-bold dark:text-white">Tasbeeh</span>
              </Link>
           </div>
        </div>
      </div>

      {/* Featured Verse */}
      {randomAyah && (
        <section className="quran-card p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden">
           <div className="relative z-10 space-y-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Verse of the Day</p>
              <p className="font-arabic text-3xl md:text-5xl text-slate-900 dark:text-white leading-[1.8] max-w-4xl mx-auto" dir="rtl">
                 {randomAyah[0].text}
              </p>
              <div className="space-y-3">
                 <p className="text-lg text-slate-500 italic max-w-2xl mx-auto">"{randomAyah[1].text}"</p>
                 <Link to={`/surah/${randomAyah[0].surah.number}`} className="text-xs font-bold text-[#2ca4ab] hover:underline uppercase tracking-widest">
                    {randomAyah[0].surah.englishName} : {randomAyah[0].numberInSurah}
                 </Link>
              </div>
           </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-[#2ca4ab] rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
         <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-black italic">Read. Reflect. Connect.</h2>
            <p className="text-white/80 text-lg font-medium">Dive into the divine revelations with a pure, ad-free interface designed for the seeker.</p>
            <Link to="/surah" className="inline-block px-10 py-4 bg-white text-[#2ca4ab] rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest">
               Start Reading
            </Link>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </section>
    </div>
  );
};

export default Home;
