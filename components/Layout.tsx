
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, Sun, Moon, 
  Search as SearchIcon, Heart, Coffee, X, Sliders, Sparkles, Compass, Menu,
  Mail, ShieldCheck, Globe, MessageSquare, ExternalLink, Github, Twitter, Facebook
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
    const savedTheme = (localStorage.getItem('theme') as any) || 'light';
    const savedLang = (localStorage.getItem('language') as Language) || 'en';
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
    { name: t.nav.juz, path: '/juz', icon: <Star size={20} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0c0d] transition-colors duration-500 overflow-x-hidden">
      
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 flex items-center justify-between border-b dark:border-white/5">
              <h2 className="text-2xl font-black italic tracking-tighter dark:text-white flex items-center gap-3">
                <Sliders className="text-emerald-700" size={24} /> {t.ui.settings}
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full dark:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-10 overflow-y-auto flex-1 text-slate-900 dark:text-white">
              <section className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Language</p>
                <div className="grid grid-cols-1 gap-3">
                  {['en', 'ur', 'ar'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => { setLanguage(l as Language); localStorage.setItem('language', l); window.location.reload(); }}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between font-bold text-sm ${language === l ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent'}`}
                    >
                      <span>{l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'العربية'}</span>
                      {language === l && <Sparkles size={16} fill="currentColor" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Atmosphere</p>
                 <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'sepia'].map((mode) => (
                      <button 
                        key={mode}
                        onClick={() => { setTheme(mode as any); applyTheme(mode); localStorage.setItem('theme', mode); }}
                        className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${theme === mode ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-800'}`}
                      >
                        {mode === 'light' ? <Sun size={20} className="text-amber-500" /> : mode === 'dark' ? <Moon size={20} className="text-blue-400" /> : <Coffee size={20} className="text-amber-700" />}
                      </button>
                    ))}
                 </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Sticky Header */}
      <header className={`fixed top-0 z-[400] w-full transition-all duration-300 pt-safe ${scrolled ? 'glass h-20 shadow-lg' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:rotate-12 transition-transform">QS</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none dark:text-white">Quran Seekho</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{currentDateStr}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1 rounded-full backdrop-blur-md border border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-5 py-2.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-emerald-600 text-white shadow-xl scale-105' 
                    : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="hidden sm:flex items-center gap-2 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-emerald-600 transition-all shadow-sm">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-emerald-600 transition-all shadow-sm">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-grow pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Improved Mega Footer */}
      <footer className="bg-white dark:bg-[#0f1112] border-t dark:border-white/5 mt-20 pb-40 lg:pb-10 pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Column 1: Brand & Vision */}
            <div className="col-span-2 lg:col-span-1 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">QS</div>
                <span className="font-black text-lg tracking-tight dark:text-white">Quran Seekho</span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
                "Experience the word of Allah in its purest digital form. Ad-free, private, and global."
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Twitter size={18} />, path: '#' },
                  { icon: <Github size={18} />, path: '#' },
                  { icon: <Mail size={18} />, path: 'mailto:support@quranseekho.online' }
                ].map((social, i) => (
                  <a key={i} href={social.path} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Library</h4>
              <ul className="space-y-3">
                <li><Link to="/surah" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Surah List</Link></li>
                <li><Link to="/juz" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Juz (Sipara)</Link></li>
                <li><Link to="/search" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Verse Search</Link></li>
                <li><Link to="/bookmarks" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">My Bookmarks</Link></li>
              </ul>
            </div>

            {/* Column 3: Tools */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Spiritual Tools</h4>
              <ul className="space-y-3">
                <li><Link to="/tasbeeh" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Digital Tasbeeh</Link></li>
                <li><Link to="/qibla" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Qibla Finder</Link></li>
                <li><Link to="/zakat" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Zakat Calculator</Link></li>
                <li><Link to="/calendar" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Islamic Calendar</Link></li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/duas" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Dua & Adhkar</Link></li>
                <li><Link to="/hadith" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Hadith Library</Link></li>
                <li><Link to="/names" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Asma-ul-Husna</Link></li>
                <li><Link to="/prophetic-stories" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Prophetic Stories</Link></li>
              </ul>
            </div>

            {/* Column 5: Support */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Foundation</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">About the Vision</Link></li>
                <li><Link to="/donate" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-black flex items-center gap-2 animate-pulse">Support Us <Heart size={12} fill="currentColor" /></Link></li>
                <li><Link to="/feedback" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Send Feedback</Link></li>
                <li><Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-bold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Branding Bar */}
          <div className="pt-10 border-t dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck size={14} className="text-emerald-600" /> A Sadaqah Jariyah Project
              </p>
              <p className="text-[10px] text-slate-500 font-medium">© {new Date().getFullYear()} Quran Seekho Foundation. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-xs font-black dark:text-white flex items-center gap-2 italic">
                Built with Love by <span className="text-emerald-600">Huzaifa Bin Sardar</span>
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Guided by faith, powered by code</p>
            </div>
          </div>
        </div>
      </footer>

      <InstallPWA />

      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[450] h-18 glass rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-around px-2 border border-white/30 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-grow transition-all duration-300 relative ${
                active ? 'text-emerald-600 dark:text-emerald-400 -translate-y-1' : 'text-slate-400'
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-emerald-600/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
              {active && <div className="absolute -bottom-1 w-1 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse"></div>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
