
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Book, 
  X, Play, Pause, Eye, EyeOff, Maximize2,
  Sliders, Sun, Moon, Share2, Info, Coffee, Loader2, Quote
} from 'lucide-react';
import { translations, Language } from '../services/i18n';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isJuz = location.pathname.includes('/juz/');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];
  const isRTL = currentLang === 'ur' || currentLang === 'ar';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('qs_bookmarks');
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks).map((b: any) => `${b.surahNumber}:${b.ayahNumber}`));
      
      const savedTheme = localStorage.getItem('theme') as any;
      if (savedTheme) setReadingTheme(savedTheme);

      const savedSize = localStorage.getItem('qs_font_size');
      if (savedSize) setFontSize(parseInt(savedSize));
    } catch (e) { console.warn("Preferences load failed", e); }

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const handleEvents = {
      ended: () => { setPlayingAyah(null); setIsPlayingFullSurah(false); setIsAudioLoading(false); },
      waiting: () => setIsAudioLoading(true),
      playing: () => setIsAudioLoading(false),
      error: () => { setIsAudioLoading(false); setPlayingAyah(null); setIsPlayingFullSurah(false); }
    };

    Object.entries(handleEvents).forEach(([ev, fn]) => audio.addEventListener(ev, fn));
    
    return () => {
      audio.pause();
      Object.entries(handleEvents).forEach(([ev, fn]) => audio.removeEventListener(ev, fn));
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
        if (!detail) throw new Error("No data returned from API");
        setData(detail);
        
        if (!isJuz && detail[0]) {
          localStorage.setItem('qs_last_read', JSON.stringify({
            id: id,
            name: detail[0].englishName,
            ayah: 1,
            timestamp: Date.now()
          }));
        }
      } catch (err) { 
        console.error("Reader load error:", err); 
        setError("Failed to load content. Please check your connection.");
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadContent();
  }, [id, isJuz]);

  const safePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (playPromiseRef.current !== null) await playPromiseRef.current;
      setIsAudioLoading(true);
      playPromiseRef.current = audioRef.current.play();
      await playPromiseRef.current;
      playPromiseRef.current = null;
    } catch (err) {
      console.warn("Playback interrupted:", err);
      setIsAudioLoading(false);
      playPromiseRef.current = null;
    }
  };

  const toggleAyahAudio = async (ayahGlobalNumber: number, ayahInSurah: number) => {
    if (!audioRef.current) return;
    if (playingAyah === ayahGlobalNumber) {
      audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      setIsPlayingFullSurah(false);
      audioRef.current.pause();
      audioRef.current.src = getAyahAudioUrl(ayahGlobalNumber);
      audioRef.current.load();
      safePlay();
      setPlayingAyah(ayahGlobalNumber);
      setActiveAyah(ayahGlobalNumber);
      document.querySelector(`[data-ayah-number="${ayahGlobalNumber}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleFullSurahAudio = async () => {
    if (!audioRef.current || isJuz) return;
    if (isPlayingFullSurah) {
      audioRef.current.pause();
      setIsPlayingFullSurah(false);
    } else {
      setPlayingAyah(null);
      const newSrc = getSurahAudioUrl(parseInt(id!));
      if (audioRef.current.src !== newSrc) {
        audioRef.current.pause();
        audioRef.current.src = newSrc;
        audioRef.current.load();
      }
      safePlay();
      setIsPlayingFullSurah(true);
    }
  };

  const switchTheme = (theme: 'light' | 'sepia' | 'dark') => {
    setReadingTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme !== 'light') document.documentElement.classList.add(theme);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 page-transition">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Opening the Sacred Text...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4 page-transition">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-4">
        <X size={40} />
      </div>
      <h2 className="text-2xl font-black">{error}</h2>
      <button onClick={() => window.location.reload()} className="px-8 py-4 bg-green-700 text-white rounded-2xl font-bold shadow-lg">Try Again</button>
    </div>
  );

  let arabic: any, english: any, urdu: any;
  try {
    arabic = data.find((e: any) => e.edition.identifier === 'quran-uthmani' || e.edition.type === 'quran');
    english = data.find((e: any) => e.edition.language === 'en');
    urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');
  } catch (e) {
    return <div className="text-center py-20">Formatting error. Please refresh.</div>;
  }

  const title = isJuz ? `Juz ${id}` : arabic?.englishName || "Surah";
  const subtitle = isJuz ? `Part ${id}` : `${arabic?.englishNameTranslation || ''} • ${arabic?.revelationType || ''}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 md:px-8 page-transition">
      
      {/* Settings Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-80 h-full glass shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b dark:border-white/10 flex items-center justify-between">
              <h2 className="font-black text-xl flex items-center gap-2 dark:text-white"><Sliders size={20} className="text-green-600" /> {t.reader.settings}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full dark:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Reading Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'sepia', 'dark'].map((th) => (
                      <button key={th} onClick={() => switchTheme(th as any)} className={`h-16 rounded-2xl border-2 flex items-center justify-center ${th === 'light' ? 'bg-white' : th === 'sepia' ? 'bg-[#fdf6e3]' : 'bg-slate-900'} ${readingTheme === th ? 'border-green-600 scale-105 shadow-lg' : 'border-transparent'}`}>
                        {th === 'light' ? <Sun size={18} className="text-slate-900" /> : th === 'sepia' ? <Coffee size={18} className="text-[#5d4037]" /> : <Moon size={18} className="text-white" />}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Arabic Font Size</label>
                  <input type="range" min="20" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-green-600" />
                  <p className="text-right font-mono text-xs text-slate-400">{fontSize}px</p>
               </div>
               <div className="space-y-2">
                 {[
                   { id: 'en', label: 'English translation', state: showEnglish, set: setShowEnglish },
                   { id: 'ur', label: 'Urdu translation', state: showUrdu, set: setShowUrdu }
                 ].map(l => (
                    <button key={l.id} onClick={() => l.set(!l.state)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${l.state ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                       <span className="font-bold text-sm">{l.label}</span>
                       {l.state ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 md:p-16 border dark:border-slate-700 shadow-xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
           <Quote size={200} />
        </div>
        <div className="relative z-10 space-y-8">
           <div className="flex items-center justify-center gap-10">
              <Link to={prevLink} className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-green-600 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
                 <ChevronLeft size={32} />
              </Link>
              <div>
                <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-[0.5em] mb-4 block">Section {id}</span>
                <h1 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm mt-4">{subtitle}</p>
              </div>
              <Link to={nextLink} className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-green-600 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
                 <ChevronRight size={32} />
              </Link>
           </div>
           
           <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button disabled={isAudioLoading} onClick={toggleFullSurahAudio} className="flex items-center gap-3 px-10 py-5 bg-green-700 text-white rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                 {isAudioLoading && isPlayingFullSurah ? <Loader2 className="animate-spin" /> : isPlayingFullSurah ? <Pause /> : <Play fill="currentColor" />}
                 {isPlayingFullSurah ? 'Pause Audio' : 'Play Full Surah'}
              </button>
              <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-3 px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-full font-black hover:bg-green-100 transition-all">
                 <Sliders /> Settings
              </button>
           </div>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-12">
        {arabic?.ayahs?.map((ayah: any, index: number) => {
          const isActive = activeAyah === ayah.number;
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} data-ayah-number={ayah.number} className={`group p-8 md:p-14 rounded-[3.5rem] transition-all duration-700 ${isActive ? 'bg-white dark:bg-slate-800 shadow-2xl scale-[1.02]' : 'hover:bg-white/30 dark:hover:bg-slate-800/30'}`}>
              <div className="space-y-12">
                 <p className="font-arabic text-right quran-text transition-all duration-700 dark:text-white" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                    {ayah.text}
                    <span className="inline-flex items-center justify-center w-12 h-12 mx-6 text-xs font-black text-slate-400 border-2 border-slate-100 dark:border-slate-700 rounded-full align-middle font-sans">{ayah.numberInSurah}</span>
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-1 flex md:flex-col items-center gap-4">
                       <button onClick={() => toggleAyahAudio(ayah.number, ayah.numberInSurah)} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${isPlaying ? 'bg-green-700 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-green-600'}`}>
                          {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause /> : <Play fill="currentColor" />}
                       </button>
                       <button onClick={() => {}} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400"><Bookmark /></button>
                       <button onClick={() => {}} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400"><Share2 /></button>
                    </div>
                    <div className="md:col-span-11 space-y-8">
                       {showEnglish && english?.ayahs[index] && <p className="text-xl text-slate-500 dark:text-slate-400 italic leading-relaxed">"{english.ayahs[index].text}"</p>}
                       {showUrdu && urdu?.ayahs[index] && <p className="font-urdu text-4xl text-right text-slate-800 dark:text-slate-200 leading-[2.5]" dir="rtl">{urdu.ayahs[index].text}</p>}
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-between items-center pt-20">
         <Link to={prevLink} className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm flex items-center gap-6 hover:scale-105 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
            <ChevronLeft size={24} /> <span className="font-bold text-sm hidden sm:inline">Previous Section</span>
         </Link>
         <Link to={nextLink} className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm flex items-center gap-6 hover:scale-105 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
            <span className="font-bold text-sm hidden sm:inline">Next Section</span> <ChevronRight size={24} />
         </Link>
      </div>
    </div>
  );
};

export default SurahReader;
