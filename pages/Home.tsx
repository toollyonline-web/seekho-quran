import React, { useEffect, useState } from 'react';
import { fetchPrayerTimes, fetchRandomAyah } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { MapPin, Clock, Book, BookOpen, Star, Info, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopularSurahs = [
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'Ya-Sin' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Beneficent' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', translation: 'The Inevitable' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
];

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const ayahRes = await fetchRandomAyah();
        const arabic = ayahRes.find((p: any) => p.edition.identifier === 'quran-uthmani');
        const english = ayahRes.find((p: any) => p.edition.language === 'en');
        const urdu = ayahRes.find((p: any) => p.edition.language === 'ur');
        
        setDailyAyah({ arabic, english, urdu });

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

    // PWA Install logic for Hero Button
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
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
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-green-800 p-8 md:p-12 text-white shadow-xl shadow-green-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Welcome to QuranSeekho</h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 opacity-90">
            Read, study, and understand the Holy Quran in a beautiful, distraction-free environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/surah" className="px-6 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">Start Reading</Link>
            
            {!isInstalled && deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                <Download size={20} /> Download App
              </button>
            )}
            
            {(isInstalled || !deferredPrompt) && (
              <Link to="/learn" className="px-6 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors">Learn Tajweed</Link>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-700 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-12 opacity-10 pointer-events-none hidden lg:block">
           <Book size={300} strokeWidth={0.5} />
        </div>
      </section>

      {/* Main Grid: Daily Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Ayah Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <h2 className="text-xl font-bold">Ayah of the Day</h2>
            </div>
            {dailyAyah && (
              <div className="space-y-6">
                <p 
                  className="font-arabic text-3xl md:text-4xl text-right leading-[1.8] md:leading-[2.2] mb-4 quran-text" 
                  dir="rtl" 
                  lang="ar"
                >
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
                <div className="flex justify-between items-center text-sm opacity-60 pt-4 border-t dark:border-slate-700">
                  <span>Surah {dailyAyah.arabic?.surah?.englishName} ({dailyAyah.arabic?.numberInSurah})</span>
                  <span>Juz {dailyAyah.arabic?.juz}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Browse Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/surah" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-slate-700 group hover:border-green-400 transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-700 mb-4 transition-transform group-hover:scale-110">
                    <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Read by Surah</h3>
                <p className="text-sm opacity-70 mb-4">Explore all 114 chapters of the Holy Quran with full translations.</p>
                <span className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Browse Surahs <ArrowRight size={16} /></span>
            </Link>
            <Link to="/juz" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-slate-700 group hover:border-orange-400 transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-700 mb-4 transition-transform group-hover:scale-110">
                    <Clock size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Read by Juz</h3>
                <p className="text-sm opacity-70 mb-4">Read the Quran in 30 equal parts, perfect for daily recitation.</p>
                <span className="text-orange-700 dark:text-orange-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore Juz <ArrowRight size={16} /></span>
            </Link>
          </div>

          {/* Popular Surahs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star className="text-green-600" size={20} /> Popular Surahs
              </h2>
              <Link to="/surah" className="text-sm text-green-700 hover:underline font-medium">View All Surahs</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PopularSurahs.map((surah) => (
                <Link 
                  key={surah.id} 
                  to={`/surah/${surah.id}`}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 hover:border-green-400 hover:shadow-sm transition-all text-center group"
                >
                  <p 
                    className="font-arabic text-2xl mb-1 text-green-800 dark:text-green-400 group-hover:scale-110 transition-transform" 
                    dir="rtl" 
                    lang="ar"
                  >
                    {surah.arabic}
                  </p>
                  <p className="font-bold text-sm">{surah.name}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest">{surah.translation}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-green-600" size={20} /> Prayer Times
              </h2>
              <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <MapPin size={10} /> {location ? 'Auto Detected' : 'Mecca'}
              </span>
            </div>

            {prayers ? (
              <div className="space-y-2">
                {Object.entries(prayers)
                  .filter(([key]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
                  .map(([name, time]) => (
                    <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-green-100 dark:hover:border-slate-600">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{name}</span>
                      <span className="font-mono text-green-700 dark:text-green-400 font-bold">{time}</span>
                    </div>
                  ))}
              </div>
            ) : (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            <div className="mt-6 pt-6 border-t dark:border-slate-700">
              <Link to="/learn" className="block p-4 bg-green-50 dark:bg-slate-900 rounded-xl text-center group">
                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-1">New to Quran?</p>
                <p className="text-sm font-bold group-hover:underline">Start Learning Tajweed &rarr;</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;