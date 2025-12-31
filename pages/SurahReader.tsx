
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchSurahDetail, fetchJuzDetail, getAyahAudioUrl, getSurahAudioUrl } from '../services/quranApi';
import { 
  ChevronLeft, ChevronRight, X, Play, Pause, 
  Sliders, Loader2, Info, Share2, Bookmark, Settings
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
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [fontSize, setFontSize] = useState(38);
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
        setError("Network sync error. Please check your internet connection and try again.");
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2ca4ab] rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Revelation...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-8">
      <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600"><X size={40} /></div>
      <div className="space-y-2">
         <h2 className="text-2xl font-bold dark:text-white">Connection Error</h2>
         <p className="text-slate-500 max-w-xs mx-auto text-sm">{error}</p>
      </div>
      <button onClick={() => window.location.reload()} className="px-10 py-4 btn-primary rounded-2xl font-bold shadow-xl">Retry Sync</button>
    </div>
  );

  const arabic = data.find((e: any) => e.edition.type === 'quran' || e.edition.identifier === 'quran-uthmani');
  const english = data.find((e: any) => e.edition.language === 'en');
  const urdu = data.find((e: any) => e.edition.identifier === 'ur.jalandhara');

  const title = isJuz ? `Juz ${id}` : arabic?.englishName || "Surah";
  const subTitle = isJuz ? `Section ${id}` : `${arabic?.revelationType} • ${arabic?.numberOfAyahs} Verses`;

  return (
    <div className={`max-w-4xl mx-auto space-y-12 pb-32 page-transition ${readingTheme === 'sepia' ? 'bg-[#fdf6e3]/50 p-6 rounded-[2rem]' : ''}`}>
      
      {/* Settings Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-[#181a1b] shadow-2xl p-10 space-y-12 animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="dark:text-white" /></button>
             </div>
             <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Appearance</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'sepia'].map(t => (
                      <button key={t} onClick={() => setReadingTheme(t as any)} className={`p-4 rounded-xl border-2 capitalize font-bold text-xs ${readingTheme === t ? 'border-[#2ca4ab] bg-[#2ca4ab]/5' : 'border-transparent bg-slate-50 dark:bg-slate-900'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Font Size</p>
                  <input type="range" min="20" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-[#2ca4ab]" />
                </div>
                <div className="space-y-3">
                   <button onClick={() => setShowEnglish(!showEnglish)} className={`w-full flex justify-between p-4 rounded-xl font-bold text-sm ${showEnglish ? 'bg-[#2ca4ab] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>English Meaning {showEnglish ? <X size={16} /> : <Settings size={16} />}</button>
                   <button onClick={() => setShowUrdu(!showUrdu)} className={`w-full flex justify-between p-4 rounded-xl font-bold text-sm ${showUrdu ? 'bg-[#2ca4ab] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Urdu Translation {showUrdu ? <X size={16} /> : <Settings size={16} />}</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight dark:text-white">{title}</h1>
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
           <span>{subTitle}</span>
           <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1 text-[#2ca4ab] hover:underline">
              <Sliders size={14} /> Settings
           </button>
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-12">
        {arabic?.ayahs?.map((ayah: any, index: number) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div key={ayah.number} className="quran-card p-10 md:p-14 rounded-[2.5rem] space-y-10 group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                 <div className="flex flex-row md:flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleAyahAudio(ayah.number)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isPlaying ? 'bg-[#2ca4ab] text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                       {isAudioLoading && isPlaying ? <Loader2 className="animate-spin" size={16} /> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400"><Share2 size={16} /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400"><Bookmark size={16} /></button>
                 </div>
                 <p className="font-arabic text-right quran-text transition-all duration-300 dark:text-white flex-grow" style={{ fontSize: `${fontSize}px` }} dir="rtl">
                    {ayah.text}
                    <span className="inline-flex items-center justify-center w-12 h-12 mx-4 text-xs font-bold text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full align-middle">
                        {ayah.numberInSurah}
                    </span>
                 </p>
              </div>

              <div className="max-w-3xl ltr:md:ml-12 rtl:md:mr-12 space-y-6">
                 {showEnglish && english?.ayahs[index] && (
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed italic">
                       "{english.ayahs[index].text}"
                    </p>
                 )}
                 {showUrdu && urdu?.ayahs[index] && (
                    <p className="font-urdu text-2xl md:text-3xl text-right text-slate-800 dark:text-slate-200 leading-[2.6]" dir="rtl">
                       {urdu.ayahs[index].text}
                    </p>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Controls */}
      <div className="flex justify-between items-center py-12 border-t dark:border-slate-800">
         <Link to={`/surah/${parseInt(id!) - 1}`} className={`flex items-center gap-3 font-bold text-slate-500 hover:text-[#2ca4ab] transition-colors ${parseInt(id!) <= 1 ? 'invisible' : ''}`}>
            <ChevronLeft /> Previous
         </Link>
         <Link to={`/surah/${parseInt(id!) + 1}`} className={`flex items-center gap-3 font-bold text-slate-500 hover:text-[#2ca4ab] transition-colors ${parseInt(id!) >= 114 ? 'invisible' : ''}`}>
            Next <ChevronRight />
         </Link>
      </div>

      <div className="bg-[#2ca4ab]/10 p-8 rounded-3xl flex items-start gap-4 text-[#2ca4ab]">
         <Info size={20} className="shrink-0" />
         <p className="text-sm font-medium italic">Did you know? Every ayah you read is a source of reward. Keep your intentions pure and may Allah accept your reading.</p>
      </div>
    </div>
  );
};

export default SurahReader;
