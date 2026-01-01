
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchRandomAyah, fetchSurahList } from '../services/quranApi';
import { 
  Search as SearchIcon, BookOpen, Star, 
  ChevronRight, Sparkles, Heart, Sun, Share2, ArrowRight,
  Trophy, Zap, Target, History, GraduationCap, Map, Hash, Compass, ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const Home: React.FC = () => {
  const [randomAyah, setRandomAyah] = useState<any>(null);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({ count: 0, goal: 10 });
  const [lastRead, setLastRead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  const loadData = useCallback(async () => {
    try {
      const ayah = await fetchRandomAyah();
      setRandomAyah(ayah);
      
      const list = await fetchSurahList();
      setSurahs(list);

      const stats = JSON.parse(localStorage.getItem('qs_daily_stats') || '{"count":0,"date":""}');
      const today = new Date().toDateString();
      if (stats.date === today) {
        setDailyStats(prev => ({ ...prev, count: stats.count }));
      }

      const savedLastRead = localStorage.getItem('qs_last_read');
      if (savedLastRead) {
        setLastRead(JSON.parse(savedLastRead));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSurahs = useMemo(() => {
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.number.toString() === searchTerm
    ).slice(0, 12);
  }, [surahs, searchTerm]);

  const goalProgress = Math.min(100, (dailyStats.count / dailyStats.goal) * 100);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-white/5 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Opening the Gates...</p>
    </div>
  );

  return (
    <div className="page-transition space-y-24 pb-32">
      
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white p-8 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-3 px-5 py-2 bg-white/10 w-fit rounded-full backdrop-blur-xl border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-100">{t.home.greeting}</span>
            </div>
            
            <h1 className="text-5xl md:text-[5.5rem] font-black leading-[0.95] tracking-tighter italic">
              Access the Divine <br/> Revelation Today
            </h1>
            
            <p className="text-emerald-100/70 text-xl md:text-3xl font-medium leading-relaxed max-w-2xl">
              An ad-free spiritual sanctuary for reading, listening, and studying the Holy Quran with intelligent tools.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              {lastRead ? (
                <Link to={`/${lastRead.type}/${lastRead.id}`} className="px-10 py-6 bg-white text-emerald-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
                  <History size={20} /> Resume: {lastRead.name}
                </Link>
              ) : (
                <Link to="/surah" className="px-10 py-6 bg-white text-emerald-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                  Start Reading
                </Link>
              )}
              <Link to="/search" className="px-10 py-6 bg-emerald-800/40 backdrop-blur-md text-white border border-white/10 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-800 transition-all">
                Discovery Mode <SearchIcon size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
             <div className="relative scale-125">
                <div className="w-64 h-64 rounded-full border-8 border-white/5 flex flex-col items-center justify-center relative bg-emerald-950/40 backdrop-blur-3xl shadow-2xl">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46.5%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="292%" strokeDashoffset={`${292 * (1 - goalProgress/100)}%`} className="text-emerald-400 transition-all duration-1000 shadow-xl" />
                   </svg>
                   <Trophy size={50} className={`mb-4 transition-all duration-500 ${goalProgress >= 100 ? 'text-amber-400 scale-125' : 'text-emerald-200'}`} />
                   <span className="text-5xl font-black">{dailyStats.count}</span>
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 mt-2">Verses Recited</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[140px] -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
      </section>

      {/* Main Services Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Link to="/vocabulary" className="quran-card p-10 rounded-[3rem] space-y-5 hover:border-amber-500/50 transition-all text-center">
           <div className="w-16 h-16 bg-amber-600/10 text-amber-500 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><GraduationCap size={32}/></div>
           <div><h4 className="font-black text-xs uppercase tracking-widest text-white">Vocabulary</h4><p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Linguistic Core</p></div>
        </Link>
        <Link to="/ai" className="quran-card p-10 rounded-[3rem] space-y-5 hover:border-emerald-500/50 transition-all text-center">
           <div className="w-16 h-16 bg-emerald-600/10 text-emerald-500 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Sparkles size={32}/></div>
           <div><h4 className="font-black text-xs uppercase tracking-widest text-white">Soul Guide</h4><p className="text-[10px] text-slate-500 font-bold uppercase mt-2">AI Scholar</p></div>
        </Link>
        <Link to="/qibla" className="quran-card p-10 rounded-[3rem] space-y-5 hover:border-blue-500/50 transition-all text-center">
           <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Compass size={32}/></div>
           <div><h4 className="font-black text-xs uppercase tracking-widest text-white">Qibla</h4><p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Global Direction</p></div>
        </Link>
        <Link to="/tasbeeh" className="quran-card p-10 rounded-[3rem] space-y-5 hover:border-rose-500/50 transition-all text-center">
           <div className="w-16 h-16 bg-rose-600/10 text-rose-500 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Hash size={32}/></div>
           <div><h4 className="font-black text-xs uppercase tracking-widest text-white">Tasbeeh</h4><p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Daily Dhikr</p></div>
        </Link>
      </section>

      {/* Surah List Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-black italic flex items-center gap-4">
                 <BookOpen className="text-emerald-500" size={40} /> Browse Surahs
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px]">Explore the 114 Chapters of Wisdom</p>
           </div>
           <div className="relative w-full max-w-md group">
             <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
             <input
               type="text"
               placeholder="Find by name or number..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-16 pr-6 py-5 bg-white/5 border-2 border-white/5 rounded-[2rem] outline-none focus:border-emerald-600/50 transition-all font-black text-lg shadow-xl"
             />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {filteredSurahs.map((s) => (
             <Link key={s.number} to={`/surah/${s.number}`} className="quran-card p-10 rounded-[3.5rem] group relative overflow-hidden transition-all hover:scale-[1.03]">
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[12px] font-black text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner border border-white/5">
                      {s.number}
                   </div>
                   <p className="font-arabic text-4xl opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all transform group-hover:scale-110" dir="rtl">{s.name}</p>
                </div>
                <div className="space-y-1">
                   <h3 className="font-black text-2xl text-white group-hover:text-emerald-500 transition-colors">{s.englishName}</h3>
                   <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400">{s.englishNameTranslation}</p>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   <BookOpen size={120} />
                </div>
             </Link>
           ))}
        </div>
        
        <div className="flex justify-center pt-8">
           <Link to="/surah" className="px-16 py-6 bg-white/5 border-2 border-white/5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-4 shadow-2xl">
              View All 114 Chapters <ArrowRight size={18} />
           </Link>
        </div>
      </section>

      {/* Juz List Section */}
      <section className="space-y-12">
         <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-black italic flex items-center gap-4">
               <Map className="text-blue-500" size={40} /> Juz Browser
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[11px]">Systematic reading by Parts (Siparah)</p>
         </div>

         <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-5">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <Link key={num} to={`/juz/${num}`} className="quran-card py-10 rounded-[2rem] flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all aspect-square border-white/5 relative overflow-hidden">
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors z-10">Part</span>
                 <span className="text-3xl font-black text-white italic group-hover:scale-125 transition-transform z-10">{num}</span>
                 <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
         </div>
      </section>
      
      {/* Aesthetic Verse Card */}
      {randomAyah && (
        <section className="quran-card p-12 md:p-20 rounded-[4rem] border-white/5 text-center space-y-12 relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0b0c0d]">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 p-12 opacity-[0.02] pointer-events-none">
              <Sparkles size={400} />
           </div>
           
           <div className="space-y-4 relative z-10">
              <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.6em] mb-4">Verse of the Moment</p>
              <div className="font-arabic text-4xl md:text-6xl text-white leading-relaxed mb-10" dir="rtl">
                 {randomAyah[0].text}
              </div>
              <p className="text-xl md:text-2xl text-slate-400 italic font-medium leading-relaxed max-w-3xl mx-auto">
                 "{randomAyah[1].text}"
              </p>
           </div>
           
           <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="h-px bg-white/10 w-24"></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">{randomAyah[0].surah.englishName} {randomAyah[0].numberInSurah}</p>
              <Link to={`/surah/${randomAyah[0].surah.number}`} className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors group">
                 Open Context <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
           </div>
        </section>
      )}

      <div className="text-center pt-12">
         <p className="text-[11px] font-black text-slate-800 uppercase tracking-[1em]">Quran Seekho • Pure Digital Sanctuary</p>
      </div>
    </div>
  );
};

export default Home;
