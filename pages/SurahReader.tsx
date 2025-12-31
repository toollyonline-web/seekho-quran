
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, fetchTafsir, getAyahAudioUrl, RECITERS, TAJWEED_RULES, TAFSIR_EDITIONS } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Loader2, Info, Share2, Bookmark, Settings,
  Eye, EyeOff, Music, Volume2, Sparkles, BookOpen, Mic, AlertCircle, FileText
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
  const [hifzMode, setHifzMode] = useState(false);
  const [tajweedMode, setTajweedMode] = useState(false);
  
  const [fontSize, setFontSize] = useState(38);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState<any>(null);
  const [activeTafsirEdition, setActiveTafsirEdition] = useState('en.tafsir-ibn-kathir');
  
  const [reciter, setReciter] = useState(() => {
    try {
      return localStorage.getItem('qs_reciter') || 'ar.alafasy';
    } catch(e) { return 'ar.alafasy'; }
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tajweedSampleRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const lang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    
    const sampleAudio = new Audio();
    sampleAudio.crossOrigin = "anonymous";
    tajweedSampleRef.current = sampleAudio;
    
    audio.onended = () => setPlayingAyah(null);
    audio.onwaiting = () => setIsAudioLoading(true);
    audio.onplaying = () => setIsAudioLoading(false);
    audio.onerror = () => { setPlayingAyah(null); setIsAudioLoading(false); };
    
    return () => {
      audio.pause();
      audio.src = '';
      sampleAudio.pause();
      sampleAudio.src = '';
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      const parsedId = parseInt(id || '');
      if (!id || isNaN(parsedId)) {
        setError("Invalid identifier provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setData(null);

      try {
        const detail = isJuz ? await fetchJuzDetail(parsedId) : await fetchSurahDetail(parsedId);
        if (!detail || (Array.isArray(detail) && detail.length === 0)) {
          throw new Error("Revelation server is currently busy. Please retry.");
        }
        setData(detail);
        
        const editions = Array.isArray(detail) ? detail : [detail];
        const primary = editions[0];
        if (primary) {
          const name = primary.englishName || (isJuz ? `Juz ${id}` : "Surah");
          document.title = `${name} (${id}) - Quran Seekho`;
          const meta = document.querySelector('meta[name="description"]');
          if (meta) meta.setAttribute("content", `Read and listen to ${name} online with Tajweed and translations.`);
          try {
            localStorage.setItem('qs_last_read', JSON.stringify({ id, name, ayah: 1, timestamp: Date.now() }));
          } catch(e) {}
        }
      } catch (err: any) { 
        setError(err.message || "Connection timed out.");
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadContent();
  }, [id, isJuz]);

  const editionsArr = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  const standardArabic = editionsArr.find((e: any) => e.edition?.identifier === 'quran-uthmani' || !e.edition);
  const tajweedArabic = editionsArr.find((e: any) => e.edition?.identifier === 'quran-tajweed');
  const english = editionsArr.find((e: any) => e.edition?.language === 'en');
  const urdu = editionsArr.find((e: any) => e.edition?.identifier === 'ur.jalandhara');

  const arabicToDisplay = (tajweedMode && tajweedArabic) ? tajweedArabic : standardArabic;

  const toggleAyahAudio = async (num: number) => {
    if (!audioRef.current) return;
    if (playingAyah === num) {
      audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      audioRef.current.pause();
      audioRef.current.src = getAyahAudioUrl(num, reciter);
      try {
        await audioRef.current.play();
        setPlayingAyah(num);
      } catch (e) { console.error(e); }
    }
  };

  const playTajweedSample = (url: string) => {
    if (tajweedSampleRef.current) {
      tajweedSampleRef.current.src = url;
      tajweedSampleRef.current.play().catch(() => {});
    }
  };

  const openTafsir = async (ayah: any) => {
    setIsTafsirOpen(true);
    setTafsirLoading(true);
    setSelectedTafsir(null);
    try {
      const result = await fetchTafsir(ayah.number, activeTafsirEdition);
      setSelectedTafsir({ ...result, ayahRef: ayah });
    } catch (e) {
      console.error(e);
    } finally {
      setTafsirLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 animate-pulse">Syncing Content...</p>
    </div>
  );

  if (error || !arabicToDisplay || !arabicToDisplay.ayahs) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-8">
      <AlertCircle size={48} className="text-rose-500 opacity-50" />
      <div className="space-y-2">
         <h2 className="text-2xl font-black italic">Unable to Load</h2>
         <p className="text-slate-500 max-w-sm text-sm">{error || "Server connection failed."}</p>
      </div>
      <button onClick={() => window.location.reload()} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Retry</button>
    </div>
  );

  const title = isJuz ? `Juz ${id}` : standardArabic?.englishName || "Noble Quran";
  const subTitle = isJuz ? `Juz/Sipara Section` : `${standardArabic?.revelationType || 'Holy Quran'} • ${arabicToDisplay.ayahs.length} Ayahs`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 page-transition">
      {/* Tafsir Side Panel */}
      {isTafsirOpen && (
        <div className="fixed inset-0 z-[600] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTafsirOpen(false)}></div>
          <div className="relative w-full max-w-lg h-full bg-[#0b0c0d] border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-500">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black italic">Ayah Context</h2>
                   <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Tafsir Exploration</p>
                </div>
                <button onClick={() => setIsTafsirOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
             </div>
             
             <div className="p-4 border-b border-white/5 bg-white/5 overflow-x-auto flex gap-2 no-scrollbar">
                {TAFSIR_EDITIONS.map(ed => (
                   <button 
                     key={ed.id}
                     onClick={() => {
                        setActiveTafsirEdition(ed.id);
                        if(selectedTafsir?.ayahRef) openTafsir(selectedTafsir.ayahRef);
                     }}
                     className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTafsirEdition === ed.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                   >
                      {ed.name}
                   </button>
                ))}
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {tafsirLoading ? (
                   <div className="flex flex-col items-center justify-center h-64 gap-4">
                      <Loader2 className="animate-spin text-emerald-500" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Tafsir...</p>
                   </div>
                ) : selectedTafsir ? (
                   <div className="space-y-10 animate-in fade-in duration-500">
                      <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                        <p className="font-arabic text-right text-3xl mb-6 leading-relaxed" dir="rtl">{selectedTafsir.ayahRef.text}</p>
                        <div className="flex justify-end">
                           <span className="px-4 py-1.5 bg-emerald-600/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Ayah {selectedTafsir.ayahRef.numberInSurah}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"><FileText size={20}/></div>
                           <h3 className="font-black italic text-xl">Commentary</h3>
                        </div>
                        <div className={`text-slate-400 leading-relaxed text-lg whitespace-pre-wrap font-medium ${activeTafsirEdition.startsWith('ar.') ? 'font-arabic text-right text-2xl' : ''}`} dir={activeTafsirEdition.startsWith('ar.') ? 'rtl' : 'ltr'}>
                           {selectedTafsir.text}
                        </div>
                      </div>
                   </div>
                ) : (
                   <p className="text-slate-500 italic text-center py-20">Select an Ayah to view its profound context.</p>
                )}
             </div>
             <div className="p-8 border-t border-white/5 bg-white/5 text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">
                Sourced from scholarly verified digital archives
             </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-[#0b0c0d] border-l border-white/5 flex flex-col">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-black italic">Settings</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Font Size</p>
                  <input type="range" min="20" max="80" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-emerald-500 h-2 bg-white/5 rounded-full appearance-none cursor-pointer" />
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Language</p>
                   <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase transition-all ${showEnglish ? 'bg-emerald-600' : 'bg-white/5 text-slate-500'}`}>English <Eye size={16}/></button>
                   <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase transition-all ${showUrdu ? 'bg-emerald-600' : 'bg-white/5 text-slate-500'}`}>Urdu <Eye size={16}/></button>
                </div>
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                   <div className="flex items-center justify-between">
                      <p className="text-emerald-500 font-black text-xs uppercase">Tajweed Guide</p>
                      <button onClick={() => setTajweedMode(!tajweedMode)} className={`w-12 h-6 rounded-full relative transition-colors ${tajweedMode ? 'bg-emerald-500' : 'bg-white/10'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tajweedMode ? 'right-1' : 'left-1'}`}></div></button>
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reciter</p>
                   {RECITERS.map(r => (
                     <button key={r.id} onClick={() => setReciter(r.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${reciter === r.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}>
                       <p className="font-bold text-sm">{r.name}</p>
                       <p className="text-[10px] opacity-50 uppercase">{r.style}</p>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-6 pt-12">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">{title}</h1>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{subTitle}</p>
      </div>

      {/* Toolbar */}
      <div className="sticky top-24 z-50 glass py-4 px-6 -mx-4 border-y border-white/5 flex items-center justify-between overflow-x-auto no-scrollbar">
         <div className="flex gap-4 items-center">
            {TAJWEED_RULES.map(rule => (
              <button key={rule.name} onClick={() => playTajweedSample(rule.audio)} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-emerald-500 shrink-0">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rule.color }}></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">{rule.name}</span>
                 <Mic size={12} className="text-slate-500" />
              </button>
            ))}
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="ml-4 p-3 bg-emerald-600 rounded-2xl shadow-xl shrink-0"><Settings size={20}/></button>
      </div>

      {/* Verses */}
      <article className="space-y-12">
        {arabicToDisplay.ayahs.map((ayah: any, idx: number) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} id={`ayah-${ayah.number}`} className={`quran-card p-10 md:p-14 rounded-[3.5rem] space-y-12 transition-all ${isPlaying ? 'ayah-active' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                 <div className="flex flex-row md:flex-col gap-4">
                    <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-xl ${isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-white/5 text-slate-500'}`}>
                       {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                    </button>
                    <button onClick={() => openTafsir(ayah)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-slate-600 hover:text-emerald-500 transition-colors"><Info size={20}/></button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-slate-600"><Bookmark size={20}/></button>
                 </div>
                 <div className="flex-grow w-full space-y-6">
                    <div className={`font-arabic text-right leading-[2.8] ${tajweedMode ? 'tajweed-text' : ''}`} style={{ fontSize: `${fontSize}px` }} dir="rtl" dangerouslySetInnerHTML={{ __html: ayah.text }}></div>
                    <div className="flex justify-end items-center gap-3">
                       <span className="h-px bg-white/5 flex-grow"></span>
                       <span className="w-14 h-14 flex items-center justify-center border-2 border-emerald-500/20 rounded-2xl text-xs font-black text-emerald-500">{ayah.numberInSurah}</span>
                    </div>
                 </div>
              </div>
              <div className="max-w-3xl md:ml-24 space-y-8 border-t border-white/5 pt-10">
                {showEnglish && english?.ayahs?.[idx] && (
                  <div className="space-y-1"><p className="text-[9px] font-black text-slate-600 uppercase">English</p><p className="text-xl text-slate-400 italic">"{english.ayahs[idx].text}"</p></div>
                )}
                {showUrdu && urdu?.ayahs?.[idx] && (
                  <div className="space-y-1"><p className="text-[9px] font-black text-slate-600 uppercase text-right">اردو</p><p className="font-urdu text-3xl text-right text-slate-200" dir="rtl">{urdu.ayahs[idx].text}</p></div>
                )}
              </div>
            </div>
          );
        })}
      </article>

      {/* Pagination */}
      <div className="flex justify-between py-20 border-t border-white/5">
         <Link to={isJuz ? `/juz/${Math.max(1, parseInt(id!) - 1)}` : `/surah/${Math.max(1, parseInt(id!) - 1)}`} className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase ${parseInt(id!) <= 1 ? 'invisible' : ''}`}>Prev</Link>
         <Link to={isJuz ? `/juz/${Math.min(30, parseInt(id!) + 1)}` : `/surah/${Math.min(114, parseInt(id!) + 1)}`} className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase ${parseInt(id!) >= (isJuz ? 30 : 114) ? 'invisible' : ''}`}>Next</Link>
      </div>
    </div>
  );
};

export default SurahReader;
