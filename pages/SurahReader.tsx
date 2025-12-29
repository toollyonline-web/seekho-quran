
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Settings, Bookmark, BookmarkCheck, Type, Book, 
  Info, X, Play, Pause, Volume2, VolumeX, Eye, EyeOff, Maximize2, Minimize2 
} from 'lucide-react';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isJuz = location.pathname.includes('/juz/');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [focusMode, setFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(38);
  const [isAmiri, setIsAmiri] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [tafsirData, setTafsirData] = useState<Record<number, string>>({});
  const [tafsirLoading, setTafsirLoading] = useState<Record<number, boolean>>({});
  
  // Audio State
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initial Load
    const savedBookmarks = localStorage.getItem('qs_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks).map((b: any) => `${b.surahNumber}:${b.ayahNumber}`));
    
    const savedTheme = localStorage.getItem('theme') as any;
    if (savedTheme) {
      setReadingTheme(savedTheme === 'sepia' || savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light');
    }

    const savedFont = localStorage.getItem('qs_preferred_font');
    if (savedFont) setIsAmiri(savedFont === 'amiri');

    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleEnded = () => {
      setPlayingAyah(null);
      setIsPlayingFullSurah(false);
      setCurrentTime(0);
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Theme switching globally
  const switchTheme = (theme: 'light' | 'sepia' | 'dark') => {
    setReadingTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      if (id) {
        try {
          const detail = isJuz 
            ? await fetchJuzDetail(parseInt(id)) 
            : await fetchSurahDetail(parseInt(id));
          setData(detail);
          
          const arabicData = isJuz ? null : detail.find((e: any) => e.edition.type === 'quran');
          document.title = isJuz 
            ? `Read Juz ${id} - QuranSeekho` 
            : `Surah ${arabicData?.englishName || id} - QuranSeekho Online`;
        } catch (err) {
          console.error("Failed to load content", err);
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadContent();
  }, [id, isJuz]);

  const loadTafsir = async (ayahNumber: number, surahNumber: number, ayahInSurah: number) => {
    if (tafsirData[ayahNumber]) return;
    setTafsirLoading(prev => ({ ...prev, [ayahNumber]: true }));
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahInSurah}/en.tafsir-ibn-kathir`);
      const result = await res.json();
      if (result.status === 'OK') {
        setTafsirData(prev => ({ ...prev, [ayahNumber]: result.data.text }));
      }
    } catch (err) {
      console.error("Tafsir load failed", err);
    } finally {
      setTafsirLoading(prev => ({ ...prev, [ayahNumber]: false }));
    }
  };

  useEffect(() => {
    if (loading || !data) return;
    const observerOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
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

  const toggleAyahAudio = (ayahGlobalNumber: number) => {
    if (!audioRef.current) return;
    if (playingAyah === ayahGlobalNumber) {
      audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      setIsPlayingFullSurah(false);
      audioRef.current.src = getAyahAudioUrl(ayahGlobalNumber);
      audioRef.current.play();
      setPlayingAyah(ayahGlobalNumber);
      setActiveAyah(ayahGlobalNumber);
      // Optional: scroll into view
      document.querySelector(`[data-ayah-number="${ayahGlobalNumber}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleFullSurahAudio = () => {
    if (!audioRef.current || isJuz) return;
    if (isPlayingFullSurah) {
      audioRef.current.pause();
      setIsPlayingFullSurah(false);
    } else {
      setPlayingAyah(null);
      const newSrc = getSurahAudioUrl(parseInt(id!));
      if (audioRef.current.src !== newSrc) audioRef.current.src = newSrc;
      audioRef.current.play();
      setIsPlayingFullSurah(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
    <div className={`max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 ${focusMode ? 'reading-focus' : ''}`}>
      
      {/* Surah Header & Main Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <Link to={prevLink} className={`p-3 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`} aria-label="Previous">
            <ChevronLeft size={28} />
          </Link>
          <div className="text-center">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-[0.2em] mb-2">{isJuz ? 'Sipara' : 'Surah'} {id}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
          </div>
          <Link to={nextLink} className={`p-3 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`} aria-label="Next">
            <ChevronRight size={28} />
          </Link>
        </div>

        {/* Floating Quick Action Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
          <button onClick={() => setFocusMode(!focusMode)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${focusMode ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-100'}`}>
            {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {focusMode ? 'Normal View' : 'Focus Mode'}
          </button>
          <button onClick={() => setShowEnglish(!showEnglish)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${showEnglish ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {showEnglish ? <Eye size={16} /> : <EyeOff size={16} />}
            English
          </button>
          <button onClick={() => setShowUrdu(!showUrdu)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${showUrdu ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {showUrdu ? <Eye size={16} /> : <EyeOff size={16} />}
            Urdu
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isSettingsOpen ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            <Settings size={16} /> Reading Settings
          </button>
        </div>

        {/* Audio Player Bar */}
        {!isJuz && (
          <div className="relative z-10 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border dark:border-slate-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFullSurahAudio}
                  className={`w-14 h-14 flex items-center justify-center rounded-full transition-all shadow-lg ${isPlayingFullSurah ? 'bg-green-700 text-white scale-105' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  aria-label={isPlayingFullSurah ? "Pause Surah" : "Play Surah"}
                >
                  {isPlayingFullSurah ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{isPlayingFullSurah ? 'Reciting Surah' : 'Recitation'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mishary Alafasy</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 0} 
                  step="0.1" 
                  value={currentTime} 
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                  aria-label="Seek progress"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-32">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-slate-400 hover:text-green-600 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} 
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); if(isMuted) setIsMuted(false); }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-2xl rounded-3xl p-6 z-50 w-72 space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Reading Settings</h3>
               <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={18}/></button>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Reading Theme</label>
              <div className="flex gap-2">
                {[
                  { id: 'light', color: 'bg-white border-slate-200', text: 'text-slate-900' },
                  { id: 'sepia', color: 'bg-[#f4ecd8] border-[#e2d7b5]', text: 'text-[#433422]' },
                  { id: 'dark', color: 'bg-slate-900 border-slate-800', text: 'text-white' }
                ].map((t) => (
                  <button 
                    key={t.id} 
                    onClick={() => switchTheme(t.id as any)}
                    className={`flex-1 h-12 rounded-xl border-2 transition-all ${t.color} ${readingTheme === t.id ? 'border-green-600 scale-105' : 'hover:scale-102'}`}
                  >
                    <span className={`text-[10px] font-bold uppercase ${t.text}`}>{t.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Arabic Script</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setIsAmiri(false)} className={`py-2 rounded-xl border text-xs font-bold transition-all ${!isAmiri ? 'bg-green-700 text-white border-green-700' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>Standard</button>
                <button onClick={() => setIsAmiri(true)} className={`py-2 rounded-xl border text-xs font-bold transition-all ${isAmiri ? 'bg-green-700 text-white border-green-700' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>Amiri</button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex justify-between">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </label>
              <input type="range" min="24" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 accent-green-600 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none" />
            </div>
          </div>
        )}
      </div>

      {/* Bismillah */}
      {(!isJuz || (isJuz && arabic?.ayahs[0]?.numberInSurah === 1)) && parseInt(id!) !== 9 && (
        <div className="flex justify-center py-10">
          <p className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-6xl text-center leading-[2] quran-text opacity-90`} dir="rtl" lang="ar">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs Content */}
      <div className="space-y-12 px-2 md:px-0">
        {arabic?.ayahs.map((ayah: any, index: number) => {
          const ayahNumber = ayah.number;
          const isBookmarked = bookmarks.includes(`${arabic.number}:${ayah.numberInSurah}`);
          const isActive = activeAyah === ayahNumber;
          const isAyahPlaying = playingAyah === ayahNumber;
          const hasTafsir = !!tafsirData[ayahNumber];
          const isTafsirLoading = !!tafsirLoading[ayahNumber];
          
          return (
            <div 
              key={ayahNumber} 
              data-ayah-number={ayahNumber} 
              className={`ayah-container group relative p-6 md:p-12 rounded-[2rem] transition-all duration-700 ${isActive ? 'active-ayah bg-white dark:bg-slate-800 shadow-xl shadow-green-900/5 ring-1 ring-green-600/10' : 'hover:bg-white/40 dark:hover:bg-slate-800/40'}`}
            >
              {/* Ayah Marker Sidebar (Desktop) */}
              <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-24 flex-col items-center py-10 gap-6">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${isActive ? 'bg-green-700 border-green-700 text-white scale-110' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                  {ayah.numberInSurah || ayah.number}
                </div>
                <div className={`w-0.5 flex-1 bg-gradient-to-b from-transparent ${isActive ? 'via-green-600' : 'via-slate-200 dark:via-slate-700'} to-transparent opacity-20`}></div>
              </div>

              <div className="lg:pl-16 space-y-10">
                {/* Arabic Text Block */}
                <div className="space-y-4">
                   {/* Mobile Ayah Marker */}
                   <div className="lg:hidden flex items-center gap-4 mb-4">
                     <span className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-[10px] font-bold">{ayah.numberInSurah}</span>
                     <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700"></div>
                   </div>
                   
                   <p 
                    className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-right quran-text transition-all duration-500 ${isActive || isAyahPlaying ? 'text-green-900 dark:text-green-50' : 'text-slate-800 dark:text-slate-200 opacity-90'} ${!showEnglish && !showUrdu ? 'text-center' : ''}`} 
                    style={{ fontSize: `${fontSize}px` }} 
                    dir="rtl" 
                    lang="ar"
                   >
                    {ayah.text}
                    {/* End of Ayah Ornament (simulated) */}
                    <span className="inline-flex items-center justify-center w-8 h-8 mx-4 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-400 opacity-50 font-sans tracking-tighter align-middle">
                      {ayah.numberInSurah}
                    </span>
                   </p>
                </div>

                {/* Translation & Controls Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Action Controls */}
                  <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-4 order-2 md:order-1">
                    <button 
                      onClick={() => toggleAyahAudio(ayahNumber)} 
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isAyahPlaying ? 'bg-green-700 text-white shadow-lg scale-110' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                      aria-label={isAyahPlaying ? "Pause Ayah" : "Play Ayah"}
                    >
                      {isAyahPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
                    </button>

                    <button 
                      onClick={() => toggleBookmark(ayah, arabic)} 
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isBookmarked ? 'bg-green-50 text-green-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-green-600'}`}
                    >
                      {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>

                    <button 
                      onClick={() => loadTafsir(ayahNumber, arabic.number, ayah.numberInSurah)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${hasTafsir || showTafsir ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-blue-600'}`}
                    >
                      <Book size={20} />
                    </button>
                  </div>

                  {/* Translations */}
                  <div className="md:col-span-11 space-y-6 order-1 md:order-2">
                    {showEnglish && english?.ayahs[index] && (
                      <div className="animate-in fade-in duration-500">
                        <p className={`text-lg leading-relaxed italic transition-colors duration-500 ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'}`}>
                          {english.ayahs[index].text}
                        </p>
                      </div>
                    )}
                    
                    {showUrdu && urdu?.ayahs[index] && (
                      <div className="text-right animate-in fade-in duration-500" dir="rtl">
                        <p className={`font-urdu text-4xl urdu-text transition-colors duration-500 ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'}`}>
                          {urdu.ayahs[index].text}
                        </p>
                      </div>
                    )}

                    {/* Tafsir Block */}
                    {(hasTafsir || showTafsir) && (
                      <div className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-6 md:p-8 border border-blue-100 dark:border-blue-900/30 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <Info size={16} /> Commentary • Ibn Kathir
                          </h4>
                          {!showTafsir && (
                            <button onClick={() => setTafsirData(prev => { const n = {...prev}; delete n[ayahNumber]; return n; })} className="text-blue-400 hover:text-blue-600 transition-colors">
                              <X size={18} />
                            </button>
                          )}
                        </div>
                        {isTafsirLoading ? (
                          <div className="flex items-center gap-3 text-sm text-blue-600 italic">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Fetching depth...
                          </div>
                        ) : (
                          <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
                            {tafsirData[ayahNumber]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-20 border-t dark:border-slate-800">
        <Link 
          to={prevLink} 
          className={`flex items-center gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95 ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}
        >
          <ChevronLeft size={24} />
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Previous</span>
            <span className="font-bold">Chapter {parseInt(id!) - 1}</span>
          </div>
        </Link>
        <Link 
          to={nextLink} 
          className={`flex items-center gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95 ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}
        >
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Next</span>
            <span className="font-bold">Chapter {parseInt(id!) + 1}</span>
          </div>
          <ChevronRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default SurahReader;
