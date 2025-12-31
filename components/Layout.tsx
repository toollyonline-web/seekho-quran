
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, 
  Search as SearchIcon, Heart, X, Menu,
  Mail, ShieldCheck, Github, Twitter, Compass, MapPin
} from 'lucide-react';
import InstallPWA from './InstallPWA';
import { translations, Language } from '../services/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const language: Language = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[language] || translations['en'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    // Close menu on route change
    setIsMenuOpen(false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const navItems = [
    { name: t.nav.home, path: '/', icon: <HomeIcon size={18} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={18} /> },
    { name: t.nav.juz, path: '/juz', icon: <Star size={18} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={18} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={18} /> },
    { name: t.nav.qibla, path: '/qibla', icon: <Compass size={18} /> },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0d] text-[#f4f5f6] selection:bg-emerald-500/30">
      
      {/* Side Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-full max-w-xs h-full bg-[#0f1112] shadow-2xl p-8 space-y-10 animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm">QS</div>
                   <span className="font-bold">Menu</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
             </div>
             
             <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                      location.pathname === item.path ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
             </nav>

             <div className="pt-10 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings</p>
                <div className="flex flex-col gap-2">
                   <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl text-sm font-bold">
                      Language <span>English</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <header className={`fixed top-0 z-[400] w-full transition-all duration-300 pt-safe ${scrolled ? 'glass h-20' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-12">QS</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none">Quran Seekho</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{currentDateStr}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-5 py-2.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-emerald-500'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-500 transition-all border border-white/5 shadow-xl"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Production Footer */}
      <footer className="bg-[#0f1112] border-t border-white/5 mt-20 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl">QS</div>
                <span className="font-black text-lg tracking-tight">Quran Seekho</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                A non-profit digital gateway to the divine revelation, designed for the modern seeker.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-400">
                <li><Link to="/surah" className="hover:text-emerald-500 transition-colors">Surah List</Link></li>
                <li><Link to="/juz" className="hover:text-emerald-500 transition-colors">Juz (Sipara)</Link></li>
                <li><Link to="/search" className="hover:text-emerald-500 transition-colors">Verse Search</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Foundation</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-400">
                <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Mission</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/donate" className="text-emerald-500 hover:underline flex items-center gap-2">Sadaqah Jariyah <Heart size={12} fill="currentColor" /></Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</h4>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Twitter size={18} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Github size={18} /></a>
                <a href="mailto:support@quranseekho.online" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Mail size={18} /></a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-600" /> Secure & Ad-Free
            </div>
            <div className="flex items-center gap-2 italic">
              Crafted by <span className="text-[#f4f5f6]">Huzaifa Bin Sardar</span>
            </div>
          </div>
        </div>
      </footer>

      <InstallPWA />
    </div>
  );
};

export default Layout;
