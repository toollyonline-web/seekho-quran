
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, Sun, Moon, Languages, 
  Search as SearchIcon, Heart, Coffee, X, Sliders, Sparkles
} from 'lucide-react';
import InstallPWA from './InstallPWA';
import { translations, Language } from '../services/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const t = translations[language] || translations['en'];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as any || 'light';
    const savedLang = localStorage.getItem('language') as Language || 'en';
    
    setTheme(savedTheme);
    setLanguage(savedLang);
    applyTheme(savedTheme);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const applyTheme = (newTheme: string) => {
    document.documentElement.classList.remove('dark', 'sepia');
    if (newTheme !== 'light') document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'sepia')[] = ['light', 'dark', 'sepia'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  };

  const navItems = [
    { name: t.nav.home, path: '/', icon: <HomeIcon size={20} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={20} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.duas, path: '/duas', icon: <Star size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
      {/* Settings Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="p-10 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-3xl font-black flex items-center gap-3 dark:text-white tracking-tighter">
                <Sliders className="text-emerald-700" /> {t.ui.settings}
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl dark:text-white transition-all">
                <X size={28} />
              </button>
            </div>
            <div className="p-10 space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.ui.language}</p>
                <div className="grid grid-cols-1 gap-4">
                  {['en', 'ur', 'ar'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => { setLanguage(l as Language); localStorage.setItem('language', l); window.location.reload(); }}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${language === l ? 'bg-emerald-800 text-white border-emerald-800 shadow-xl' : 'bg-slate-50 dark:bg-slate-800 border-transparent dark:text-white hover:border-emerald-700'}`}
                    >
                      <span className="font-bold text-lg">{l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'العربية'}</span>
                      {language === l && <Star size={20} fill="currentColor" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-[200] w-full transition-all duration-500 pt-safe ${scrolled ? 'h-20 glass shadow-2xl' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-emerald-900/20 group-hover:-rotate-6 transition-transform">
              QS
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none dark:text-white">Quran Seekho</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">Sacred Space</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 bg-slate-950/5 dark:bg-white/5 p-1.5 rounded-full backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-6 py-3 rounded-full transition-all text-[10px] uppercase tracking-[0.2em] ${
                  location.pathname === item.path 
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 shadow-xl' 
                    : 'text-slate-500 hover:text-emerald-800 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-700 transition-all shadow-sm">
              {theme === 'light' ? <Sun size={22} /> : theme === 'dark' ? <Moon size={22} /> : <Coffee size={22} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-700 transition-all shadow-sm">
              <Sliders size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full pt-6 pb-40 md:pb-20">
        {children}
      </main>

      <InstallPWA />

      {/* Floating Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-8 left-6 right-6 z-[200] h-20 glass rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex items-center justify-around px-2 border border-white/20 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-grow transition-all duration-300 ${
                active ? 'text-emerald-800 dark:text-emerald-400 -translate-y-2' : 'text-slate-400'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-emerald-700/10 shadow-inner' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
              {active && <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full mt-1 animate-pulse"></div>}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Professional Footer */}
      <footer className="bg-slate-950 text-white py-24 px-8 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center font-black text-2xl">QS</div>
              <span className="text-3xl font-black tracking-tighter">Quran Seekho</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">Dedicated to the global Ummah. No trackers, no ads. Just the pure Word of Allah.</p>
            <Link to="/donate" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-800 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl">
              <Heart size={20} fill="currentColor" /> Support the Vision
            </Link>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Navigation</h4>
            <ul className="space-y-5 text-slate-400 font-bold">
              <li><Link to="/surah" className="hover:text-white transition-colors">Surah Index</Link></li>
              <li><Link to="/juz" className="hover:text-white transition-colors">Juz Browser</Link></li>
              <li><Link to="/hadith" className="hover:text-white transition-colors">Imam Nawawi's 40</Link></li>
              <li><Link to="/names" className="hover:text-white transition-colors">Asma ul Husna</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Daily Tools</h4>
            <ul className="space-y-5 text-slate-400 font-bold">
              <li><Link to="/qibla" className="hover:text-white transition-colors">Qibla Locator</Link></li>
              <li><Link to="/tasbeeh" className="hover:text-white transition-colors">Dhikr Counter</Link></li>
              <li><Link to="/zakat" className="hover:text-white transition-colors">Zakat Calc</Link></li>
              <li><Link to="/calendar" className="hover:text-white transition-colors">Hijri Calendar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Community</h4>
            <ul className="space-y-5 text-slate-400 font-bold">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">Submit Request</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
           <p>© {new Date().getFullYear()} Quran Seekho Platform</p>
           <p className="mt-4 md:mt-0 flex items-center gap-3"><Sparkles size={14} className="text-emerald-700" /> Servicing the World</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
