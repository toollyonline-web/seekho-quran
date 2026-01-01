
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, fetchTafsir, getAyahAudioUrl, RECITERS, TAJWEED_RULES, TAFSIR_EDITIONS } from '../services/quranApi';
import { GoogleGenAI } from "@google/genai";
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Loader2, Info, Share2, Bookmark, Settings,
  Eye, EyeOff, Music, Volume2, Sparkles, BookOpen, Mic, AlertCircle, FileText, SearchCode,
  CheckCircle2
} from 'lucide-react';
import { translations, Language } from '../services/i18n';

interface AyahBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  timestamp: number;
}

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
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

  const [isMorphologyOpen, setIsMorphologyOpen] = useState(false);
  const [morphologyLoading, setMorphologyLoading] = useState(false);
  const [morphologyData, setMorphologyData] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);
  
  const [reciter, setReciter] = useState(() => {
    try {
      return localStorage.getItem('qs_reciter') || 'ar.alafasy';
    } catch(e) { return 'ar.alafasy'; }
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tajweedSampleRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());

  const lang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    // Load initial bookmarks
    const saved = localStorage.getItem('qs_bookmarks');
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); } catch(e) { console.error(e); }
    }

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

      try {
        const detail = isJuz ? await fetchJuzDetail(parsedId) : await fetchSurahDetail(parsedId);
        setData(detail);
        
        const editions = Array.isArray(detail) ? detail : [detail];
        const primary = editions[0];
        if (primary) {
          const name = isJuz ? `Juz ${id}` : primary.englishName;
          document.title = `${name} - Quran Seekho`;
          localStorage.setItem('qs_last_read', JSON.stringify({ 
            id, 
            name, 
            type: isJuz ? 'juz' : 'surah',
            timestamp: Date.now() 
          }));
        }

        // Handle auto-scroll to ayah if query param exists
        const ayahParam = searchParams.get('ayah');
        if (ayahParam) {
          setTimeout(() => {
            const el = document.getElementById(`ayah-${ayahParam}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 800);
        }
      } catch (err: any) { 
        setError(err.message || "Connection timed out.");
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [id, isJuz, searchParams]);

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
        // Track stats locally
        const stats = JSON.parse(localStorage.getItem('qs_daily_stats') || '{"count":0,"date":""}');
        const today = new Date().toDateString();
        if (stats.date === today) stats.count++;
        else { stats.count = 1; stats.date = today; }
        localStorage.setItem('qs_daily_stats', JSON.stringify(stats));
      } catch (e) { console.error(e); }
    }
  };

  const openMorphology = async (word: string, ayahText: string) => {
    setIsMorphologyOpen(true);
    setMorphologyLoading(true);
    setMorphologyData(null);
    setSelectedWord(word);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze Arabic word "${word}" from Quran context: "${ayahText}". Provide: 1. Root 2. Grammar 3. Contextual Meaning.`,
        config: { systemInstruction: "Quranic Linguist. Concise and scholarly." }
      });
      setMorphologyData(response.text || "No data.");
    } catch (err) { setMorphologyData("Error connecting."); } finally { setMorphologyLoading(false); }
  };

  const toggleReveal = (num: number) => {
    const next = new Set(revealedAyahs);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setRevealedAyahs(next);
  };

  const toggleBookmark = (ayah: any) => {
    const sNum = isJuz ? ayah.surah.number : standardArabic.number;
    const sName = isJuz ? ayah.surah.englishName : standardArabic.englishName;
    
    const isAlreadyBookmarked = bookmarks.some(b => b.surahNumber === sNum && b.ayahNumber === ayah.numberInSurah);
    
    let updated;
    if (isAlreadyBookmarked) {
      updated = bookmarks.filter(b => !(b.surahNumber === sNum && b.ayahNumber === ayah.numberInSurah));
    } else {
      const newBookmark: AyahBookmark = {
        surahNumber: sNum,
        surahName: sName,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text,
        timestamp: Date.now()
      };
      updated = [...bookmarks, newBookmark];
    }
    
    setBookmarks(updated);
    localStorage.setItem('qs_bookmarks', JSON.stringify(updated));
  };

  const isAyahBookmarked = (ayah: any) => {
    const sNum = isJuz ? ayah.surah.number : standardArabic.number;
    return bookmarks.some(b => b.surahNumber === sNum && b.ayahNumber === ayah.numberInSurah);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Syncing revelation...</p>
    </div>
  );

  const title = isJuz ? `Juz ${id}` : standardArabic?.englishName || "Noble Quran";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-48 page-transition">
      
      {/* Sidebar for Settings */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[700] flex justify-end">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
           <div className="relative w-full max-w-sm h-full bg-[#0b0c0d] border-l border-white/5 flex flex-col p-8 space-y-10">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black italic">Settings</h2>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/5 rounded-full"><X/></button>
              </div>
              <div className="space-y-6">
                 <div className="p-6 bg-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black uppercase text-emerald-500">Hifz Mode</span>
                       <button onClick={() => setHifzMode(!hifzMode)} className={`w-12 h-6 rounded-full relative transition-all ${hifzMode ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hifzMode ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold">Blurs text to aid memorization. Tap verses to reveal.</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Font Scale</p>
                    <input type="range" min="20" max="80" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                 </div>
                 <div className="space-y-3">
                    <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full p-4 rounded-2xl flex justify-between font-black text-[10px] uppercase tracking-widest border transition-all ${showEnglish ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>English Translation <Eye size={14}/></button>
                    <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full p-4 rounded-2xl flex justify-between font-black text-[10px] uppercase tracking-widest border transition-all ${showUrdu ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>Urdu Translation <Eye size={14}/></button>
                 </div>
                 <Link to="/bookmarks" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    <Bookmark size={18} className="text-emerald-500" /> View All Bookmarks
                 </Link>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-12">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4">{title}</h1>
        <div className="flex items-center justify-center gap-4 text-emerald-500">
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{arabicToDisplay.ayahs.length} Ayahs</span>
           <div className="w-1 h-1 bg-white/10 rounded-full"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{standardArabic.revelationType}</span>
        </div>
      </div>

      <div className="sticky top-24 z-50 glass py-4 px-6 -mx-4 flex items-center justify-between border-y border-white/5">
         <div className="flex gap-4">
            <button onClick={() => setTajweedMode(!tajweedMode)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${tajweedMode ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>Tajweed Rules</button>
            <button onClick={() => setHifzMode(!hifzMode)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${hifzMode ? 'bg-amber-600 border-amber-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>Hifz Mode</button>
         </div>
         <div className="flex gap-3">
            <Link to="/bookmarks" className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors relative">
               <Bookmark size={20} />
               {bookmarks.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-[#0b0c0d]">{bookmarks.length}</span>}
            </Link>
            <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-emerald-600 rounded-2xl shadow-xl"><Settings size={20}/></button>
         </div>
      </div>

      <div className="space-y-8 px-4 sm:px-0">
        {arabicToDisplay.ayahs.map((ayah: any, idx: number) => {
          const isPlaying = playingAyah === ayah.number;
          const isRevealed = revealedAyahs.has(ayah.number);
          const isBookmarked = isAyahBookmarked(ayah);
          return (
            <div key={ayah.number} id={`ayah-${ayah.numberInSurah}`} className={`quran-card p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] space-y-10 group relative transition-all ${isPlaying ? 'ayah-active' : ''}`}>
               <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
                  <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto overflow-x-auto no-scrollbar py-2">
                     <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                        {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                     </button>
                     <button 
                       onClick={() => toggleBookmark(ayah)} 
                       className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${isBookmarked ? 'bg-emerald-600/20 text-emerald-500 shadow-inner' : 'bg-white/5 text-slate-600 hover:text-emerald-500'}`}
                     >
                        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                     </button>
                     <button onClick={() => { setIsTafsirOpen(true); setSelectedTafsir({ ayahRef: ayah }); }} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-white/5 text-slate-600 hover:text-emerald-500 transition-all shrink-0"><FileText size={20}/></button>
                  </div>
                  <div className="w-full text-right space-y-8">
                     <div 
                       onClick={() => hifzMode ? toggleReveal(ayah.number) : null}
                       className={`font-arabic select-none transition-all duration-500 flex flex-wrap justify-end gap-x-2 md:gap-x-4 ${hifzMode && !isRevealed ? 'blur-xl grayscale opacity-30 cursor-pointer' : ''}`}
                       style={{ fontSize: `${fontSize}px` }}
                       dir="rtl"
                     >
                        {ayah.text.split(' ').map((w: string, i: number) => (
                           <span key={i} onClick={(e) => { e.stopPropagation(); openMorphology(w, ayah.text); }} className="hover:text-emerald-500 cursor-pointer transition-colors px-0.5">{w}</span>
                        ))}
                     </div>
                     <div className="flex items-center justify-end gap-4">
                        <span className="h-px bg-white/5 flex-grow"></span>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500">{ayah.numberInSurah}</div>
                     </div>
                  </div>
               </div>
               {(showEnglish || showUrdu) && (
                 <div className="md:ml-24 pt-10 border-t border-white/5 space-y-8">
                    {showEnglish && english?.ayahs[idx] && <div className="space-y-2"><p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">English</p><p className="text-lg md:text-xl text-slate-400 italic font-medium leading-relaxed">"{english.ayahs[idx].text}"</p></div>}
                    {showUrdu && urdu?.ayahs[idx] && <div className="space-y-2"><p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">اردو</p><p className="font-urdu text-3xl md:text-4xl text-slate-200 leading-relaxed text-right" dir="rtl">{urdu.ayahs[idx].text}</p></div>}
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {/* Global Audio Controller (Floating) */}
      {playingAyah && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl z-[600] px-4 animate-in slide-in-from-bottom-10">
           <div className="glass p-6 rounded-[2.5rem] border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Music size={24} />
                 </div>
                 <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white uppercase tracking-widest truncate">Now Reciting</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest truncate">Ayah {playingAyah} • {RECITERS.find(r => r.id === reciter)?.name}</p>
                 </div>
              </div>
              <div className="flex gap-2 md:gap-3 shrink-0">
                 <button onClick={() => toggleAyahAudio(playingAyah)} className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all"><Pause size={20}/></button>
                 <button onClick={() => setPlayingAyah(null)} className="w-10 h-10 md:w-12 md:h-12 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><X size={20}/></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SurahReader;
