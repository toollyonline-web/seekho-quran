
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, BookOpen, Star, Heart, Hash, Sun, Moon, Menu, X, WifiOff, Calendar, Play, Pause, Coins, FileText, Coffee, Shield, MessageSquare, Compass, Gavel, Quote, ArrowRight, Book, Sparkles, Languages, Sliders, Type, Search as SearchIcon } from 'lucide-react';
import InstallPWA from './InstallPWA';
import { getHijriDate } from '../services/quranApi';
import { translations, Language } from '../services/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

type ThemeMode = 'light' | 'dark' | 'sepia';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [fontScale, setFontScale] = useState(1);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hijriDate, setHijriDate] = useState('');
  const location = useLocation();

  const t = translations[language];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const savedLang = localStorage.getItem('language') as Language;
    const savedScale = localStorage.getItem('ui_font_scale');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    const initialLang = savedLang || 'en';
    const initialScale = savedScale ? parseFloat(savedScale) : 1;

    applyGlobalTheme(initialTheme);
    applyLanguage(initialLang);
    applyFontScale(initialScale);
    
    setTheme(initialTheme);
    setLanguage(initialLang);
    setFontScale(initialScale);
    setHijriDate(getHijriDate());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const applyLanguage = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
  };

  const applyFontScale = (scale: number) => {
    document.documentElement.style.setProperty('--ui-scale', scale.toString());
    localStorage.setItem('ui_font_scale', scale.toString());
  };

  const applyGlobalTheme = (newTheme: ThemeMode) => {
    document.documentElement.classList.remove('dark', 'sepia');
    if (newTheme !== 'light') {
      document.documentElement.classList.add(newTheme);
    }
  };

  const cycleTheme = () => {
    let nextTheme: ThemeMode = 'light';
    if (theme === 'light') nextTheme = 'dark';
    else if (theme === 'dark') nextTheme = 'sepia';
    else nextTheme = 'light';
    
    setTheme(nextTheme);
    applyGlobalTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const navItems = [
    { name: t.nav.home, path: '/', icon: <Clock size={20} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={20} /> },
    { name: "Search", path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.duas, path: '/duas', icon: <Star size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 
        theme === 'sepia' ? 'bg-[#fdf6e3] text-[#5d4037]' : 
        'bg-green-50 text-slate-900'
    }`} style={{ fontSize: `calc(1rem * var(--ui-scale, 1))` }}>
      
      {isOffline && (
        <div className="bg-amber-600 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest z-[70] relative">
          <WifiOff size={12} /> Offline Mode - Using Cached Content
        </div>
      )}

      {/* Global Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-80 h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white"><Sliders size={20} className="text-green-600" /> {t.ui.settings}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full dark:text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.ui.language}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'en', label: 'English', sub: 'Default' },
                    { id: 'ur', label: 'اردو', sub: 'Nastaliq' },
                    { id: 'ar', label: 'العربية', sub: 'Traditional' }
                  ].map((lang) => (
                    <button 
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id as Language); applyLanguage(lang.id as Language); }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${language === lang.id ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}
                    >
                      <span className="font-bold">{lang.label}</span>
                      <span className="text-[10px] opacity-60">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block">{t.ui.fontScale}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 1, label: '100%' },
                    { val: 1.2, label: '120%' },
                    { val: 1.4, label: '140%' }
                  ].map((s) => (
                    <button 
                      key={s.val}
                      onClick={() => { setFontScale(s.val); applyFontScale(s.val); }}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${fontScale === s.val ? 'bg-green-700 text-white border-green-700' : 'bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-50 w-full border-b transition-colors ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#fdf6e3]/90 border-[#eee8d5]' : 
        'bg-white/90 border-green-100'
      } backdrop-blur-md safe-top`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-900/20">QS</div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none">Quran Seekho</span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">{hijriDate}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-semibold transition-all hover:scale-105 ${
                  location.pathname === item.path 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-green-600'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-500 dark:text-slate-400"
                aria-label="App Settings"
            >
              <Languages size={20} />
            </button>
            <button 
                onClick={cycleTheme} 
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2" 
                aria-label="Cycle Theme"
            >
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'sepia' && <Coffee size={20} />}
            </button>
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-6 px-4 space-y-4 animate-in slide-in-from-top-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      <InstallPWA />

      <footer className={`mt-20 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 
        theme === 'sepia' ? 'bg-[#eee8d5]' : 
        'bg-white'
      } border-t dark:border-slate-800 overflow-hidden pb-20 lg:pb-0`}>
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-4 space-y-8">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-green-900/20 group-hover:rotate-6 transition-transform">QS</div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tighter">Quran Seekho</span>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Illuminate Your Heart</span>
                </div>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
                A modern, ad-free sanctuary for the global Ummah to read, understand, and live by the light of the Noble Quran.
              </p>
              
              <div className="p-6 bg-green-50 dark:bg-slate-900 rounded-[2rem] border border-green-100 dark:border-slate-800 relative group overflow-hidden">
                <div className="relative z-10">
                  <h5 className="text-sm font-bold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                    <Sparkles size={16} /> Voluntary Project
                  </h5>
                  <p className="text-xs text-slate-500 mb-4">Sustain this ad-free experience with your voluntary support.</p>
                  <Link to="/donate" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-900/10">
                    {t.ui.donate} <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                  <Heart size={80} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
              
              <div className="space-y-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">{t.nav.library}</h4>
                <ul className="space-y-4">
                  <li><Link to="/surah" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.surah}</Link></li>
                  <li><Link to="/juz" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.surah} by Juz</Link></li>
                  <li><Link to="/hadith" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> 40 Hadith</Link></li>
                  <li><Link to="/prophetic-stories" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group font-bold"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Prophetic Stories</Link></li>
                  <li><Link to="/names" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> 99 Names</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">{t.nav.tools}</h4>
                <ul className="space-y-4">
                  <li><Link to="/tasbeeh" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Hash size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.tasbeeh}</Link></li>
                  <li><Link to="/duas" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Star size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.duas}</Link></li>
                  <li><Link to="/zakat" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Coins size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.zakat}</Link></li>
                  <li><Link to="/qibla" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Compass size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> {t.nav.qibla}</Link></li>
                </ul>
              </div>

              <div className="space-y-6 md:col-span-1 col-span-2">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">{t.nav.platform}</h4>
                <ul className="space-y-4">
                  <li><Link to="/about" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all">About Our Mission</Link></li>
                  <li><Link to="/feedback" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group">Feedback <MessageSquare size={14} /></Link></li>
                  <li><Link to="/privacy" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group">Privacy <Shield size={14} /></Link></li>
                </ul>
              </div>

            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm font-bold text-slate-400">© {new Date().getFullYear()} Quran Seekho Platform</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">Designed for the Ummah</p>
            </div>
            
            <div className="flex items-center gap-6 px-8 py-3 bg-slate-50 dark:bg-slate-900 rounded-full border dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                {t.ui.sadaqah}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Improved with Safe Areas */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-2 z-[90] ${
        theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#fdf6e3]/95 border-[#eee8d5]' : 
        'bg-white/95 border-green-100'
      } backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-bottom`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-all ${
              location.pathname === item.path ? 'text-green-700 dark:text-green-400 scale-110 font-bold' : 'text-slate-400'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Layout;
