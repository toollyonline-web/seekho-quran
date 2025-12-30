
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Settings, Bookmark, BookmarkCheck, Type, Book, 
  X, Play, Pause, Volume2, VolumeX, Eye, EyeOff, Maximize2, Minimize2,
  Sliders, Layout as LayoutIcon, Sun, Moon, Share2, Info, Coffee
} from 'lucide-react';
import { translations, Language } from '../services/i18n';

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
  
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];
  const isRTL = currentLang === 'ur' || currentLang === 'ar';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      if (id) {
        try {
          const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
          setData(detail);
          
          // Save Last Read (Resume Reading Feature)
          if (!isJuz && detail && detail[0]) {
            localStorage.setItem('qs_last_read', JSON.stringify({
              id: id,
              name: detail[0].englishName,
              ayah: 1, // Start of surah
              timestamp: Date.now()
            }));
          }
        } catch (err) { console.error(err); }
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadContent();
  }, [id, isJuz]);

  const incrementReadingProgress = () => {
    const today = new Date().toDateString();
    const progressDate = localStorage.getItem('qs_reading_date');
    let count = 0;
    
    if (progressDate === today) {
      count = parseInt(localStorage.getItem('qs_reading_progress') || '0');
    } else {
      localStorage.setItem('qs_reading_date', today);
    }
    
    const newCount = count + 1;
    localStorage.setItem('qs_reading_progress', newCount.toString());
  };

  const loadTafsir = async (ayahNumber: number, surahNumber: number, ayahInSurah: number) => {
    if (tafsirData[ayahNumber]) return;
    setTafsirLoading(prev => ({ ...prev, [ayahNumber]: true }));
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahInSurah}/en.tafsir-ibn-kathir`);
      const result = await res.json();
      if (result.status === 'OK') setTafsirData(prev => ({ ...prev, [ayahNumber]: result.data.text }));
    } catch (err) { console.error(err); } finally {
      setTafsirLoading(prev => ({ ...prev, [ayahNumber]: false }));
    }
  };

  const toggleAyahAudio = (ayahGlobalNumber: number, ayahInSurah: number) => {
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
      
      // Update Resume Reading with exact ayah
      if (!isJuz && data && data[0]) {
         localStorage.setItem('qs_last_read', JSON.stringify({
           id: id,
           name: data[0].englishName,
           ayah: ayahInSurah,
           timestamp: Date.now()
         }));
      }

      // Track Reading Progress
      incrementReadingProgress();

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

  const switchTheme = (theme: 'light' | 'sepia' | 'dark') => {
    setReadingTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme !== 'light') document.documentElement.classList.add(theme);
    window.dispatchEvent(new Event('storage'));
  };

  const toggleBookmark = (ayah: any, surahInfo: any) => {
    const bookmarkKey = `${surahInfo.number}:${ayah.numberInSurah}`;
    const saved = localStorage.getItem('qs_bookmarks');
    let currentBookmarks = saved ? JSON.parse(saved) : [];
    if (bookmarks.includes(bookmarkKey)) {
      currentBookmarks = currentBookmarks.filter((b: any) => `${b.surahNumber}:${b.ayahNumber}` !== bookmarkKey);
      setBookmarks(bookmarks.filter(k => k !== bookmarkKey));
    } else {
      currentBookmarks.push({ surahNumber: surahInfo.number, surahName: surahInfo.englishName, ayahNumber: ayah.numberInSurah, text: ayah.text, timestamp: Date.now() });
      setBookmarks([...bookmarks, bookmarkKey]);
    }
    localStorage.setItem('qs_bookmarks', JSON.stringify(currentBookmarks));
  };

  const handleShare = async (ayah: any, surahName: string) => {
    const text = `${ayah.text}\n\n"${ayah.translations?.en || ''}"\n\n— Quran [${surahName} ${ayah.numberInSurah}]\nShared via QuranSeekho.online`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Ayah from ${surahName}`, text, url: window.location.href });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(text);
      alert('Ayah text copied!');
    }
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
  const subtitle = isJuz ? `${t.nav.calendar} ${id}` : `${arabic?.englishNameTranslation} • ${arabic?.revelationType}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20 ${focusMode ? 'focus-mode-active' : ''}`}>
      
      {/* Settings Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-80 h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white"><Sliders size={20} className="text-green-600" /> {t.reader.settings}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full dark:text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.reader.focusMode}</label>
                <button onClick={() => setFocusMode(!focusMode)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${focusMode ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}>
                  <div className="flex items-center gap-3"><Maximize2 size={18} /><span className="font-bold text-sm">{t.reader.focusMode}</span></div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${focusMode ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${focusMode ? 'ltr:right-0.5 rtl:left-0.5' : 'ltr:left-0.5 rtl:right-0.5'}`}></div>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.reader.theme}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'light',icon:<Sun size={14}/>,bg:'bg-white'},{id:'sepia',icon:<Coffee size={14}/>,bg:'bg-[#fdf6e3]'},{id:'dark',icon:<Moon size={14}/>,bg:'bg-slate-900'}].map((th) => (
                    <button key={th.id} onClick={() => switchTheme(th.id as any)} className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${th.bg} ${readingTheme === th.id ? 'border-green-600 scale-105' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className="mb-1 text-green-600">{th.icon}</span>
                      <span className={`text-[10px] font-bold uppercase ${th.id === 'dark' ? 'text-white' : 'text-slate-900'}`}>{th.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.reader.fontSize}</label>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs"><span className="font-bold dark:text-white">{t.reader.fontSize}</span><span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono dark:text-white">{fontSize}px</span></div>
                  <input type="range" min="20" max="72" value={fontSize} onChange={(e) => { const s = parseInt(e.target.value); setFontSize(s); localStorage.setItem('qs_font_size', s.toString()); }} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none accent-green-600" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.reader.layers}</label>
                <div className="space-y-2">
                  {[
                    { label: 'English', state: showEnglish, set: setShowEnglish },
                    { label: 'Urdu', state: showUrdu, set: setShowUrdu },
                    { label: t.reader.tafsir, state: showTafsir, set: setShowTafsir }
                  ].map((layer) => (
                    <button key={layer.label} onClick={() => layer.set(!layer.state)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${layer.state ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 dark:text-white' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 opacity-60 dark:text-slate-400'}`}>
                      <span className="text-sm font-bold">{layer.label}</span>
                      {layer.state ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-14 border dark:border-slate-700 shadow-sm relative overflow-hidden transition-all text-center">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <Link to={prevLink} className={`p-4 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 transition-all dark:text-white ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`} aria-label="Previous">
            {isRTL ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
          </Link>
          <div className="text-center">
            <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-[0.4em] mb-3 block">{isJuz ? 'Sipara' : 'Surah'}</span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight dark:text-white">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
          <Link to={nextLink} className={`p-4 rounded-2xl hover:bg-green-50 dark:hover:bg-slate-700 transition-all dark:text-white ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`} aria-label="Next">
            {isRTL ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
          <button onClick={toggleFullSurahAudio} className="flex items-center gap-3 px-8 py-4 bg-green-700 text-white rounded-full font-bold shadow-xl shadow-green-900/20 hover:scale-105 transition-all">
            {isPlayingFullSurah ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ltr:ml-0.5 rtl:mr-0.5" fill="currentColor" />}
            {isPlayingFullSurah ? t.reader.pause : t.reader.playRecitation}
          </button>
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-full font-bold hover:bg-green-100 transition-all">
            <Sliders size={20} /> {t.reader.settings}
          </button>
        </div>
      </div>

      <div className="space-y-16 px-4 md:px-0">
        {arabic?.ayahs.map((ayah: any, index: number) => {
          const isBookmarked = bookmarks.includes(`${arabic.number}:${ayah.numberInSurah}`);
          const isActive = activeAyah === ayah.number;
          const isAyahPlaying = playingAyah === ayah.number;
          
          return (
            <div key={ayah.number} data-ayah-number={ayah.number} className={`ayah-container group relative p-8 md:p-14 rounded-[3rem] transition-all duration-700 ${isActive ? 'active-ayah bg-white dark:bg-slate-800 shadow-xl' : 'hover:bg-white/40 dark:hover:bg-slate-800/40'}`}>
              <div className="space-y-12">
                <p className={`${isAmiri ? 'font-arabic-amiri' : 'font-arabic'} text-right quran-text transition-all duration-700 ${isActive || isAyahPlaying ? 'text-green-950 dark:text-white' : 'text-slate-800 dark:text-slate-200 opacity-90'}`} style={{ fontSize: `${fontSize}px` }} dir="rtl" lang="ar">
                  {ayah.text}
                  <span className="inline-flex items-center justify-center w-10 h-10 mx-6 text-[10px] font-black text-slate-400 group-hover:text-green-600 transition-colors align-middle font-sans border-2 border-slate-100 dark:border-slate-700 rounded-full">{ayah.numberInSurah}</span>
                </p>

                {!focusMode && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                    <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-3">
                      <button onClick={() => toggleAyahAudio(ayah.number, ayah.numberInSurah)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isAyahPlaying ? 'bg-green-700 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-green-600'}`}>
                        {isAyahPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                      <button onClick={() => toggleBookmark(ayah, arabic)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isBookmarked ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                        {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                      <button onClick={() => handleShare(ayah, arabic.englishName)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-blue-600 transition-all"><Share2 size={18} /></button>
                      <button onClick={() => loadTafsir(ayah.number, arabic.number, ayah.numberInSurah)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${tafsirData[ayah.number] ? 'bg-blue-50 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}><Book size={18} /></button>
                    </div>

                    <div className="md:col-span-11 space-y-8">
                      {showEnglish && english?.ayahs[index] && <p className={`text-xl leading-relaxed italic transition-colors duration-700 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`}>{english.ayahs[index].text}</p>}
                      {showUrdu && urdu?.ayahs[index] && <p className={`font-urdu text-4xl text-right leading-[2.5] transition-colors duration-700 ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`} dir="rtl">{urdu.ayahs[index].text}</p>}
                      {tafsirData[ayah.number] && (
                        <div className="bg-blue-50/40 dark:bg-blue-900/10 rounded-[2rem] p-8 border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-top-4 duration-500">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-4"><Info size={14} /> {t.reader.tafsir}</h4>
                           <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{tafsirData[ayah.number]}</p>
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

      <div className="flex justify-between items-center pt-24 border-t dark:border-slate-800">
        <Link to={prevLink} className={`flex items-center gap-6 p-6 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 dark:text-white ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
          {isRTL ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.reader.previous}</span>
            <span className="text-xl font-bold">Chapter {parseInt(id!) - 1}</span>
          </div>
        </Link>
        <Link to={nextLink} className={`flex items-center gap-6 p-6 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm transition-all hover:scale-105 dark:text-white ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t.reader.next}</span>
            <span className="text-xl font-bold">Chapter {parseInt(id!) + 1}</span>
          </div>
          {isRTL ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
        </Link>
      </div>
    </div>
  );
};

export default SurahReader;
