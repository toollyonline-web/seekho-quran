
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, Sun, Moon, Languages, 
  Search as SearchIcon, Heart, Coffee, X, Sliders, Sparkles, Compass
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

    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    { name: t.nav.duas, path: '/duas', icon: <Heart size={22} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={22} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic Settings Sheet */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[400] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="p-10 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-3xl font-black flex items-center gap-3 dark:text-white tracking-tighter italic">
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
              <div className="space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Quick Links</p>
                 <div className="grid grid-cols-2 gap-4">
                    <Link to="/qibla" onClick={() => setIsSettingsOpen(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 dark:text-white">
                       <Compass className="text-emerald-700" /> <span className="text-xs font-bold">{t.nav.qibla}</span>
                    </Link>
                    <Link to="/names" onClick={() => setIsSettingsOpen(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center gap-2 dark:text-white">
                       <Star className="text-amber-500" /> <span className="text-xs font-bold">{t.nav.names}</span>
                    </Link>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Header */}
      <header className={`sticky top-0 z-[300] w-full transition-all duration-300 pt-safe ${scrolled ? 'h-20 glass shadow-2xl' : 'h-24 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-emerald-800 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:-rotate-6 transition-transform">
              QS
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none dark:text-white">Quran Seekho</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">Sacred Space</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 p-1.5 rounded-full backdrop-blur-md border border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-6 py-3 rounded-full transition-all text-[11px] uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 shadow-xl scale-105' 
                    : 'text-slate-500 hover:text-emerald-800 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-700 transition-all shadow-sm active:scale-90">
              {theme === 'light' ? <Sun size={22} /> : theme === 'dark' ? <Moon size={22} /> : <Coffee size={22} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-700 transition-all shadow-sm active:scale-90">
              <Sliders size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Primary View */}
      <main className="flex-grow max-w-7xl mx-auto w-full pt-6 pb-40 md:pb-24 px-4 md:px-8">
        {children}
      </main>

      <InstallPWA />

      {/* High-End Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-8 left-6 right-6 z-[300] h-20 glass rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex items-center justify-around px-2 border border-white/20 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-grow transition-all duration-300 relative ${
                active ? 'text-emerald-800 dark:text-emerald-400 -translate-y-2' : 'text-slate-400'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-emerald-600/10 shadow-inner' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
              {active && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-800 dark:bg-emerald-400 rounded-full animate-pulse"></div>}
            </Link>
          );
        })}
      </nav>

      <footer className="bg-slate-950 text-white py-24 px-8 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center font-black text-2xl">QS</div>
              <span className="text-3xl font-black tracking-tighter italic">Quran Seekho</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">Illuminate your path with the Word of Allah. Distraction-free, private, and global.</p>
            <Link to="/donate" className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-800 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl hover:scale-105">
              <Heart size={20} fill="currentColor" /> Support Us
            </Link>
          </div>
          <div>
             <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Sacred Content</h4>
             <ul className="space-y-5 text-slate-400 font-bold">
                <li><Link to="/surah" className="hover:text-white transition-colors">Surah Library</Link></li>
                <li><Link to="/juz" className="hover:text-white transition-colors">Browse by Juz</Link></li>
                <li><Link to="/hadith" className="hover:text-white transition-colors">Hadith Collection</Link></li>
                <li><Link to="/names" className="hover:text-white transition-colors">99 Names of Allah</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Islamic Tools</h4>
             <ul className="space-y-5 text-slate-400 font-bold">
                <li><Link to="/qibla" className="hover:text-white transition-colors">Qibla Locator</Link></li>
                <li><Link to="/tasbeeh" className="hover:text-white transition-colors">Dhikr Counter</Link></li>
                <li><Link to="/zakat" className="hover:text-white transition-colors">Zakat Calculator</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">Islamic Calendar</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-emerald-600 mb-8">Platform</h4>
             <ul className="space-y-5 text-slate-400 font-bold">
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
           <p>© {new Date().getFullYear()} Quran Seekho • By the Ummah, for the Ummah</p>
           <p className="mt-4 md:mt-0 flex items-center gap-3"><Sparkles size={14} className="text-emerald-700" /> Seek Light</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
