
import React, { useEffect, useState } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, ISLAMIC_EVENTS } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { MapPin, Clock, Book, BookOpen, Star, Info, ArrowRight, Download, Quote, Smartphone, Heart, Sparkles, ShieldCheck, Sun, CheckCircle2, Circle, Calendar, Share2, Compass, Hash } from 'lucide-react';
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

const DAILY_REMINDERS = [
  { 
    text: "Kindness is a mark of faith, and whoever is not kind has no faith.", 
    urdu: "نرمی ایمان کی علامت ہے، اور جس میں نرمی نہیں اس میں ایمان نہیں۔",
    source: "Prophet Muhammad (PBUH)" 
  },
  { 
    text: "The best of people are those that bring most benefit to the rest of mankind.", 
    urdu: "لوگوں میں سب سے بہتر وہ ہے جو دوسروں کو فائدہ پہنچائے۔",
    source: "Daraqutni" 
  },
  { 
    text: "Speak a good word or remain silent.", 
    urdu: "اچھی بات کہو ورنہ خاموش رہو۔",
    source: "Bukhari & Muslim" 
  },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  const [dailyReminder, setDailyReminder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [sunnahs, setSunnahs] = useState<Record<string, boolean>>({});
  
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  useEffect(() => {
    const savedSunnahs = localStorage.getItem('qs_sunnah_today');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('qs_sunnah_date');
    
    if (savedDate === today && savedSunnahs) {
      setSunnahs(JSON.parse(savedSunnahs));
    } else {
      localStorage.setItem('qs_sunnah_date', today);
      localStorage.setItem('qs_sunnah_today', JSON.stringify({}));
    }

    const initData = async () => {
      try {
        const ayahRes = await fetchRandomAyah();
        const arabic = ayahRes.find((p: any) => p.edition.identifier === 'quran-uthmani');
        const english = ayahRes.find((p: any) => p.edition.language === 'en');
        const urdu = ayahRes.find((p: any) => p.edition.identifier === 'ur.jalandhara');
        
        setDailyAyah({ arabic, english, urdu });
        setDailyReminder(DAILY_REMINDERS[Math.floor(Math.random() * DAILY_REMINDERS.length)]);

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            const p = await fetchPrayerTimes(latitude, longitude);
            setPrayers(p);
          },
          async () => {
            const p = await fetchPrayerTimes(21.4225, 39.8262);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-green-800 p-8 md:p-12 text-white shadow-xl shadow-green-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{t.home.heroTitle}</h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 opacity-90">{t.home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/surah" className="px-6 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">{t.home.browseSurahs}</Link>
            <button onClick={handleShareApp} className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors">
              <Share2 size={20} /> {t.home.shareApp}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-700 rounded-full blur-3xl opacity-40"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={20} /> {t.home.moodTitle}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOODS.map((mood) => (
                <Link key={mood.name} to={`/surah/${mood.surahId}`} className={`flex items-center justify-between p-4 rounded-2xl shadow-sm border border-transparent hover:border-white/20 transition-all ${mood.color}`}>
                  <span className="font-bold">{mood.name}</span>
                  {mood.icon}
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Quote className="text-blue-500" size={20} /> {t.home.dailyWisdom}
            </h2>
            {dailyReminder && (
              <div className="space-y-6">
                <p className="text-2xl font-bold leading-relaxed">"{dailyReminder.text}"</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">— {dailyReminder.source}</p>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="text-green-600" size={20} /> {t.home.popularSurahs}
              </h2>
              <Link to="/surah" className="text-sm font-bold text-green-700 hover:underline">{t.home.viewAll} &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PopularSurahs.map((surah) => (
                <Link key={surah.id} to={`/surah/${surah.id}`} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border dark:border-slate-700 shadow-sm hover:border-green-400 transition-all flex items-center justify-between group relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-700 dark:text-green-400 font-bold group-hover:bg-green-700 group-hover:text-white transition-colors">{surah.id}</div>
                    <div>
                      <h3 className="font-bold text-lg">{surah.name}</h3>
                      <p className="text-xs text-slate-500">{surah.translation}</p>
                    </div>
                  </div>
                  <p className="font-arabic text-2xl relative z-10" dir="rtl">{surah.arabic}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-green-600" size={20} /> {t.nav.tools}
            </h2>
            {prayers ? (
              <div className="space-y-2">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{name}</span>
                    <span className="font-mono text-green-700 dark:text-green-400 font-bold">{prayers[name as keyof PrayerTimes]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8 animate-spin"><Clock /></div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={20} /> {t.home.dailySunnahs}
            </h2>
            <div className="space-y-4">
              {DAILY_SUNNAHS.map((sunnah) => (
                <button key={sunnah.id} onClick={() => toggleSunnah(sunnah.id)} className="w-full flex items-start gap-3 p-3 rounded-xl border dark:border-slate-700 text-left">
                  {sunnahs[sunnah.id] ? <CheckCircle2 className="text-green-600" /> : <Circle className="text-slate-300" />}
                  <div>
                    <p className={`font-bold text-sm ${sunnahs[sunnah.id] ? 'line-through opacity-50' : ''}`}>{sunnah.label}</p>
                    <p className="text-[10px] text-slate-400">{sunnah.detail}</p>
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
