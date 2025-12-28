
import React, { useEffect, useState } from 'react';
import { fetchPrayerTimes, fetchRandomAyah } from '../services/quranApi';
import { PrayerTimes } from '../types';
import { MapPin, Clock, Book, BookOpen, Star, Info } from 'lucide-react';

const Home: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const ayahRes = await fetchRandomAyah();
        // Correctly identify parts by language/identifier
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
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-green-700 font-medium">Bismillah... Loading content</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-green-800 p-8 md:p-12 text-white shadow-xl shadow-green-900/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Welcome to QuranSeekho</h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 opacity-90">
            Read, study, and understand the Holy Quran in a beautiful, distraction-free environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#/surah" className="px-6 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">Start Reading</a>
            <a href="#/learn" className="px-6 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors">Learn Tajweed</a>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-700 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-12 opacity-10 pointer-events-none hidden lg:block">
           <Book size={300} strokeWidth={0.5} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <h2 className="text-xl font-bold">Ayah of the Day</h2>
            </div>
            {dailyAyah && (
              <div className="space-y-6">
                <p className="font-arabic text-3xl md:text-4xl text-right leading-loose mb-4">
                  {dailyAyah.arabic?.text}
                </p>
                <div className="space-y-4">
                  {dailyAyah.english && (
                    <div className="p-4 bg-green-50 dark:bg-slate-900 rounded-xl">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">English Translation</p>
                      <p className="italic leading-relaxed">{dailyAyah.english.text}</p>
                    </div>
                  )}
                  {dailyAyah.urdu && (
                    <div className="p-4 bg-blue-50 dark:bg-slate-900 rounded-xl">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1 text-right">Urdu Translation</p>
                      <p className="font-urdu text-3xl leading-relaxed text-right">{dailyAyah.urdu.text}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-slate-700 group hover:border-green-300 transition-all">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-700 mb-4">
                    <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Read by Surah</h3>
                <p className="text-sm opacity-70 mb-4">Explore all 114 chapters of the Holy Quran with full translations.</p>
                <a href="#/surah" className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Browse Surahs &rarr;</a>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-slate-700 group hover:border-green-300 transition-all">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-700 mb-4">
                    <Clock size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Read by Juz</h3>
                <p className="text-sm opacity-70 mb-4">Read the Quran in 30 equal parts, perfect for daily recitation.</p>
                <a href="#/juz" className="text-orange-700 dark:text-orange-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore Juz &rarr;</a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-green-600" size={20} /> Prayer Times
              </h2>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <MapPin size={10} /> {location ? 'Current Location' : 'Mecca'}
              </span>
            </div>

            {prayers ? (
              <div className="space-y-3">
                {Object.entries(prayers)
                  .filter(([key]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
                  .map(([name, time]) => (
                    <div key={name} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 dark:hover:bg-slate-700 transition-colors">
                      <span className="font-medium">{name}</span>
                      <span className="font-mono text-green-700 dark:text-green-400 font-bold">{time}</span>
                    </div>
                  ))}
              </div>
            ) : (
                <p>Loading times...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
