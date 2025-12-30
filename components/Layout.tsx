
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
  const location = useLocation();

  const t = translations[language];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as any || 'light';
    const savedLang = localStorage.getItem('language') as Language || 'en';
    
    setTheme(savedTheme);
    setLanguage(savedLang);
    applyTheme(savedTheme);
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
    { name: t.nav.duas, path: '/duas', icon: <Star size={22} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={22} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Settings Sheet */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-2xl font-black flex items-center gap-2 dark:text-white"><Sliders className="text-emerald-600" /> {t.ui.settings}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.ui.language}</p>
                <div className="grid grid-cols-1 gap-3">
                  {['en', 'ur', 'ar'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => { setLanguage(l as Language); localStorage.setItem('language', l); window.location.reload(); }}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${language === l ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent dark:text-white'}`}
                    >
                      <span className="font-bold">{l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'العربية'}</span>
                      {language === l && <Star size={16} fill="white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <header className="sticky top-0 z-[100] w-full glass shadow-sm safe-top">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl shadow-emerald-900/20 group-hover:rotate-6 transition-transform">QS</div>
            <div className="hidden xs:flex flex-col">
              <span className="font-black text-lg md:text-xl tracking-tight leading-none dark:text-white">Quran Seekho</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">Sacred Journey</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-2xl transition-all ${
                  location.pathname === item.path 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 md:p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-600 transition-all">
              {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Coffee size={20} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 md:p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-600 transition-all">
              <Languages size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full pt-4 md:pt-8 pb-32 md:pb-16 px-4 md:px-0">
        {children}
      </main>

      <InstallPWA />

      {/* Mobile Floating Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 md:left-6 md:right-6 z-[150] h-20 glass rounded-[2.5rem] shadow-2xl flex items-center justify-around px-2 border border-white/20 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-grow transition-all ${
                active ? 'text-emerald-700 dark:text-emerald-400 -translate-y-1' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-emerald-600/10 shadow-inner' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Professional Footer */}
      <footer className="bg-slate-900 text-white py-16 md:py-20 px-4 md:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black">QS</div>
              <span className="text-2xl font-black">Quran Seekho</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Illuminate your heart with the final revelation. No ads, no trackers, purely for the service of the Ummah.</p>
            <div className="flex gap-4">
              <Link to="/donate" className="text-emerald-400 font-bold text-sm hover:underline flex items-center gap-2">
                <Heart size={16} fill="currentColor" /> Support Us
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-500 mb-6">SACRED LIBRARY</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/surah" className="hover:text-white transition-colors">Complete Surah List</Link></li>
              <li><Link to="/juz" className="hover:text-white transition-colors">Browse by Juz</Link></li>
              <li><Link to="/hadith" className="hover:text-white transition-colors">40 Hadith Collection</Link></li>
              <li><Link to="/names" className="hover:text-white transition-colors">99 Names of Allah</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-500 mb-6">TOOLS</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/qibla" className="hover:text-white transition-colors">Qibla Direction</Link></li>
              <li><Link to="/tasbeeh" className="hover:text-white transition-colors">Digital Tasbeeh</Link></li>
              <li><Link to="/zakat" className="hover:text-white transition-colors">Zakat Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-500 mb-6">PLATFORM</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Mission</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">Submit Feedback</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
           <p>© {new Date().getFullYear()} QURAN SEEKHO PLATFORM</p>
           <p className="mt-4 md:mt-0 flex items-center gap-2"><Sparkles size={12} className="text-emerald-500" /> FOR THE GLOBAL UMMAH</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
