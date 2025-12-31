
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, Sun, Moon, Languages, 
  Search as SearchIcon, Heart, Coffee, X, Sliders, Sparkles, Compass, Menu
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
    { name: t.nav.home, path: '/', icon: <HomeIcon size={22} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={22} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={22} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={22} /> },
    { name: t.nav.qibla, path: '/qibla', icon: <Compass size={22} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-2xl font-black italic tracking-tighter dark:text-white flex items-center gap-3">
                <Sliders className="text-emerald-700" /> {t.ui.settings}
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-12">
              <section className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.ui.language}</p>
                <div className="grid grid-cols-1 gap-3">
                  {['en', 'ur', 'ar'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => { setLanguage(l as Language); localStorage.setItem('language', l); window.location.reload(); }}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between font-bold text-sm ${language === l ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 border-transparent dark:text-white'}`}
                    >
                      <span>{l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'العربية'}</span>
                      {language === l && <Star size={18} fill="currentColor" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Quick Links</p>
                 <div className="grid grid-cols-2 gap-3">
                    <Link to="/names" onClick={() => setIsSettingsOpen(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 dark:text-white group">
                       <Sparkles size={20} className="text-amber-500 group-hover:scale-110 transition-transform" /> 
                       <span className="text-xs font-bold">{t.nav.names}</span>
                    </Link>
                    <Link to="/zakat" onClick={() => setIsSettingsOpen(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 dark:text-white group">
                       <Heart size={20} className="text-rose-500 group-hover:scale-110 transition-transform" /> 
                       <span className="text-xs font-bold">{t.nav.zakat}</span>
                    </Link>
                 </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 z-[300] w-full transition-all duration-300 pt-safe ${scrolled ? 'glass h-20 shadow-lg' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:rotate-12 transition-transform">QS</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none dark:text-white">Quran Seekho</span>
              <span className="text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mt-0.5">Sanctuary</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-white/40 dark:bg-slate-900/40 p-1.5 rounded-full backdrop-blur-md border border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-6 py-2.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-emerald-800 text-white shadow-xl scale-105' 
                    : 'text-slate-500 hover:text-emerald-800 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-emerald-700 transition-all shadow-sm">
              {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Coffee size={20} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-emerald-700 transition-all shadow-sm">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow pt-32 pb-40 lg:pb-24 px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <InstallPWA />

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[400] h-18 glass rounded-3xl shadow-2xl flex items-center justify-around px-2 border border-white/20 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-grow transition-all duration-300 ${
                active ? 'text-emerald-800 dark:text-emerald-400 -translate-y-1' : 'text-slate-400'
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-emerald-600/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer (Desktop) */}
      <footer className="hidden lg:block bg-slate-950 text-white py-16 px-12 border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center font-black text-lg">QS</div>
               <p className="text-slate-500 font-medium">Illuminate your life with the Noble Word.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Link to="/privacy" className="hover:text-white">Privacy</Link>
               <Link to="/about" className="hover:text-white">About</Link>
               <Link to="/donate" className="hover:text-white">Donate</Link>
               <Link to="/feedback" className="hover:text-white">Feedback</Link>
            </div>
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">© {new Date().getFullYear()} Quran Seekho</p>
         </div>
      </footer>
    </div>
  );
};

export default Layout;
