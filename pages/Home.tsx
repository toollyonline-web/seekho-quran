
import React, { useEffect, useState } from 'react';
import { fetchPrayerTimes, fetchRandomAyah, ISLAMIC_EVENTS } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { MapPin, Clock, Book, BookOpen, Star, Info, ArrowRight, Download, Quote, Smartphone, Heart, Sparkles, ShieldCheck, Sun, CheckCircle2, Circle, Calendar, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  { text: "Kindness is a mark of faith, and whoever is not kind has no faith.", source: "Prophet Muhammad (PBUH)" },
  { text: "The best of people are those that bring most benefit to the rest of mankind.", source: "Daraqutni" },
  { text: "Speak a good word or remain silent.", source: "Bukhari & Muslim" },
  { text: "Patience is the key to joy.", source: "Hazrat Ali (RA)" },
  { text: "Happiness is found in the remembrance of Allah.", source: "Quran 13:28" },
  { text: "A powerful person is not the one who can wrestle, but the one who can control his anger.", source: "Sahih Bukhari" },
  { text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", source: "Sahih Bukhari" },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  const [dailyReminder, setDailyReminder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [sunnahs, setSunnahs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load Sunnahs
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
        const urdu = ayahRes.find((p: any) => p.edition.language === 'ur');
        
        setDailyAyah({ arabic, english, urdu });

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        setDailyReminder(DAILY_REMINDERS[dayOfYear % DAILY_REMINDERS.length]);

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

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const toggleSunnah = (id: string) => {
    const newSunnahs = { ...sunnahs, [id]: !sunnahs[id] };
    setSunnahs(newSunnahs);
    localStorage.setItem('qs_sunnah_today', JSON.stringify(newSunnahs));
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Seekho - Read Quran Online',
          text: 'Check out Quran Seekho - a clean, ad-free platform for reading the Holy Quran with translations and prayer times.',
          url: 'https://quranseekho.online/',
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText('https://quranseekho.online/');
      alert('Link copied to clipboard! Share it with your friends and family.');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-green-700 font-medium">Bismillah... Loading content</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Hero Banner with SEO H1 */}
      <section className="relative overflow-hidden rounded-3xl bg-green-800 p-8 md:p-12 text-white shadow-xl shadow-green-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Quran Seekho: Read & Learn the Holy Quran</h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 opacity-90">
            A beautiful, distraction-free environment for spiritual growth. Explore 114 Surahs and 30 Juz with accurate translations and daily Islamic tools.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/surah" className="px-6 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">Browse Surahs</Link>
            
            <button 
              onClick={handleShareApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              <Share2 size={20} /> Share App
            </button>
            
            {!isInstalled && deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-6 py-3 bg-green-900/50 text-white border border-white/20 rounded-xl font-bold hover:bg-green-900 transition-colors"
              >
                <Download size={20} /> Install
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-700 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-12 opacity-10 pointer-events-none hidden lg:block">
           <Book size={300} strokeWidth={0.5} />
        </div>
      </section>

      {/* Intro for SEO */}
      <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-green-100 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-4xl mx-auto">
          Quran Seekho is a free, ad-free Islamic platform. Whether you are seeking a specific <strong>Surah</strong>, browsing by <strong>Juz (Sipara)</strong>, or checking <strong>Prayer Times</strong>, we offer a seamless interface designed for the Ummah.
        </p>
      </section>

      {/* Grid for Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: Daily Feed */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Mood-Based Guidance */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500" size={20} />
                <h2 className="text-xl font-bold">How are you feeling?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOODS.map((mood) => (
                    <Link 
                        key={mood.name} 
                        to={`/surah/${mood.surahId}`}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-transparent hover:border-white/20 ${mood.color}`}
                    >
                        <div className="flex items-center gap-3">
                            {mood.icon}
                            <span className="font-bold">{mood.name}</span>
                        </div>
                        <ArrowRight size={14} className="opacity-50" />
                    </Link>
                ))}
            </div>
          </section>

          {/* Popular Surahs Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-green-600" size={20} />
                    <h2 className="text-xl font-bold">Popular Surahs</h2>
                </div>
                <Link to="/surah" className="text-sm font-bold text-green-700 hover:underline">View All &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PopularSurahs.map((surah) => (
                    <Link 
                        key={surah.id} 
                        to={`/surah/${surah.id}`}
                        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border dark:border-slate-700 shadow-sm hover:border-green-400 dark:hover:border-green-600 transition-all flex items-center justify-between group overflow-hidden relative"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-700 dark:text-green-400 font-bold group-hover:bg-green-700 group-hover:text-white transition-colors">
                                {surah.id}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{surah.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{surah.translation}</p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="font-arabic text-2xl mb-0.5" dir="rtl">{surah.arabic}</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Book size={80} />
                        </div>
                    </Link>
                ))}
            </div>
          </section>

          {/* Daily Ayah */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <h2 className="text-xl font-bold">Ayah of the Day</h2>
            </div>
            {dailyAyah && (
              <div className="space-y-6">
                <p className="font-arabic text-3xl md:text-4xl text-right leading-[1.8] md:leading-[2.2] mb-4 quran-text" dir="rtl" lang="ar">
                  {dailyAyah.arabic?.text}
                </p>
                <div className="space-y-4">
                  {dailyAyah.english && (
                    <div className="p-4 bg-green-50 dark:bg-slate-900 rounded-xl border border-green-100/50 dark:border-slate-700/50">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">English Translation</p>
                      <p className="italic leading-relaxed text-slate-700 dark:text-slate-300">{dailyAyah.english.text}</p>
                    </div>
                  )}
                  {dailyAyah.urdu && (
                    <div className="p-4 bg-blue-50 dark:bg-slate-900 rounded-xl border border-blue-100/50 dark:border-slate-700/50">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1 text-right">Urdu Translation</p>
                      <p className="font-urdu text-3xl leading-relaxed text-right text-slate-700 dark:text-slate-300" dir="rtl">{dailyAyah.urdu.text}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Upcoming Events Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-green-600" size={20} /> Important Days
              </h2>
              <Link to="/calendar" className="text-[10px] font-bold uppercase text-green-700 hover:underline">Full Calendar</Link>
            </div>
            <div className="space-y-4">
              {ISLAMIC_EVENTS.slice(0, 3).map((event, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border dark:border-slate-700 shrink-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Hijri</span>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400 leading-none">{event.hijri.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{event.name}</p>
                    <p className="text-[10px] text-slate-400">{event.hijri.split(' ').slice(1).join(' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prayer Times Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-green-600" size={20} /> Prayers
              </h2>
              <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-bold">
                {location ? 'Nearby' : 'Mecca'}
              </span>
            </div>
            {prayers ? (
              <div className="space-y-2">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-green-100 dark:hover:border-slate-600">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{name}</span>
                    <span className="font-mono text-green-700 dark:text-green-400 font-bold">{prayers[name as keyof PrayerTimes]}</span>
                  </div>
                ))}
              </div>
            ) : (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>
            )}
          </div>

          {/* Daily Sunnah Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={20} /> Daily Sunnahs
            </h2>
            <div className="space-y-4">
              {DAILY_SUNNAHS.map((sunnah) => (
                <button
                  key={sunnah.id}
                  onClick={() => toggleSunnah(sunnah.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-green-200 transition-all text-left"
                >
                  <div className="mt-1">
                    {sunnahs[sunnah.id] ? (
                      <CheckCircle2 className="text-green-600" size={20} />
                    ) : (
                      <Circle className="text-slate-300" size={20} />
                    )}
                  </div>
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
