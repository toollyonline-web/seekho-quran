
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, BookOpen, Star, Heart, Hash, Sun, Moon, Menu, X, WifiOff, Github, Twitter, Mail, Calendar, Play, Pause, Coins, FileText, Coffee, Shield, MessageSquare, Compass, Gavel } from 'lucide-react';
import InstallPWA from './InstallPWA';
import { getHijriDate } from '../services/quranApi';

interface LayoutProps {
  children: React.ReactNode;
}

type ThemeMode = 'light' | 'dark' | 'sepia';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hijriDate, setHijriDate] = useState('');
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyGlobalTheme(initialTheme);
    setTheme(initialTheme);
    setHijriDate(getHijriDate());
  }, []);

  useEffect(() => {
    // Dynamic Canonical Tag for SEO
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://quranseekho.online${location.pathname}`);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [location.pathname]);

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
    { name: 'Home', path: '/', icon: <Clock size={20} /> },
    { name: 'Surah', path: '/surah', icon: <BookOpen size={20} /> },
    { name: 'Qibla', path: '/qibla', icon: <Compass size={20} className="text-blue-500" /> },
    { name: 'Duas', path: '/duas', icon: <Star size={20} className="text-yellow-500" /> },
    { name: 'Zakat', path: '/zakat', icon: <Coins size={20} className="text-amber-500" /> },
    { name: 'Tasbeeh', path: '/tasbeeh', icon: <Hash size={20} className="text-orange-500" /> },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Quran Seekho",
    "url": "https://quranseekho.online/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://quranseekho.online/surah?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 
        theme === 'sepia' ? 'bg-[#fdf6e3] text-[#5d4037]' : 
        'bg-green-50 text-slate-900'
    }`}>
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {isOffline && (
        <div className="bg-amber-600 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest z-[70] relative">
          <WifiOff size={12} /> Offline Mode - Some features may be limited
        </div>
      )}

      <header className={`sticky top-0 z-50 w-full border-b transition-colors ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#fdf6e3]/90 border-[#eee8d5]' : 
        'bg-white/90 border-green-100'
      } backdrop-blur-md`}>
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

          <div className="flex items-center gap-4">
            <button 
                onClick={cycleTheme} 
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2" 
                aria-label="Cycle Theme"
            >
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'sepia' && <Coffee size={20} />}
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{theme}</span>
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

      <footer className={`mt-20 border-t pt-16 pb-24 md:pb-12 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#eee8d5] border-[#fdf6e3]' : 
        'bg-white border-green-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl">QS</div>
                <span className="font-bold text-2xl tracking-tight">Quran Seekho</span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-sm">
                Empowering the Ummah with knowledge. A clean, modern platform for Quranic studies, daily dhikr, and spiritual growth.
              </p>
              
              <div className="pt-4">
                <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Stay Connected</h5>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-green-600 transition-all hover:scale-110 shadow-sm"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-green-600 transition-all hover:scale-110 shadow-sm"><Github size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-green-600 transition-all hover:scale-110 shadow-sm"><Mail size={18} /></a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-green-700 dark:text-green-400">Library</h4>
              <ul className="space-y-4">
                <li><Link to="/surah" className="text-slate-500 hover:text-green-600 transition-colors">All Surahs</Link></li>
                <li><Link to="/juz" className="text-slate-500 hover:text-green-600 transition-colors">By Juz</Link></li>
                <li><Link to="/names" className="text-slate-500 hover:text-green-600 transition-colors">99 Names</Link></li>
                <li><Link to="/calendar" className="text-slate-500 hover:text-green-600 transition-colors">Hijri Calendar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-green-700 dark:text-green-400">Tools</h4>
              <ul className="space-y-4">
                <li><Link to="/tasbeeh" className="text-slate-500 hover:text-green-600 transition-colors">Tasbeeh</Link></li>
                <li><Link to="/zakat" className="text-slate-500 hover:text-green-600 transition-colors">Zakat Calc</Link></li>
                <li><Link to="/bookmarks" className="text-slate-500 hover:text-green-600 transition-colors">Bookmarks</Link></li>
                <li><Link to="/qibla" className="text-slate-500 hover:text-green-600 transition-colors">Qibla Finder</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-green-700 dark:text-green-400">Support</h4>
              <ul className="space-y-4 mb-6">
                <li><Link to="/privacy" className="text-slate-500 hover:text-green-600 transition-colors flex items-center gap-2">Privacy Policy <Shield size={14} /></Link></li>
                <li><Link to="/terms" className="text-slate-500 hover:text-green-600 transition-colors flex items-center gap-2">Terms & Conditions <Gavel size={14} /></Link></li>
                <li><Link to="/feedback" className="text-slate-500 hover:text-green-600 transition-colors flex items-center gap-2">Give Feedback <MessageSquare size={14} /></Link></li>
                <li><Link to="/about" className="text-slate-500 hover:text-green-600 transition-colors">About Us</Link></li>
              </ul>
              <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-2xl border border-green-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase mb-2">Help the Project</p>
                <p className="text-xs text-slate-500 mb-4 leading-tight">Quran Seekho is ad-free and open-source. Consider donating.</p>
                <Link to="/donate" className="block w-full py-2 bg-green-700 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors text-center">Donate Now</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-slate-500">© {new Date().getFullYear()} Quran Seekho</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">v1.0.7-Production</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Made with</span>
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>for the Ummah</span>
            </div>
          </div>
        </div>
      </footer>

      <div className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-2 z-[100] ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#fdf6e3] border-[#eee8d5]' : 
        'bg-white border-green-100'
      } backdrop-blur-lg shadow-2xl`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full gap-1 transition-all ${
              location.pathname === item.path ? 'text-green-700 dark:text-green-400 scale-110' : 'text-slate-400'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 22 })}
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Layout;
