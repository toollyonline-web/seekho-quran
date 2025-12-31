
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, RECITERS, TAJWEED_RULES } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Loader2, Info, Share2, Bookmark, Settings,
  Eye, EyeOff, Music, Volume2, Sparkles, BookOpen, Mic
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
  
  const [reciter, setReciter] = useState(() => localStorage.getItem('qs_reciter') || 'ar.alafasy');
  
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
    
    audio.onended = () => {
      // Auto-play next ayah if in sequence mode (future enhancement)
      setPlayingAyah(null);
    };
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
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = isJuz ? await fetchJuzDetail(parseInt(id)) : await fetchSurahDetail(parseInt(id));
        if (!detail) throw new Error("Sync Failed");
        setData(detail);
        
        // SEO Dynamic Metadata
        if (!isJuz && detail[0]) {
          const surahName = detail[0].englishName;
          const surahNumber = id;
          document.title = `Surah ${surahName} (${surahNumber}) – Read Quran Online | Quran Seekho`;
          
          // Update meta description
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", `Read Surah ${surahName} online with Tajweed, Urdu & English translations, and professional audio recitation. Surah ${surahNumber} of the Noble Quran.`);
          }

          localStorage.setItem('qs_last_read', JSON.stringify({
            id: id,
            name: surahName,
            ayah: 1,
            timestamp: Date.now()
          }));
        } else if (isJuz) {
          document.title = `Juz ${id} – Read Noble Quran Online | Quran Seekho`;
        }
      } catch (err) { 
        setError("Network sync failed. Please try again.");
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadContent();
  }, [id, isJuz]);

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
        updateDailyGoal();
        
        // Scroll ayah into view if it's active
        const el = document.getElementById(`ayah-${num}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) { console.error(e); }
    }
  };

  const playTajweedSample = (url: string) => {
    if (!tajweedSampleRef.current) return;
    tajweedSampleRef.current.pause();
    tajweedSampleRef.current.src = url;
    tajweedSampleRef.current.play().catch(e => console.error(e));
  };

  const updateDailyGoal = () => {
    const today = new Date().toDateString();
    const stats = JSON.parse(localStorage.getItem('qs_daily_stats') || '{}');
    if (stats.date !== today) {
      stats.date = today;
      stats.count = 1;
    } else {
      stats.count += 1;
    }
    localStorage.setItem('qs_daily_stats', JSON.stringify(stats));
  };

  const toggleReveal = (num: number) => {
    const newSet = new Set(revealedAyahs);
    if (newSet.has(num)) newSet.delete(num);
    else newSet.add(num);
    setRevealedAyahs(newSet);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Revelation...</p>
    </div>
  );

  const editionsArr = Array.isArray(data) ? data : [data];
  const standardArabic = editionsArr.find((e: any) => e.edition.identifier === 'quran-uthmani');
  const tajweedArabic = editionsArr.find((e: any) => e.edition.identifier === 'quran-tajweed');
  const english = editionsArr.find((e: any) => e.edition.language === 'en');
  const urdu = editionsArr.find((e: any) => e.edition.identifier === 'ur.jalandhara');

  const arabicToDisplay = tajweedMode && tajweedArabic ? tajweedArabic : standardArabic;

  const title = isJuz ? `Juz ${id}` : standardArabic?.englishName || "Surah";
  const subTitle = isJuz ? `Noble Quran Part` : `${standardArabic?.revelationType} • ${standardArabic?.numberOfAyahs} Verses`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 page-transition">
      
      {/* Settings Panel */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-[#0f1112] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">{t.reader.settings}</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('display')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'display' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                  >
                    Display
                  </button>
                  <button 
                    onClick={() => setActiveTab('audio')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'audio' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                  >
                    Audio
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {activeTab === 'display' ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.reader.fontSize}</p>
                      <input type="range" min="20" max="80" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-emerald-500 bg-white/5 h-2 rounded-full appearance-none cursor-pointer" />
                    </div>
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">{t.reader.translation}</p>
                       <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showEnglish ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                          English {showEnglish ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                       <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showUrdu ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                          Urdu {showUrdu ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-emerald-500 font-black text-xs uppercase tracking-widest">{t.reader.tajweedMode}</p>
                            <p className="text-[9px] text-slate-500 font-medium">{t.reader.tajweedDesc}</p>
                         </div>
                         <button 
                            onClick={() => { setTajweedMode(!tajweedMode); if(!tajweedMode) setHifzMode(false); }}
                            className={`w-12 h-6 rounded-full relative transition-colors ${tajweedMode ? 'bg-emerald-500' : 'bg-white/10'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tajweedMode ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.reader.reciter}</p>
                    <div className="grid gap-3">
                      {RECITERS.map((r) => (
                        <button 
                          key={r.id}
                          onClick={() => { setReciter(r.id); localStorage.setItem('qs_reciter', r.id); }}
                          className={`p-5 rounded-2xl border-2 transition-all flex flex-col text-left ${reciter === r.id ? 'border-emerald-600 bg-emerald-600/10' : 'border-white/5 bg-white/5'}`}
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

      {/* Sticky Reader Header (Mobile Optimized) */}
      <div className="sticky top-20 z-10 py-6 glass -mx-4 px-8 mb-10 flex items-center justify-between">
         <div className="flex-1">
            <h1 className="text-2xl font-black italic">{title}</h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">{subTitle}</p>
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all">
            <Settings size={20} />
         </button>
      </div>

      {/* Tajweed Legend Bar */}
      {tajweedMode && (
        <div className="sticky top-[10.5rem] z-[8] py-4 bg-[#0b0c0d]/90 backdrop-blur-xl border-y border-white/5 -mx-4 px-4 shadow-2xl">
           <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar items-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">Tajweed Tips:</span>
              {TAJWEED_RULES.map((rule) => (
                <button 
                  key={rule.name}
                  onClick={() => playTajweedSample(rule.audio)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-emerald-500 transition-all shrink-0 group"
                >
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rule.color }}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{rule.name}</span>
                   <Mic size={12} className="text-slate-600 group-hover:text-emerald-400" />
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Ayah Content Stream */}
      <article className="space-y-12">
        {arabicToDisplay?.ayahs?.map((ayah: any, index: number) => {
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
                      aria-label="Play Verse"
                    >
                       {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" size={24} /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white/5 text-slate-600 hover:text-emerald-500 transition-all">
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
                       <span className="inline-flex items-center justify-center w-14 h-14 text-xs font-black text-emerald-500 border-2 border-emerald-500/20 rounded-[1.25rem] bg-emerald-500/5">
                          {ayah.numberInSurah}
                       </span>
                    </div>
                 </div>
              </div>

              {(!hifzMode || revealedAyahs.has(ayah.number)) && (
                <div className="max-w-3xl md:ml-24 space-y-10 border-t border-white/5 pt-10 animate-in fade-in slide-in-from-bottom-5">
                  {showEnglish && english?.ayahs[index] && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">English Interpretation</p>
                        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                          "{english.ayahs[index].text}"
                        </p>
                      </div>
                  )}
                  {showUrdu && urdu?.ayahs[index] && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 text-right">اردو ترجمہ</p>
                        <p className="font-urdu text-3xl md:text-5xl leading-[1.8] text-right text-slate-200" dir="rtl">
                          {urdu.ayahs[index].text}
                        </p>
                      </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </article>

      {/* SEO Pagination */}
      <div className="flex justify-between items-center py-20 border-t border-white/5">
         <Link to={isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`} className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) <= 1 ? 'invisible' : ''}`}>
            Previous Chapter
         </Link>
         <Link to={isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`} className={`px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) >= (isJuz ? 30 : 114) ? 'invisible' : ''}`}>
            Next Chapter
         </Link>
      </div>
    </div>
  );
};

export default SurahReader;
