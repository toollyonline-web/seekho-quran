
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Bookmark, X, Play, Pause, Eye, EyeOff, 
  Sliders, Sun, Moon, Share2, Coffee, Loader2, Quote, PlayCircle
} from 'lucide-react';
import { translations, Language } from '../services/i18n';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isJuz = location.pathname.includes('/juz/');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(42);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    // Initial audio setup
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onEnded = () => { 
        setPlayingAyah(null); 
        setIsPlayingFullSurah(false); 
        setIsAudioLoading(false); 
    };
    const onWaiting = () => setIsAudioLoading(true);
    const onPlaying = () => setIsAudioLoading(false);
    const onError = () => { setIsAudioLoading(false); setPlayingAyah(null); setIsPlayingFullSurah(false); };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);
    
    return () => {
      audio.pause();
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
        if (!detail) throw new Error("API content missing");
        setData(detail);
        
        // Save progression
        if (!isJuz && detail[0]) {
          localStorage.setItem('qs_last_read', JSON.stringify({
            id: id,
            name: detail[0].englishName,
            ayah: 1,
            timestamp: Date.now()
          }));
        }
      } catch (err) { 
        console.error("Reader Error:", err); 
        setError("Network sync failed. Please check your connection.");
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadContent();
  }, [id, isJuz]);

  const toggleAyahAudio = async (ayahGlobalNumber: number) => {
    if (!audioRef.current) return;
    if (playingAyah === ayahGlobalNumber) {
      audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      setIsPlayingFullSurah(false);
      audioRef.current.pause();
      audioRef.current.src = getAyahAudioUrl(ayahGlobalNumber);
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setPlayingAyah(ayahGlobalNumber);
        setActiveAyah(ayahGlobalNumber);
      } catch (e) { console.error("Audio blocked", e); }
    }
  };

  const toggleFullSurahAudio = async () => {
    if (!audioRef.current || isJuz) return;
    if (isPlayingFullSurah) {
      audioRef.current.pause();
      setIsPlayingFullSurah(false);
    } else {
      setPlayingAyah(null);
      audioRef.current.src = getSurahAudioUrl(parseInt(id!));
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setIsPlayingFullSurah(true);
      } catch (e) { console.error("Audio blocked", e); }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
      <div className="w-16 h-16 border-[5px] border-emerald-800/20 border-t-emerald-800 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Sacred Text...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-20 h-20 bg-rose-100 text-rose-700 rounded-3xl flex items-center justify-center mb-4">
        <X size={40} />
      </div>
      <h2 className="text-2xl font-black">{error}</h2>
      <button onClick={() => window.location.reload()} className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg">Retry Connection</button>
    </div>
  );

  const arabic = data.find((e: any) => e.edition.type === 'quran' || e.edition.identifier === 'quran-uthmani');
  const english = data.find((e: any) => e.edition.language === 'en');
  const urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');

  const title = isJuz ? `Juz ${id}` : arabic?.englishName || "Revelation";
  const subtitle = isJuz ? `Sacred Part ${id}` : `${arabic?.englishNameTranslation || ''} • ${arabic?.revelationType || ''}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4 md:px-10 page-transition">
      
      {/* Settings Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b dark:border-white/5 flex items-center justify-between">
              <h2 className="font-black text-2xl flex items-center gap-3 dark:text-white tracking-tighter">
                <Sliders size={24} className="text-emerald-800" /> {t.reader.settings}
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Environment Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'sepia', 'dark'].map((th) => (
                      <button key={th} onClick={() => setReadingTheme(th as any)} className={`h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${th === 'light' ? 'bg-white' : th === 'sepia' ? 'bg-[#fdf6e3]' : 'bg-slate-950'} ${readingTheme === th ? 'border-emerald-700 shadow-xl' : 'border-transparent'}`}>
                        {th === 'light' ? <Sun size={20} className="text-slate-900" /> : th === 'sepia' ? <Coffee size={20} className="text-[#5d4037]" /> : <Moon size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Arabic Text Size</label>
                  <input type="range" min="30" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-emerald-800" />
                  <p className="text-right font-mono text-xs text-slate-400">{fontSize}px</p>
               </div>
               <div className="space-y-3">
                 {[
                   { id: 'en', label: 'English Meaning', state: showEnglish, set: setShowEnglish },
                   { id: 'ur', label: 'Urdu Translation', state: showUrdu, set: setShowUrdu }
                 ].map(l => (
                    <button key={l.id} onClick={() => l.set(!l.state)} className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all ${l.state ? 'bg-emerald-800 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                       <span className="font-bold">{l.label}</span>
                       {l.state ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-20 border dark:border-white/5 shadow-2xl relative overflow-hidden text-center group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <Quote size={240} />
        </div>
        <div className="relative z-10 space-y-8">
           <div className="flex items-center justify-center gap-12">
              <Link to={prevLink} className={`p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-emerald-800 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible shadow-sm'}`}>
                 <ChevronLeft size={36} />
              </Link>
              <div>
                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-500 uppercase tracking-[0.5em] mb-4 block">Quranic Section {id}</span>
                <h1 className="text-5xl md:text-8xl font-black dark:text-white tracking-tighter leading-none">{title}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mt-6">{subtitle}</p>
              </div>
              <Link to={nextLink} className={`p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-emerald-800 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible shadow-sm'}`}>
                 <ChevronRight size={36} />
              </Link>
           </div>
           
           <div className="flex flex-wrap justify-center gap-4 pt-10">
              <button disabled={isAudioLoading} onClick={toggleFullSurahAudio} className="flex items-center gap-4 px-12 py-5 bg-emerald-800 text-white rounded-full font-black shadow-[0_20px_40px_rgba(6,78,59,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group">
                 {isAudioLoading && isPlayingFullSurah ? <Loader2 className="animate-spin" /> : isPlayingFullSurah ? <Pause /> : <Play fill="currentColor" />}
                 <span className="text-[10px] uppercase tracking-widest">{isPlayingFullSurah ? 'Pause Full Audio' : 'Play Full Audio'}</span>
              </button>
              <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-4 px-12 py-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-full font-black hover:bg-emerald-800 hover:text-white transition-all text-[10px] uppercase tracking-widest">
                 <Sliders size={20} /> View Settings
              </button>
           </div>
        </div>
      </div>

      {/* Verses Render */}
      <div className={`space-y-16 ${readingTheme === 'sepia' ? 'bg-[#fdf6e3]/50 p-10 rounded-[3rem]' : ''}`}>
        {arabic?.ayahs?.map((ayah: any, index: number) => {
          const isActive = activeAyah === ayah.number;
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} data-ayah-number={ayah.number} className={`group p-8 md:p-16 rounded-[4rem] transition-all duration-700 ${isActive ? 'bg-white dark:bg-slate-900 shadow-2xl scale-[1.03] border dark:border-white/5' : 'hover:bg-white/50 dark:hover:bg-slate-900/30'}`}>
              <div className="space-y-12">
                 <div className="flex justify-between items-start gap-10">
                    <div className="flex md:flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${isPlaying ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-800'}`}>
                            {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause /> : <Play fill="currentColor" size={20} />}
                        </button>
                        <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-800"><Bookmark size={20} /></button>
                    </div>
                    <p className="font-arabic text-right quran-text transition-all duration-700 dark:text-white flex-grow" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                        {ayah.text}
                        <span className="inline-flex items-center justify-center w-14 h-14 mx-8 text-xs font-black text-slate-400 border-2 border-slate-100 dark:border-slate-800 rounded-full align-middle font-sans">
                            {ayah.numberInSurah}
                        </span>
                    </p>
                 </div>

                 <div className="max-w-4xl ltr:ml-20 rtl:mr-20 space-y-8">
                    {showEnglish && english?.ayahs[index] && (
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 italic leading-relaxed font-medium">
                            "{english.ayahs[index].text}"
                        </p>
                    )}
                    {showUrdu && urdu?.ayahs[index] && (
                        <p className="font-urdu text-4xl text-right text-slate-800 dark:text-slate-200 leading-[2.4] py-4" dir="rtl">
                            {urdu.ayahs[index].text}
                        </p>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-24">
         <Link to={prevLink} className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border dark:border-white/5 shadow-xl flex items-center gap-8 hover:scale-105 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
            <ChevronLeft size={32} />
            <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous</p>
                <p className="font-black dark:text-white">Sacred Section</p>
            </div>
         </Link>
         <Link to={nextLink} className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border dark:border-white/5 shadow-xl flex items-center gap-8 hover:scale-105 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Up Next</p>
                <p className="font-black dark:text-white">Sacred Section</p>
            </div>
            <ChevronRight size={32} />
         </Link>
      </div>
    </div>
  );
};

export default SurahReader;
