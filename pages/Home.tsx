
import React, { useEffect, useState } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, ISLAMIC_EVENTS, getHijriParts } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { 
  MapPin, Clock, Book, BookOpen, Star, Info, ArrowRight, Download, Quote, 
  Smartphone, Heart, Sparkles, ShieldCheck, Sun, CheckCircle2, Circle, 
  Calendar, Share2, Compass, Hash, PlayCircle, Target, Zap, LayoutGrid, Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', translation: 'The Inevitable' },
];

const MOODS = [
  { name: 'Anxious', icon: <ShieldCheck size={18} />, color: 'bg-blue-100 text-blue-700', surahId: 94 },
  { name: 'Sad', icon: <Heart size={18} />, color: 'bg-rose-100 text-rose-700', surahId: 93 },
  { name: 'Grateful', icon: <Sun size={18} />, color: 'bg-amber-100 text-amber-700', surahId: 55 },
  { name: 'Lost', icon: <Sparkles size={18} />, color: 'bg-purple-100 text-purple-700', surahId: 1 },
];

const DAILY_SUNNAHS = [
  { id: 'miswak', label: 'Use Miswak', detail: 'A Sunnah for purification of the mouth.' },
  { id: 'smile', label: 'Smile at someone', detail: 'Smiling is an act of Sadaqah (Charity).' },
  { id: 'kursi', label: 'Ayatul Kursi (Night)', detail: 'Protection throughout the night.' },
  { id: 'dhikr', label: 'Morning Adhkar', detail: 'Start your day with remembrance.' },
];

const KNOWLEDGE_BASE = [
  { fact: "The Quran was revealed to Prophet Muhammad (PBUH) over a period of 23 years.", source: "Islamic History" },
  { fact: "Surah Al-Fatiha is known as 'Umm al-Kitab' (The Mother of the Book).", source: "Hadith" },
  { fact: "The longest Surah in the Quran is Surah Al-Baqarah with 286 verses.", source: "Quran Facts" },
  { fact: "The shortest Surah in the Quran is Surah Al-Kawthar with 3 verses.", source: "Quran Facts" },
  { fact: "There are 114 Surahs and 30 Juz in the Holy Quran.", source: "General Knowledge" },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sunnahs, setSunnahs] = useState<Record<string, boolean>>({});
  const [lastRead, setLastRead] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState({ count: 0, goal: 5 });
  const [didYouKnow, setDidYouKnow] = useState<any>(null);
  const [hijri, setHijri] = useState<any>(null);

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  useEffect(() => {
    const today = new Date().toDateString();
    
    // Load last read
    const savedLastRead = localStorage.getItem('qs_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));

    // Load knowledge of the day
    setDidYouKnow(KNOWLEDGE_BASE[Math.floor(Math.random() * KNOWLEDGE_BASE.length)]);

    // Load Sunnahs
    const savedSunnahs = localStorage.getItem('qs_sunnah_today');
    const savedSunnahDate = localStorage.getItem('qs_sunnah_date');
    if (savedSunnahDate === today && savedSunnahs) {
      setSunnahs(JSON.parse(savedSunnahs));
    } else {
      localStorage.setItem('qs_sunnah_date', today);
      localStorage.setItem('qs_sunnah_today', JSON.stringify({}));
    }

    // Load Reading Goal
    const savedGoal = localStorage.getItem('qs_reading_goal');
    const savedProgress = localStorage.getItem('qs_reading_progress');
    const progressDate = localStorage.getItem('qs_reading_date');
    
    if (progressDate === today && savedProgress) {
      setReadingProgress({ 
        count: parseInt(savedProgress), 
        goal: savedGoal ? parseInt(savedGoal) : 5 
      });
    } else {
      localStorage.setItem('qs_reading_date', today);
      localStorage.setItem('qs_reading_progress', '0');
      setReadingProgress({ count: 0, goal: savedGoal ? parseInt(savedGoal) : 5 });
    }

    const initData = async () => {
      try {
        const hParts = getHijriParts();
        setHijri(hParts);

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            const p = await fetchPrayerTimes(latitude, longitude);
            setPrayers(p);
          },
          async () => {
            const p = await fetchPrayerTimes(21.4225, 39.8262); // Mecca fallback
            setPrayers(p);
          }
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const toggleSunnah = (id: string) => {
    const newSunnahs = { ...sunnahs, [id]: !sunnahs[id] };
    setSunnahs(newSunnahs);
    localStorage.setItem('qs_sunnah_today', JSON.stringify(newSunnahs));
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Seekho',
          url: 'https://quranseekho.online/',
        });
      } catch (err) { console.log(err); }
    }
  };

  const upcomingEvents = ISLAMIC_EVENTS.slice(0, 3); // Simple logic for demonstration

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-green-800 p-8 md:p-14 text-white shadow-2xl shadow-green-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Sparkles size={12} className="text-yellow-400" /> Professional Islamic Companion
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{t.home.heroTitle}</h1>
          <p className="text-green-100 text-lg md:text-xl mb-10 opacity-90 font-medium">{t.home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/surah" className="px-8 py-4 bg-white text-green-800 rounded-2xl font-black hover:bg-green-50 transition-all shadow-xl hover:scale-105 active:scale-95">{t.home.browseSurahs}</Link>
            <button onClick={handleShareApp} className="flex items-center gap-3 px-8 py-4 bg-green-700 text-white border border-green-600/50 rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg">
              <Share2 size={20} /> {t.home.shareApp}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-500 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none">
          <BookOpen size={300} strokeWidth={1} />
        </div>
      </section>

      {/* 1. Resume Reading (Conditional) */}
      {lastRead && (
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400">
                <PlayCircle size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.home.resumeReading}</p>
                <h3 className="text-xl font-bold">Surah {lastRead.name}</h3>
                <p className="text-sm text-slate-500">Ayah {lastRead.ayah}</p>
              </div>
            </div>
            <Link to={`/surah/${lastRead.id}`} className="w-full md:w-auto px-10 py-4 bg-green-700 text-white rounded-2xl font-black hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg group-hover:scale-105 active:scale-95">
              {t.home.continue} <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}

      {/* 2. Quick Actions Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-black flex items-center gap-2 px-1 uppercase tracking-wider text-slate-400 text-xs">
          <LayoutGrid size={16} /> {t.home.quickActions}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t.nav.qibla, path: '/qibla', icon: <Compass className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { label: t.nav.zakat, path: '/zakat', icon: <Coins className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { label: t.nav.duas, path: '/duas', icon: <Star className="text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
            { label: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash className="text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-900/10' }
          ].map((action, i) => (
            <Link key={i} to={action.path} className={`p-6 rounded-[2rem] border dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 bg-white dark:bg-slate-800`}>
              <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                {action.icon}
              </div>
              <span className="text-sm font-black text-slate-600 dark:text-slate-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Reading Goal & Tracker */}
            <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border dark:border-slate-700 relative overflow-hidden">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Target className="text-rose-500" size={24} /> {t.home.readingGoal}
              </h2>
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{readingProgress.count}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.home.ayahsRead}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-400">/ {readingProgress.goal}</p>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (readingProgress.count / readingProgress.goal) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Small steps daily lead to great spiritual rewards.</p>
              </div>
            </section>

            {/* 4. Knowledge of the Day */}
            <section className="bg-green-700 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
              <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                <Zap className="text-yellow-400" size={24} fill="currentColor" /> {t.home.knowledgeDay}
              </h2>
              {didYouKnow && (
                <div className="space-y-4">
                  <p className="text-lg font-bold leading-relaxed">"{didYouKnow.fact}"</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">— Source: {didYouKnow.source}</p>
                </div>
              )}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Info size={100} />
              </div>
            </section>
          </div>

          {/* Popular Surahs (Existing) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2">
                <BookOpen className="text-green-600" size={24} /> {t.home.popularSurahs}
              </h2>
              <Link to="/surah" className="text-xs font-black text-green-700 uppercase tracking-widest hover:underline">{t.home.viewAll} &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PopularSurahs.map((surah) => (
                <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border dark:border-slate-700 shadow-sm hover:border-green-400 transition-all flex items-center justify-between group relative overflow-hidden">
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 font-bold group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm">{surah.id}</div>
                    <div>
                      <h3 className="font-bold text-lg">{surah.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{surah.translation}</p>
                    </div>
                  </div>
                  <p className="font-arabic text-3xl relative z-10 text-slate-800 dark:text-slate-100" dir="rtl">{surah.arabic}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Moods (Existing) */}
          <section className="space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={24} /> {t.home.moodTitle}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOODS.map((mood) => (
                <Link key={mood.name} to={`/surah/${mood.surahId}`} className={`flex items-center justify-between p-6 rounded-[2rem] shadow-sm border border-transparent hover:border-white/20 transition-all hover:scale-105 active:scale-95 ${mood.color}`}>
                  <span className="font-black text-sm uppercase tracking-wider">{mood.name}</span>
                  {mood.icon}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Prayer Times (Existing) */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <Clock className="text-green-600" size={24} /> {t.home.prayerTimes}
            </h2>
            {prayers ? (
              <div className="space-y-2">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                  <div key={name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 transition-colors group">
                    <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-green-700">{name}</span>
                    <span className="font-mono text-green-700 dark:text-green-400 font-black text-lg">{prayers[name as keyof PrayerTimes]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8 animate-spin text-green-600"><Clock size={32} /></div>
            )}
          </div>

          {/* 5. Upcoming Islamic Events */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <Calendar className="text-blue-500" size={24} /> {t.home.upcomingEvents}
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="p-5 rounded-3xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{event.name}</h4>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {event.hijri}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
            <Link to="/calendar" className="mt-6 w-full py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-all border-t dark:border-slate-700 pt-6">
              Full Calendar <ArrowRight size={14} />
            </Link>
          </div>

          {/* Daily Sunnahs (Existing) */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <Sparkles className="text-yellow-500" size={24} /> {t.home.dailySunnahs}
            </h2>
            <div className="space-y-4">
              {DAILY_SUNNAHS.map((sunnah) => (
                <button key={sunnah.id} onClick={() => toggleSunnah(sunnah.id)} className="w-full flex items-start gap-4 p-4 rounded-[1.5rem] border dark:border-slate-700 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
                  {sunnahs[sunnah.id] ? <CheckCircle2 className="text-green-600 shrink-0" /> : <Circle className="text-slate-300 shrink-0" />}
                  <div>
                    <p className={`font-bold text-sm ${sunnahs[sunnah.id] ? 'line-through opacity-50' : 'text-slate-900 dark:text-white'}`}>{sunnah.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sunnah.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
