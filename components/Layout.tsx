
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, BookOpen, Star, Heart, Hash, Sun, Moon, Menu, X, WifiOff, Calendar, Play, Pause, Coins, FileText, Coffee, Shield, MessageSquare, Compass, Gavel, Quote, ArrowRight, Book, Sparkles } from 'lucide-react';
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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 
        theme === 'sepia' ? 'bg-[#fdf6e3] text-[#5d4037]' : 
        'bg-green-50 text-slate-900'
    }`}>
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

      <footer className={`mt-20 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 
        theme === 'sepia' ? 'bg-[#eee8d5]' : 
        'bg-white'
      } border-t dark:border-slate-800 overflow-hidden`}>
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Brand Identity & Mission */}
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
                    Support the Mission <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                  <Heart size={80} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
              
              <div className="space-y-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">The Library</h4>
                <ul className="space-y-4">
                  <li><Link to="/surah" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> All Surahs</Link></li>
                  <li><Link to="/juz" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Browse Juz</Link></li>
                  <li><Link to="/hadith" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> 40 Hadith</Link></li>
                  <li><Link to="/prophetic-stories" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group font-bold"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Prophetic Stories</Link></li>
                  <li><Link to="/names" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Book size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> 99 Names</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">Islamic Tools</h4>
                <ul className="space-y-4">
                  <li><Link to="/tasbeeh" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Hash size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Tasbeeh Counter</Link></li>
                  <li><Link to="/duas" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Star size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Dua Library</Link></li>
                  <li><Link to="/zakat" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Coins size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Zakat Calculator</Link></li>
                  <li><Link to="/qibla" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Compass size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Qibla Finder</Link></li>
                  <li><Link to="/calendar" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group"><Calendar size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Hijri Calendar</Link></li>
                </ul>
              </div>

              <div className="space-y-6 md:col-span-1 col-span-2">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-green-700 dark:text-green-400">Platform</h4>
                <ul className="space-y-4">
                  <li><Link to="/about" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all">About Our Mission</Link></li>
                  <li><Link to="/feedback" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group">Tester Feedback <MessageSquare size={14} /></Link></li>
                  <li><Link to="/privacy" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group">Privacy Policy <Shield size={14} /></Link></li>
                  <li><Link to="/terms" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center gap-2 group">Terms of Service <Gavel size={14} /></Link></li>
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
                Sadaqah Jariyah Project
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none translate-x-20 translate-y-20">
          <Book size={600} strokeWidth={0.5} />
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-2 z-[100] ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#fdf6e3]/90 border-[#eee8d5]' : 
        'bg-white/90 border-green-100'
      } backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.05)]`}>
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
