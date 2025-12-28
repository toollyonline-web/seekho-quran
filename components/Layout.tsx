import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Heart, Clock, Search, BookOpen, Settings, Menu, X, Sun, Moon, Bookmark, MessageSquare, Hash, WifiOff } from 'lucide-react';
import InstallPWA from './InstallPWA';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const location = useLocation();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Clock size={20} /> },
    { name: 'Surah', path: '/surah', icon: <BookOpen size={20} /> },
    { name: '99 Names', path: '/names', icon: <Heart size={20} className="text-pink-500" /> },
    { name: 'Tasbeeh', path: '/tasbeeh', icon: <Hash size={20} className="text-orange-500" /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={20} /> },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-green-50 text-slate-900'}`}>
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest z-[70] relative">
          <WifiOff size={12} /> You are currently offline. Some features may be limited.
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-green-100'} backdrop-blur-md`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">QS</div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline">QuranSeekho</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  location.pathname === item.path ? 'text-green-700 dark:text-green-400' : 'hover:text-green-600'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Dark Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-4 px-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 py-2 text-lg font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <InstallPWA />

      {/* Footer / Mobile Tab Bar */}
      <footer className={`mt-auto border-t pb-20 md:pb-8 pt-8 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-green-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-60">© {new Date().getFullYear()} QuranSeekho.online - Guidance for the Ummah.</p>
        </div>
      </footer>

      {/* Mobile Tab Bar (Sticky) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-2 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-green-100'}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full gap-1 ${
              location.pathname === item.path ? 'text-green-700' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Layout;