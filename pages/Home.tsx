
import React, { useEffect, useState, useCallback } from 'react';
import { fetchRandomAyah, fetchSurahList } from '../services/quranApi';
import { 
  Search as SearchIcon, BookOpen, Star, 
  ChevronRight, Sparkles, Heart, Sun, Share2, ArrowRight,
  Trophy, Zap, Target, History, GraduationCap, Map, Hash, Compass
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { translations, Language } from '../services/i18n';

const PopularSurahs = [
  { id: 36, name: 'Yaseen', arabic: 'يس', translation: 'The Heart of Quran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', translation: 'The Most Merciful' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', translation: 'The Cave' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملک', translation: 'The Sovereignty' },
];

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

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.number.toString() === searchTerm
  ).slice(0, 12);

  const goalProgress = Math.min(100, (dailyStats.count / dailyStats.goal) * 100);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="page-transition space-y-24 pb-32">
      
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 w-fit rounded-full backdrop-blur-md border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{t.home.greeting}</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter italic">
              Experience the Noble Quran <br/> with Pure Clarity
            </h1>
            
            <p className="text-emerald-100/70 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl">
              Access 114 Surahs and 30 Juz with interactive Tajweed, scholarly translations, and world-class audio recitations.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              {lastRead ? (
                <Link to={`/${lastRead.type}/${lastRead.id}`} className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                  <History size={18} /> Resume: {lastRead.name}
                </Link>
              ) : (
                <Link to="/surah" className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Start Reading
                </Link>
              )}
              <Link to="/search" className="px-10 py-5 bg-emerald-800/40 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-800 transition-all">
                Discovery Mode
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
             <div className="relative scale-110">
                <div className="w-56 h-56 rounded-full border-8 border-white/5 flex flex-col items-center justify-center relative bg-emerald-950/20 backdrop-blur-xl shadow-2xl">
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="46.5%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="292%" strokeDashoffset={`${292 * (1 - goalProgress/100)}%`} className="text-emerald-500 transition-all duration-1000" />
                   </svg>
                   <Trophy size={40} className={`mb-3 transition-transform ${goalProgress >= 100 ? 'text-amber-400 scale-125' : 'text-emerald-200'}`} />
                   <span className="text-4xl font-black">{dailyStats.count}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ayahs Recited</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000"></div>
      </section>

      {/* Main Services Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Link to="/vocabulary" className="quran-card p-8 rounded-[2.5rem] space-y-4 hover:border-amber-500/50 transition-all text-center">
           <div className="w-12 h-12 bg-amber-600/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto"><GraduationCap size={24}/></div>
           <div><h4 className="font-black text-[10px] uppercase tracking-widest">Vocabulary</h4><p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Core Words</p></div>
        </Link>
        <Link to="/ai" className="quran-card p-8 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all text-center">
           <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto"><Sparkles size={24}/></div>
           <div><h4 className="font-black text-[10px] uppercase tracking-widest">Soul Guide</h4><p className="text-[9px] text-slate-500 font-bold uppercase mt-1">AI Scholar</p></div>
        </Link>
        <Link to="/qibla" className="quran-card p-8 rounded-[2.5rem] space-y-4 hover:border-blue-500/50 transition-all text-center">
           <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto"><Compass size={24}/></div>
           <div><h4 className="font-black text-[10px] uppercase tracking-widest">Qibla</h4><p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Global Alignment</p></div>
        </Link>
        <Link to="/tasbeeh" className="quran-card p-8 rounded-[2.5rem] space-y-4 hover:border-rose-500/50 transition-all text-center">
           <div className="w-12 h-12 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto"><Hash size={24}/></div>
           <div><h4 className="font-black text-[10px] uppercase tracking-widest">Tasbeeh</h4><p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Daily Dhikr</p></div>
        </Link>
      </section>

      {/* Surah List Section */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-3xl font-black italic flex items-center gap-3">
                 <BookOpen className="text-emerald-500" /> Browse Surahs
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Access any of the 114 Chapters</p>
           </div>
           <div className="relative w-full max-w-sm">
             <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
             <input
               type="text"
               placeholder="Find Surah..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl outline-none focus:border-emerald-600/50 transition-all font-bold"
             />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {filteredSurahs.map((s) => (
             <Link key={s.number} to={`/surah/${s.number}`} className="quran-card p-8 rounded-[2.5rem] group relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                      {s.number}
                   </div>
                   <p className="font-arabic text-3xl opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" dir="rtl">{s.name}</p>
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-emerald-500 transition-colors">{s.englishName}</h3>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">{s.englishNameTranslation}</p>
             </Link>
           ))}
        </div>
        
        <div className="flex justify-center">
           <Link to="/surah" className="px-12 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
              View All 114 Surahs
           </Link>
        </div>
      </section>

      {/* Juz List Section */}
      <section className="space-y-10">
         <div className="space-y-2">
            <h2 className="text-3xl font-black italic flex items-center gap-3">
               <Map className="text-blue-500" /> Juz Browser
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Read by Parts (Siparah)</p>
         </div>

         <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <Link key={num} to={`/juz/${num}`} className="quran-card py-6 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all aspect-square">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Part</span>
                 <span className="text-2xl font-black text-white italic group-hover:scale-110 transition-transform">{num}</span>
              </Link>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Home;
