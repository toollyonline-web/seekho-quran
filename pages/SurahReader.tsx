
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, Bookmark, X, Play, Pause, Eye, EyeOff, 
  Sliders, Sun, Moon, Coffee, Loader2, Quote, PlayCircle, Share2, Info
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
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const reset = () => {
        setPlayingAyah(null);
        setIsPlayingFullSurah(false);
        setIsAudioLoading(false);
    };

    audio.onended = reset;
    audio.onwaiting = () => setIsAudioLoading(true);
    audio.onplaying = () => setIsAudioLoading(false);
    audio.onerror = () => { reset(); console.error("Audio Load Error"); };
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
        if (!detail) throw new Error("Data Sync Failure");
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
        setError("Network error. Please ensure you have a stable internet connection.");
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
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
      try {
        await audioRef.current.play();
        setPlayingAyah(ayahGlobalNumber);
        setActiveAyah(ayahGlobalNumber);
      } catch (e) { console.warn("Blocked Playback", e); }
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
      try {
        await audioRef.current.play();
        setIsPlayingFullSurah(true);
      } catch (e) { console.warn("Blocked Playback", e); }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-900/10 border-t-emerald-800 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic animate-pulse">Summoning Revelation...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-10">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-[2rem] flex items-center justify-center"><X size={40} /></div>
      <h2 className="text-2xl font-black italic dark:text-white">{error}</h2>
      <button onClick={() => window.location.reload()} className="px-12 py-5 bg-emerald-800 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all active:scale-95">Retry Sync</button>
    </div>
  );

  const arabic = data.find((e: any) => e.edition.type === 'quran' || e.edition.identifier === 'quran-uthmani');
  const english = data.find((e: any) => e.edition.language === 'en');
  const urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');

  const title = isJuz ? `Juz ${id}` : arabic?.englishName || "Chapter";
  const subtitle = isJuz ? `Islamic Section` : `${arabic?.englishNameTranslation || ''} • ${arabic?.revelationType || ''}`;
  const maxItems = isJuz ? 30 : 114;
  const prevLink = isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`;
  const nextLink = isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 page-transition">
      
      {/* Settings Panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-2xl font-black italic tracking-tighter dark:text-white flex items-center gap-3">
                <Sliders className="text-emerald-700" /> Settings
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Atmosphere</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'sepia', 'dark'].map((th) => (
                      <button key={th} onClick={() => setReadingTheme(th as any)} className={`h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${th === 'light' ? 'bg-white' : th === 'sepia' ? 'bg-[#fdf6e3]' : 'bg-slate-950'} ${readingTheme === th ? 'border-emerald-700 shadow-lg' : 'border-transparent'}`}>
                        {th === 'light' ? <Sun size={20} className="text-slate-900" /> : th === 'sepia' ? <Coffee size={20} className="text-[#5d4037]" /> : <Moon size={20} className="text-white" />}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Divine Script Size</p>
                  <input type="range" min="30" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-emerald-800" />
                  <p className="text-right font-mono text-xs text-slate-400 font-bold">{fontSize}px</p>
               </div>
               <div className="space-y-3">
                 {[
                   { id: 'en', label: 'English Meaning', state: showEnglish, set: setShowEnglish },
                   { id: 'ur', label: 'اردو ترجمہ', state: showUrdu, set: setShowUrdu }
                 ].map(l => (
                    <button key={l.id} onClick={() => l.set(!l.state)} className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] transition-all font-black text-sm ${l.state ? 'bg-emerald-800 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                       <span>{l.label}</span>
                       {l.state ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Reader Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-20 border dark:border-white/5 shadow-sacred relative overflow-hidden group text-center">
        <div className="relative z-10 space-y-10">
           <div className="flex items-center justify-center gap-6 md:gap-12">
              <Link to={prevLink} className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-300 hover:text-emerald-800 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible'}`}>
                 <ChevronLeft size={36} />
              </Link>
              <div>
                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-500 uppercase tracking-[0.6em] mb-4 block italic">Heavenly Revelation</span>
                <h1 className="text-5xl md:text-8xl font-black dark:text-white tracking-tighter leading-none italic">{title}</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-6">{subtitle}</p>
              </div>
              <Link to={nextLink} className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-300 hover:text-emerald-800 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible'}`}>
                 <ChevronRight size={36} />
              </Link>
           </div>
           
           <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button disabled={isAudioLoading} onClick={toggleFullSurahAudio} className="flex items-center gap-4 px-12 py-5 bg-emerald-800 text-white rounded-full font-black shadow-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95">
                 {isAudioLoading && isPlayingFullSurah ? <Loader2 className="animate-spin" /> : isPlayingFullSurah ? <Pause /> : <Play fill="currentColor" />}
                 <span className="text-[10px] uppercase tracking-[0.2em]">{isPlayingFullSurah ? 'Pause Stream' : 'Play Full Audio'}</span>
              </button>
              <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-4 px-12 py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-black hover:bg-emerald-800 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] active:scale-95">
                 <Sliders size={20} /> Customize Reader
              </button>
           </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><Quote size={320} /></div>
      </div>

      {/* Verses */}
      <div className={`space-y-12 ${readingTheme === 'sepia' ? 'bg-[#fdf6e3]/50 p-8 rounded-[4rem]' : ''} ${readingTheme === 'dark' ? 'dark' : ''}`}>
        {arabic?.ayahs?.map((ayah: any, index: number) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} className={`group p-10 md:p-16 rounded-[4rem] transition-all duration-700 border border-transparent ${activeAyah === ayah.number ? 'bg-white dark:bg-slate-900 shadow-2xl scale-[1.02] border-emerald-100 dark:border-emerald-900/30' : 'hover:bg-white/40 dark:hover:bg-slate-900/20'}`}>
              <div className="space-y-12">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex flex-row md:flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${isPlaying ? 'bg-emerald-800 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-800 active:scale-90'}`}>
                            {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause size={20} /> : <Play fill="currentColor" size={20} />}
                        </button>
                        <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-700 transition-all active:scale-90"><Share2 size={20} /></button>
                        <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-all active:scale-90"><Bookmark size={20} /></button>
                    </div>
                    <p className="font-arabic text-right quran-text transition-all duration-700 dark:text-white flex-grow selection:bg-emerald-100 dark:selection:bg-emerald-900/40" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                        {ayah.text}
                        <span className="inline-flex items-center justify-center w-14 h-14 mx-6 text-[10px] font-black text-slate-400 border-2 border-slate-100 dark:border-slate-800 rounded-full align-middle font-sans italic">
                            {ayah.numberInSurah}
                        </span>
                    </p>
                 </div>

                 <div className="max-w-4xl space-y-10 ltr:md:ml-20 rtl:md:mr-20">
                    {showEnglish && english?.ayahs[index] && (
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 italic leading-relaxed font-semibold">
                            "{english.ayahs[index].text}"
                        </p>
                    )}
                    {showUrdu && urdu?.ayahs[index] && (
                        <p className="font-urdu text-4xl text-right text-slate-800 dark:text-slate-200 leading-[2.6] py-6" dir="rtl">
                            {urdu.ayahs[index].text}
                        </p>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Nav */}
      <div className="flex justify-between items-center pt-24">
         <Link to={prevLink} className={`p-8 rounded-[3rem] bg-white dark:bg-slate-900 border dark:border-white/5 shadow-sacred flex items-center gap-8 hover:scale-105 transition-all ${parseInt(id!) <= 1 ? 'invisible' : 'visible active:scale-95'}`}>
            <ChevronLeft size={32} className="text-emerald-800" />
            <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous</p>
                <p className="font-black dark:text-white text-lg italic tracking-tight">Chapter {parseInt(id!) - 1}</p>
            </div>
         </Link>
         <Link to={nextLink} className={`p-8 rounded-[3rem] bg-white dark:bg-slate-900 border dark:border-white/5 shadow-sacred flex items-center gap-8 hover:scale-105 transition-all ${parseInt(id!) >= maxItems ? 'invisible' : 'visible active:scale-95'}`}>
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Up Next</p>
                <p className="font-black dark:text-white text-lg italic tracking-tight">Chapter {parseInt(id!) + 1}</p>
            </div>
            <ChevronRight size={32} className="text-emerald-800" />
         </Link>
      </div>

      <div className="p-10 bg-blue-50 dark:bg-blue-950/20 rounded-[3rem] border border-blue-100 dark:border-blue-900/30 flex items-start gap-6 text-blue-800 dark:text-blue-300">
         <Info className="shrink-0 mt-1" />
         <div className="space-y-2">
            <h4 className="font-black uppercase tracking-widest text-[10px]">Reader Tip</h4>
            <p className="text-sm font-medium leading-relaxed italic">You can use the settings panel to enable/disable translations and adjust the text size for a perfect Mushaf-like reading experience.</p>
         </div>
      </div>
    </div>
  );
};

export default SurahReader;
