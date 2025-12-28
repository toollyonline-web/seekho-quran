
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail } from '../services/quranApi';
import { ChevronLeft, ChevronRight, Settings, Bookmark, BookmarkCheck, Type } from 'lucide-react';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isJuz = location.pathname.includes('/juz/');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [fontSize, setFontSize] = useState(32);
  const [isAmiri, setIsAmiri] = useState(false); // Toggle between Scheherazade (default) and Amiri
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('qs_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved).map((b: any) => `${b.surahNumber}:${b.ayahNumber}`));
    
    const savedFont = localStorage.getItem('qs_preferred_font');
    if (savedFont) setIsAmiri(savedFont === 'amiri');
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      if (id) {
        try {
          const detail = isJuz 
            ? await fetchJuzDetail(parseInt(id)) 
            : await fetchSurahDetail(parseInt(id));
          setData(detail);
        } catch (err) {
          console.error("Failed to load content", err);
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadContent();
  }, [id, isJuz]);

  // Handle active ayah tracking during scroll
  useEffect(() => {
    if (loading || !data) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Focused on the upper-middle part of the screen
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ayahNum = parseInt(entry.target.getAttribute('data-ayah-number') || '0');
          setActiveAyah(ayahNum);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.ayah-container');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [loading, data]);

  const toggleBookmark = (ayah: any, surahInfo: any) => {
    const bookmarkKey = `${surahInfo.number}:${ayah.numberInSurah}`;
    const saved = localStorage.getItem('qs_bookmarks');
    let currentBookmarks = saved ? JSON.parse(saved) : [];
    
    if (bookmarks.includes(bookmarkKey)) {
      currentBookmarks = currentBookmarks.filter((b: any) => `${b.surahNumber}:${b.ayahNumber}` !== bookmarkKey);
      setBookmarks(bookmarks.filter(k => k !== bookmarkKey));
    } else {
      const newBookmark = {
        surahNumber: surahInfo.number,
        surahName: surahInfo.englishName,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text,
        timestamp: Date.now()
      };
      currentBookmarks.push(newBookmark);
      setBookmarks([...bookmarks, bookmarkKey]);
    }
    localStorage.setItem('qs_bookmarks', JSON.stringify(currentBookmarks));
  };

  const toggleFont = () => {
    const newVal = !isAmiri;
    setIsAmiri(newVal);
    localStorage.setItem('qs_preferred_font', newVal ? 'amiri' : 'scheherazade');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <div className="text-center py-20">Content not found.</div>;

  let arabic: any, english: any, urdu: any;

  if (isJuz) {
    arabic = data.find((e: any) => e.edition.identifier === 'quran-uthmani');
    english = data.find((e: any) => e.edition.language === 'en');
    urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');
  } else {
    arabic = data.find((e: any) => e.edition.format === 'text' && e.edition.type === 'quran');
    english = data.find((e: any) => e.edition.language === 'en');
    urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');
  }

  const title = isJuz ? `Juz ${id}` : arabic?.englishName;
  const subtitle = isJuz ? `Part of the Holy Quran` : `${arabic?.englishNameTranslation} • ${arabic?.revelationType}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <Link to={prevLink} className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-widest mb-1">{isJuz ? 'Sipara' : 'Surah'} {id}</p>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <Link to={nextLink} className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
            <ChevronRight size={24} />
          </Link>
        </div>

        {(!isJuz || (isJuz && arabic?.ayahs[0]?.numberInSurah === 1)) && parseInt(id!) !== 9 && (
            <div className="flex justify-center py-6 relative z-10">
                <p 
                  className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-5xl text-center leading-[2.5] quran-text`} 
                  dir="rtl" 
                  lang="ar"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
            </div>
        )}

        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-green-600 transition-colors"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>

        {isSettingsOpen && (
          <div className="absolute top-14 right-4 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-2xl p-4 z-50 w-64 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Translations</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={showEnglish} onChange={() => setShowEnglish(!showEnglish)} className="accent-green-600" /> English
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={showUrdu} onChange={() => setShowUrdu(!showUrdu)} className="accent-green-600" /> Urdu
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Arabic Script</label>
              <button 
                onClick={toggleFont}
                className="w-full flex items-center justify-between p-2 text-sm border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>{isAmiri ? 'Amiri Font' : 'Scheherazade Font'}</span>
                <Type size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Arabic Size: {fontSize}px</label>
              <input
                type="range" min="20" max="64" value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pb-20">
        {arabic?.ayahs.map((ayah: any, index: number) => {
          const ayahNumber = ayah.number;
          const isBookmarked = bookmarks.includes(`${arabic.number}:${ayah.numberInSurah}`);
          const isActive = activeAyah === ayahNumber;
          
          return (
            <div 
              key={ayahNumber} 
              data-ayah-number={ayahNumber}
              className={`ayah-container group scroll-mt-24 p-4 md:p-8 rounded-2xl transition-all duration-500 border-l-4 ${
                isActive 
                  ? 'bg-green-50/50 dark:bg-green-900/10 border-green-600 shadow-sm' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className={`w-10 h-10 rounded-full border dark:border-slate-700 flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                    isActive ? 'bg-green-600 text-white border-green-600 opacity-100' : 'opacity-40'
                  }`}>
                    {ayah.numberInSurah || ayah.number}
                  </div>
                  <button 
                    onClick={() => toggleBookmark(ayah, arabic)}
                    className={`transition-colors ${isBookmarked ? 'text-green-600' : 'text-slate-300 hover:text-green-400'}`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  >
                    {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                </div>
                <div className="flex-1 space-y-8">
                  <p
                    className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-right leading-[2.2] md:leading-[2.8] quran-text transition-all duration-300 ${
                      isActive ? 'text-green-900 dark:text-green-50' : ''
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                    dir="rtl"
                    lang="ar"
                  >
                    {ayah.text}
                  </p>

                  <div className="space-y-4">
                    {showEnglish && english?.ayahs[index] && (
                      <div className="border-l-2 border-green-100 dark:border-slate-800 pl-4 py-1">
                        <p className={`leading-relaxed italic transition-colors duration-300 ${
                          isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {english.ayahs[index].text}
                        </p>
                      </div>
                    )}
                    {showUrdu && urdu?.ayahs[index] && (
                      <div className="border-r-2 border-green-100 dark:border-slate-800 pr-4 py-1 text-right" dir="rtl">
                        <p className={`font-urdu text-3xl urdu-text transition-colors duration-300 ${
                          isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {urdu.ayahs[index].text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurahReader;
