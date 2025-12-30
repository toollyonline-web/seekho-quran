
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Settings, Bookmark, BookmarkCheck, Type, Book, 
  Info, X, Play, Pause, Volume2, VolumeX, Eye, EyeOff, Maximize2, Minimize2,
  MoreVertical, Sliders, Layout as LayoutIcon, Monitor, Coffee, Sun, Moon, Share2
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
  const [fontSize, setFontSize] = useState(36);
  const [isAmiri, setIsAmiri] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    const savedBookmarks = localStorage.getItem('qs_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks).map((b: any) => `${b.surahNumber}:${b.ayahNumber}`));
    
    const savedTheme = localStorage.getItem('theme') as any;
    if (savedTheme) setReadingTheme(savedTheme);

    const savedFont = localStorage.getItem('qs_preferred_font');
    if (savedFont) setIsAmiri(savedFont === 'amiri');

    const savedSize = localStorage.getItem('qs_font_size');
    if (savedSize) setFontSize(parseInt(savedSize));

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

  const handleShare = async (ayah: any, surahName: string) => {
    const text = `${ayah.text}\n\n"${ayah.translations?.en || ''}"\n\n— Quran [${surahName} ${ayah.numberInSurah}]\nShared via QuranSeekho.online`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran Ayah from ${surahName}`,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Ayah text copied to clipboard!');
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (focusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }
  }, [focusMode]);

  const switchTheme = (theme: 'light' | 'sepia' | 'dark') => {
    setReadingTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
    window.dispatchEvent(new Event('storage'));
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
          
          const pageTitle = isJuz 
            ? `Sipara ${id} – Quran Reading Online | Quran Seekho` 
            : `Surah ${arabicData?.englishName || id} – Read Quran Online | Quran Seekho`;
          const pageDesc = isJuz 
            ? `Read and study Juz (Sipara) ${id} of the Holy Quran. Complete with English and Urdu translations and beautiful recitation.` 
            : `Read Surah ${arabicData?.englishName} (${arabicData?.name}) online. Explore its English and Urdu translations, listen to audio recitation by Mishary Alafasy.`;

          document.title = pageTitle;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', pageDesc);

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
    const observerOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
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

  const title = isJuz ? `Sipara ${id}` : arabic?.englishName;
  const subtitle = isJuz ? `Juz ${id} • Quran Reading Online` : `${arabic?.englishNameTranslation} • ${arabic?.revelationType}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20 ${focusMode ? 'focus-mode-active' : ''}`}>
      
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-80 h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white"><Sliders size={20} className="text-green-600" /> Reader Settings</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full dark:text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">Display Mode</label>
                <div className="grid grid-cols-1 gap-2">
                   <button onClick={() => setFocusMode(!focusMode)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${focusMode ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}>
                     <div className="flex items-center gap-3">
                       <Maximize2 size={18} />
                       <span className="font-bold text-sm">Focus Mode</span>
                     </div>
                     <div className={`w-8 h-4 rounded-full relative transition-colors ${focusMode ? 'bg-green-500' : 'bg-slate-300'}`}>
                       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${focusMode ? 'right-0.5' : 'left-0.5'}`}></div>
                     </div>
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">Reading Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', icon: <Sun size={14} />, bg: 'bg-white' },
                    { id: 'sepia', icon: <Coffee size={14} />, bg: 'bg-[#fdf6e3]' },
                    { id: 'dark', icon: <Moon size={14} />, bg: 'bg-slate-900' }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => switchTheme(t.id as any)}
                      className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${t.bg} ${readingTheme === t.id ? 'border-green-600 scale-105' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <span className="mb-1 text-green-600">{t.icon}</span>
                      <span className={`text-[10px] font-bold uppercase ${t.id === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">Typography</label>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold dark:text-white">Font Size</span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono dark:text-white">{fontSize}px</span>
                    </div>
                    <input type="range" min="20" max="72" value={fontSize} onChange={(e) => {
                      const size = parseInt(e.target.value);
                      setFontSize(size);
                      localStorage.setItem('qs_font_size', size.toString());
                    }} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none accent-green-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => {setIsAmiri(false); localStorage.setItem('qs_preferred_font', 'standard');}} className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${!isAmiri ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}>Standard</button>
                    <button onClick={() => {setIsAmiri(true); localStorage.setItem('qs_preferred_font', 'amiri');}} className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${isAmiri ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}>Amiri</button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">Content Layers</label>
                <div className="space-y-2">
                  {[
                    { label: 'English Translation', state: showEnglish, set: setShowEnglish },
                    { label: 'Urdu Translation', state: showUrdu, set: setShowUrdu },
                    { label: 'Show Ibn Kathir Tafsir', state: showTafsir, set: setShowTafsir }
                  ].map((layer) => (
                    <button 
                      key={layer.label}
                      onClick={() => layer.set(!layer.state)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${layer.state ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 dark:text-white' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 opacity-60 dark:text-slate-400'}`}
                    >
                      <span className="text-sm font-bold">{layer.label}</span>
                      {layer.state ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t dark:border-slate-700 text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quran Seekho Reader</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-14 border dark:border-slate-700 shadow-sm relative overflow-hidden transition-all group main-layout-header">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <Link to={prevLink} className={`p-4 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 transition-all dark:text-white ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`} aria-label="Previous Page">
            <ChevronLeft size={32} />
          </Link>
          <div className="text-center">
            <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-[0.4em] mb-3 block">{isJuz ? 'Holy Quran Sipara' : 'Noble Quran Chapter'}</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight dark:text-white">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{subtitle}</p>
          </div>
          <Link to={nextLink} className={`p-4 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 transition-all dark:text-white ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`} aria-label="Next Page">
            <ChevronRight size={32} />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
          <button onClick={toggleFullSurahAudio} className="flex items-center gap-3 px-8 py-4 bg-green-700 text-white rounded-full font-bold shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all">
            {isPlayingFullSurah ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
            {isPlayingFullSurah ? 'Pause' : 'Play Recitation'}
          </button>
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-full font-bold hover:bg-green-100 dark:hover:bg-slate-600 transition-all">
            <Sliders size={20} /> Settings
          </button>
        </div>

        {isPlayingFullSurah && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-900/50 overflow-hidden">
             <div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
        )}
      </div>

      {(!isJuz || (isJuz && arabic?.ayahs[0]?.numberInSurah === 1)) && parseInt(id!) !== 9 && (
        <div className="flex justify-center py-10">
          <p className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-6xl text-center leading-[2] quran-text opacity-90 dark:text-white`} dir="rtl" lang="ar">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      <div className="space-y-16 px-4 md:px-0">
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
              className={`ayah-container group relative p-8 md:p-14 rounded-[3rem] transition-all duration-700 ${isActive ? 'active-ayah bg-white dark:bg-slate-800 shadow-xl ring-1 ring-green-600/5' : 'hover:bg-white/40 dark:hover:bg-slate-800/40'}`}
            >
              <div className="space-y-12">
                <div className="relative">
                   <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-20px] group-hover:translate-x-0">
                      <button 
                        onClick={() => toggleAyahAudio(ayahNumber)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isAyahPlaying ? 'bg-green-700 text-white' : 'bg-white dark:bg-slate-700 shadow-lg text-slate-400 hover:text-green-600'}`}
                      >
                        {isAyahPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
                      </button>
                   </div>
                   
                   <p 
                    className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-right quran-text transition-all duration-700 ${isActive || isAyahPlaying ? 'text-green-950 dark:text-white' : 'text-slate-800 dark:text-slate-200 opacity-90'} ${focusMode ? 'text-center' : ''}`} 
                    style={{ fontSize: `${fontSize}px` }} 
                    dir="rtl" 
                    lang="ar"
                   >
                    {ayah.text}
                    <span className="inline-flex items-center justify-center w-10 h-10 mx-6 ayah-number-badge text-[10px] font-bold text-slate-400 group-hover:text-green-600 transition-colors align-middle font-sans">
                      {ayah.numberInSurah}
                    </span>
                   </p>
                </div>

                {!focusMode && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                    <div className="md:col-span-1 flex md:flex-row md:flex-col items-center justify-center gap-3">
                      <button onClick={() => toggleAyahAudio(ayahNumber)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isAyahPlaying ? 'bg-green-700 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-green-50 hover:text-green-600'}`}>
                        {isAyahPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                      <button onClick={() => toggleBookmark(ayah, arabic)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isBookmarked ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                      <button onClick={() => handleShare(ayah, arabic.englishName)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Share2 size={18} />
                      </button>
                      <button onClick={() => loadTafsir(ayahNumber, arabic.number, ayah.numberInSurah)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${hasTafsir || showTafsir ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                        <Book size={18} />
                      </button>
                    </div>

                    <div className="md:col-span-11 space-y-8">
                      {showEnglish && english?.ayahs[index] && (
                        <p className={`text-xl leading-relaxed italic transition-colors duration-700 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`}>
                          {english.ayahs[index].text}
                        </p>
                      )}
                      
                      {showUrdu && urdu?.ayahs[index] && (
                        <p className={`font-urdu text-4xl text-right leading-[2.5] transition-colors duration-700 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`} dir="rtl">
                          {urdu.ayahs[index].text}
                        </p>
                      )}

                      {(hasTafsir || showTafsir) && (
                        <div className="bg-blue-50/40 dark:bg-blue-900/10 rounded-[2rem] p-8 border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-top-4 duration-500">
                           <div className="flex items-center justify-between mb-6">
                              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 flex items-center gap-2"><Info size={14} /> Ibn Kathir Commentary</h4>
                              <button onClick={() => setTafsirData(prev => { const n = {...prev}; delete n[ayahNumber]; return n; })} className="text-blue-300 hover:text-blue-500"><X size={16} /></button>
                           </div>
                           {isTafsirLoading ? (
                              <div className="flex items-center gap-3 text-sm text-blue-500 animate-pulse"><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>Reading history...</div>
                           ) : (
                              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{tafsirData[ayahNumber]}</p>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-24 border-t dark:border-slate-800 main-layout-footer">
        <Link to={prevLink} className={`flex items-center gap-6 p-6 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 dark:text-white ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
          <ChevronLeft size={32} />
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Previous</span>
            <span className="text-xl font-bold">Chapter {parseInt(id!) - 1}</span>
          </div>
        </Link>
        <Link to={nextLink} className={`flex items-center gap-6 p-6 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 dark:text-white ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Next</span>
            <span className="text-xl font-bold">Chapter {parseInt(id!) + 1}</span>
          </div>
          <ChevronRight size={32} />
        </Link>
      </div>
    </div>
  );
};

export default SurahReader;
