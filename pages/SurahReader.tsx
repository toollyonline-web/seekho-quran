
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, RECITERS, TAJWEED_RULES } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Loader2, Info, Share2, Bookmark, Settings,
  Eye, EyeOff, Music, Volume2, Sparkles, BookOpen, Mic, AlertCircle
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
  const [tajweedMode, setTajweedMode] = useState(true);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());
  
  const [fontSize, setFontSize] = useState(38);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'display' | 'audio'>('display');
  
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
      if (!id || isNaN(parseInt(id))) {
        setError("Invalid identifier provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setData(null); // Clear old data

      try {
        const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
        
        if (!detail || (Array.isArray(detail) && detail.length === 0)) {
          throw new Error("No data returned from the revelation server.");
        }
        
        setData(detail);
        
        // SEO & Metadata Updates
        const editionsArr = Array.isArray(detail) ? detail : [detail];
        const primaryInfo = editionsArr[0];

        if (primaryInfo) {
          const sName = primaryInfo.englishName || (isJuz ? `Juz ${id}` : "Surah");
          const sNum = primaryInfo.number || id;
          const sMeaning = primaryInfo.englishNameTranslation || "";
          
          document.title = `${sName} (${sNum}) - Read Quran Online | Quran Seekho`;
          
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", `Read and listen to Surah ${sName} (${sMeaning}) online. Features Tajweed, Urdu & English translations, and professional audio recitation. Section ${sNum} of the Holy Quran.`);
          }

          try {
            localStorage.setItem('qs_last_read', JSON.stringify({
              id: id,
              name: sName,
              ayah: 1,
              timestamp: Date.now()
            }));
          } catch(e) {}
        }
      } catch (err: any) { 
        console.error("Reader Sync Error:", err);
        setError(err.message || "Failed to sync with the Quran API. Please check your connection.");
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

  const arabicToDisplay = tajweedMode && tajweedArabic ? tajweedArabic : standardArabic;

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
      } catch (e) { console.error("Audio Playback Error:", e); }
    }
  };

  const playTajweedSample = (url: string) => {
    if (!tajweedSampleRef.current) return;
    tajweedSampleRef.current.pause();
    tajweedSampleRef.current.src = url;
    tajweedSampleRef.current.play().catch(e => console.error(e));
  };

  const toggleReveal = (num: number) => {
    const newSet = new Set(revealedAyahs);
    if (newSet.has(num)) newSet.delete(num);
    else newSet.add(num);
    setRevealedAyahs(newSet);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 page-transition">
      <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 animate-pulse">Establishing Connection...</p>
    </div>
  );

  if (error || (!standardArabic && !loading)) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-8 page-transition">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-500/20">
         <AlertCircle size={40} />
      </div>
      <div className="space-y-3">
         <h2 className="text-3xl font-black italic">Content Unavailable</h2>
         <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm leading-relaxed">{error || "We couldn't retrieve this chapter. The server might be busy or the content identifier is invalid."}</p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
           Retry Connection
        </button>
        <Link to="/surah" className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
           Return to List
        </Link>
      </div>
    </div>
  );

  const title = isJuz ? `Juz ${id}` : standardArabic?.englishName || "Noble Quran";
  const subTitle = isJuz ? `Noble Quran Part` : `${standardArabic?.revelationType || 'Revelation'} • ${standardArabic?.numberOfAyahs || arabicToDisplay?.ayahs?.length || 0} Verses`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 page-transition">
      
      {/* Settings Panel */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-[#0b0c0d] border-l border-white/5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black italic">Preferences</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('display')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'display' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                  >
                    Display
                  </button>
                  <button 
                    onClick={() => setActiveTab('audio')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'audio' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                  >
                    Audio
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                {activeTab === 'display' ? (
                  <div className="space-y-10 animate-in fade-in duration-300">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.reader.fontSize}</p>
                      <input type="range" min="20" max="80" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-emerald-500 bg-white/5 h-2 rounded-full appearance-none cursor-pointer" />
                      <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        <span>Compact</span>
                        <span>Large</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Translations</p>
                       <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showEnglish ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                          English {showEnglish ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                       <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showUrdu ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                          Urdu {showUrdu ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] space-y-4">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-emerald-500 font-black text-xs uppercase tracking-widest">{t.reader.tajweedMode}</p>
                            <p className="text-[9px] text-slate-600 font-medium">Color-coded recitation rules</p>
                         </div>
                         <button 
                            onClick={() => { setTajweedMode(!tajweedMode); if(!tajweedMode) setHifzMode(false); }}
                            className={`w-12 h-6 rounded-full relative transition-colors ${tajweedMode ? 'bg-emerald-500' : 'bg-white/10'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tajweedMode ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.reader.reciter}</p>
                    <div className="grid gap-3">
                      {RECITERS.map((r) => (
                        <button 
                          key={r.id}
                          onClick={() => { setReciter(r.id); localStorage.setItem('qs_reciter', r.id); }}
                          className={`p-5 rounded-2xl border-2 transition-all flex flex-col text-left ${reciter === r.id ? 'border-emerald-600 bg-emerald-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                        >
                          <span className={`font-black text-sm ${reciter === r.id ? 'text-emerald-500' : 'text-slate-300'}`}>{r.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{r.style}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Hero / Intro Section for SEO */}
      <div className="text-center space-y-8 pt-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 bg-emerald-500/20"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">{isJuz ? 'Noble Quran' : 'Surah Name'}</span>
          <div className="h-px w-8 bg-emerald-500/20"></div>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none">{title}</h1>
        <div className="flex flex-col items-center gap-4">
           <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{subTitle}</span>
           {!isJuz && (
             <p className="text-slate-500 text-xs md:text-sm font-medium max-w-lg leading-relaxed px-6">
                Explore <strong>Surah {title}</strong> with full Arabic text, professional recitations, and accurate translations. Master your Tajweed with our interactive color-coded guide below.
             </p>
           )}
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="sticky top-24 z-[100] py-4 glass -mx-4 px-6 border-y border-white/5 shadow-2xl flex items-center justify-between">
         <div className="flex gap-4 overflow-x-auto no-scrollbar items-center flex-grow">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Tajweed Tips:</span>
            {TAJWEED_RULES.map((rule) => (
              <button 
                key={rule.name}
                onClick={() => playTajweedSample(rule.audio)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-emerald-500 transition-all shrink-0 group active:scale-95"
              >
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rule.color }}></div>
                 <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{rule.name}</span>
                 <Mic size={12} className="text-slate-600 group-hover:text-emerald-400" />
              </button>
            ))}
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="ml-4 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Settings size={20} />
         </button>
      </div>

      {/* Main Content Stream */}
      <article className="space-y-12">
        {arabicToDisplay?.ayahs ? (
          arabicToDisplay.ayahs.map((ayah: any, index: number) => {
            const isPlaying = playingAyah === ayah.number;
            const isHidden = hifzMode && !revealedAyahs.has(ayah.number);
            
            return (
              <div 
                key={ayah.number} 
                id={`ayah-${ayah.number}`}
                className={`quran-card p-10 md:p-14 rounded-[3.5rem] space-y-12 transition-all duration-700 ${isPlaying ? 'ayah-active' : ''}`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                   <div className="flex flex-row md:flex-col gap-4 sticky top-64">
                      <button 
                        onClick={() => toggleAyahAudio(ayah.number)} 
                        className={`w-14 h-14 flex items-center justify-center rounded-[1.25rem] transition-all shadow-xl ${isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white/5 text-slate-500 hover:text-emerald-500'}`}
                        aria-label={`Play Verse ${ayah.numberInSurah}`}
                      >
                         {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" size={24} /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white/5 text-slate-600 hover:text-emerald-500 transition-all" title="Bookmark Ayah">
                         <Bookmark size={20} />
                      </button>
                   </div>
                   
                   <div className="flex-grow w-full space-y-6">
                      <div 
                        className={`font-arabic text-right leading-[2.8] transition-all duration-700 cursor-pointer ${isHidden ? 'blur-md opacity-20 select-none' : ''} ${tajweedMode ? 'tajweed-text' : ''}`} 
                        style={{ fontSize: `${fontSize}px` }} 
                        dir="rtl"
                        onClick={() => hifzMode && toggleReveal(ayah.number)}
                        dangerouslySetInnerHTML={tajweedMode ? { __html: ayah.text } : undefined}
                      >
                         {!tajweedMode && ayah.text}
                      </div>
                      <div className="flex justify-end items-center gap-3">
                         <span className="h-px bg-white/5 flex-grow"></span>
                         <span className="inline-flex items-center justify-center w-14 h-14 text-xs font-black text-emerald-500 border-2 border-emerald-500/20 rounded-[1.25rem] bg-emerald-500/5 select-none">
                            {ayah.numberInSurah}
                         </span>
                      </div>
                   </div>
                </div>

                {(!hifzMode || revealedAyahs.has(ayah.number)) && (
                  <div className="max-w-3xl md:ml-24 space-y-10 border-t border-white/5 pt-10 animate-in fade-in duration-700">
                    {showEnglish && english?.ayahs?.[index] && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">English Interpretation</p>
                          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                            "{english.ayahs[index].text}"
                          </p>
                        </div>
                    )}
                    {showUrdu && urdu?.ayahs?.[index] && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 text-right">اردو ترجمہ</p>
                          <p className="font-urdu text-3xl md:text-5xl leading-[2] text-right text-slate-200" dir="rtl">
                            {urdu.ayahs[index].text}
                          </p>
                        </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-20 text-center text-slate-500 font-bold italic">
            No verses found in this section.
          </div>
        )}
      </article>

      {/* Chapter Pagination */}
      <div className="flex justify-between items-center py-20 border-t border-white/5">
         <Link 
            to={isJuz ? `/juz/${Math.max(1, parseInt(id!) - 1)}` : `/surah/${Math.max(1, parseInt(id!) - 1)}`} 
            className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) <= 1 ? 'invisible' : ''}`}
          >
            Previous
         </Link>
         <Link 
            to={isJuz ? `/juz/${Math.min(30, parseInt(id!) + 1)}` : `/surah/${Math.min(114, parseInt(id!) + 1)}`} 
            className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) >= (isJuz ? 30 : 114) ? 'invisible' : ''}`}
          >
            Next
         </Link>
      </div>
    </div>
  );
};

export default SurahReader;
