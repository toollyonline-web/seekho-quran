
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Sliders, Loader2, Info, Share2, Bookmark, Settings
} from 'lucide-react';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isJuz = location.pathname.includes('/juz/');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [fontSize, setFontSize] = useState(36);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    
    audio.onended = () => setPlayingAyah(null);
    audio.onwaiting = () => setIsAudioLoading(true);
    audio.onplaying = () => setIsAudioLoading(false);
    audio.onerror = () => { setPlayingAyah(null); setIsAudioLoading(false); };
    
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
        if (!detail) throw new Error("Sync Failed");
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
        setError("Network sync failed. This can happen on weak connections or if the API is busy. Please try again.");
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
      audioRef.current.src = getAyahAudioUrl(num);
      try {
        await audioRef.current.play();
        setPlayingAyah(num);
      } catch (e) { console.error(e); }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Loading Revelation...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-8 page-transition">
      <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-2xl border border-rose-500/20">
         <X size={48} />
      </div>
      <div className="space-y-3">
         <h2 className="text-3xl font-black">Sync Error</h2>
         <p className="text-slate-500 max-w-sm mx-auto font-medium">{error}</p>
      </div>
      <button onClick={() => window.location.reload()} className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs">
         Retry Connection
      </button>
    </div>
  );

  // Handle both array (Surah) and potentially single-object (Juz fallback) data
  const editionsArr = Array.isArray(data) ? data : [data];
  
  const arabic = editionsArr.find((e: any) => e.edition.type === 'quran' || e.edition.identifier === 'quran-uthmani');
  const english = editionsArr.find((e: any) => e.edition.language === 'en');
  const urdu = editionsArr.find((e: any) => e.edition.identifier === 'ur.jalandhara');

  const title = isJuz ? `Juz ${id}` : arabic?.englishName || "Surah";
  const subTitle = isJuz ? `Part of the Noble Quran` : `${arabic?.revelationType} • ${arabic?.numberOfAyahs} Verses`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 page-transition">
      
      {/* Settings Panel */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-[#0f1112] shadow-2xl p-10 space-y-12 animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Display Settings</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
             </div>
             <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Arabic Text Size</p>
                  <input type="range" min="20" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-emerald-500 bg-white/5 h-2 rounded-full appearance-none cursor-pointer" />
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                     <span>Normal</span>
                     <span>Extra Large</span>
                  </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Content Toggle</p>
                   <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showEnglish ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                      English Translation {showEnglish ? <X size={16} /> : <Settings size={16} />}
                   </button>
                   <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full flex justify-between items-center p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showUrdu ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                      Urdu Translation {showUrdu ? <X size={16} /> : <Settings size={16} />}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="text-center space-y-6 pt-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">{title}</h1>
        <div className="flex items-center justify-center gap-6">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{subTitle}</span>
           <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline">
              <Sliders size={14} /> Display Settings
           </button>
        </div>
      </div>

      {/* Ayah List */}
      <div className="space-y-10">
        {arabic?.ayahs?.map((ayah: any, index: number) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} className="quran-card p-8 md:p-14 rounded-[3rem] space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                 <div className="flex flex-row md:flex-col gap-3">
                    <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-xl ${isPlaying ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500 hover:text-emerald-500'}`}>
                       {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" size={18} /> : isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-emerald-500 transition-all"><Share2 size={18} /></button>
                 </div>
                 <div className="flex-grow w-full">
                    <p className="font-arabic text-right leading-[2.2] transition-all duration-300" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                       {ayah.text}
                       <span className="inline-flex items-center justify-center w-12 h-12 mx-5 text-[10px] font-black text-emerald-500 border-2 border-emerald-500/20 rounded-2xl align-middle">
                          {ayah.numberInSurah}
                       </span>
                    </p>
                 </div>
              </div>

              <div className="max-w-3xl md:ml-16 space-y-8">
                 {showEnglish && english?.ayahs[index] && (
                    <div className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
                       <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">Meaning</p>
                       <p className="text-lg md:text-xl text-slate-400 leading-relaxed italic">
                          "{english.ayahs[index].text}"
                       </p>
                    </div>
                 )}
                 {showUrdu && urdu?.ayahs[index] && (
                    <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 text-right">
                       <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">اردو ترجمہ</p>
                       <p className="font-urdu text-2xl md:text-4xl leading-relaxed" dir="rtl">
                          {urdu.ayahs[index].text}
                       </p>
                    </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center py-16 border-t border-white/5">
         <Link to={isJuz ? `/juz/${parseInt(id!) - 1}` : `/surah/${parseInt(id!) - 1}`} className={`px-8 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) <= 1 ? 'invisible' : ''}`}>
            Previous
         </Link>
         <Link to={isJuz ? `/juz/${parseInt(id!) + 1}` : `/surah/${parseInt(id!) + 1}`} className={`px-8 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 hover:text-white ${parseInt(id!) >= (isJuz ? 30 : 114) ? 'invisible' : ''}`}>
            Next
         </Link>
      </div>
    </div>
  );
};

export default SurahReader;
