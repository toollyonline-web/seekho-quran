
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Clock, BookOpen, Star, Hash, Sun, Moon, Menu, X, WifiOff, 
  Coffee, Shield, MessageSquare, Compass, ArrowRight, Book, 
  Sparkles, Languages, Sliders, Search as SearchIcon, Heart
} from 'lucide-react';
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
  const location = useLocation();

  const t = translations[language];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const savedLang = localStorage.getItem('language') as Language || 'en';
    const savedScale = localStorage.getItem('ui_font_scale') || '1';

    applyGlobalTheme(savedTheme);
    setTheme(savedTheme);
    setLanguage(savedLang);
    setFontScale(parseFloat(savedScale));

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const applyGlobalTheme = (newTheme: ThemeMode) => {
    document.documentElement.classList.remove('dark', 'sepia');
    if (newTheme !== 'light') document.documentElement.classList.add(newTheme);
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'sepia'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    applyGlobalTheme(next);
    localStorage.setItem('theme', next);
  };

  const navItems = [
    { name: t.nav.home, path: '/', icon: <Clock size={20} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={20} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.duas, path: '/duas', icon: <Star size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500`} style={{ fontSize: `calc(1rem * ${fontScale})` }}>
      
      {isOffline && (
        <div className="bg-amber-600 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest z-[100] sticky top-0">
          <WifiOff size={12} /> Working Offline
        </div>
      )}

      {/* Global Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-80 h-full glass shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b dark:border-white/10 flex items-center justify-between">
              <h2 className="font-black text-xl flex items-center gap-2 dark:text-white"><Sliders size={20} className="text-green-600" /> {t.ui.settings}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full dark:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] block">{t.ui.language}</label>
                <div className="flex flex-col gap-3">
                  {['en', 'ur', 'ar'].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => { setLanguage(lang as Language); localStorage.setItem('language', lang); window.location.reload(); }}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${language === lang ? 'bg-green-700 text-white border-green-700 shadow-lg' : 'bg-white dark:bg-slate-900 border-transparent dark:border-white/5 dark:text-white'}`}
                    >
                      <span className="font-bold">{lang === 'en' ? 'English' : lang === 'ur' ? 'اردو' : 'العربية'}</span>
                      {language === lang && <Sparkles size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-[100] w-full border-b border-transparent dark:border-white/5 glass transition-all safe-top">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-green-900/30">QS</div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-xl tracking-tighter dark:text-white leading-none">Quran Seekho</span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest mt-1">Light of the Ummah</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-bold transition-all px-4 py-2 rounded-xl ${
                  location.pathname === item.path 
                    ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'text-slate-400 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={cycleTheme} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-green-600 transition-all">
              {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Coffee size={20} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-green-600 transition-all">
              <Languages size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-8 pb-32">
        {children}
      </main>

      <InstallPWA />

      {/* Floating Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[150] h-20 glass rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 border-2 border-white/20 dark:border-white/5 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all flex-grow ${
                active ? 'text-green-700 dark:text-green-400 -translate-y-2' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${active ? 'bg-green-700/10 shadow-lg' : ''}`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="bg-slate-950 text-white py-20 px-8 hidden lg:block">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
           <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center font-black">QS</div>
                 <span className="text-2xl font-black">Quran Seekho</span>
              </div>
              <p className="text-slate-400 text-lg">Guiding the hearts through the light of the Noble Quran. Ad-free, high-performance, and built with love for the Ummah.</p>
              <div className="flex gap-4">
                 <Link to="/donate" className="flex items-center gap-2 text-rose-400 font-bold hover:underline"><Heart size={18} fill="currentColor" /> Support Us</Link>
                 <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Mission</Link>
              </div>
           </div>
           <div className="md:col-span-7 grid grid-cols-3 gap-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Resources</h4>
                 <ul className="text-slate-400 space-y-2 text-sm">
                    <li><Link to="/surah">Surah List</Link></li>
                    <li><Link to="/juz">By Sipara</Link></li>
                    <li><Link to="/hadith">40 Hadith</Link></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Legal</h4>
                 <ul className="text-slate-400 space-y-2 text-sm">
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                 </ul>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
