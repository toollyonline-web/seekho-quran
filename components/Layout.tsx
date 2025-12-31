
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, 
  Search as SearchIcon, Heart, X, Menu,
  Mail, ShieldCheck, Compass, ArrowUp
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Premium Re-designed Footer */}
      <footer className="relative bg-[#090a0b] border-t border-white/5 mt-32 pb-16 pt-24 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none select-none">
           <span className="text-[20rem] font-black italic leading-none">QS</span>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
            
            {/* Branding Pillar */}
            <div className="max-w-xs space-y-8">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-transform group-hover:rotate-6">QS</div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tighter italic">Quran Seekho</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Pure Revelation</span>
                </div>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                A volunteer-driven digital portal to the Holy Quran, designed to bridge faith and modern accessibility without distractions.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 w-fit">
                <ShieldCheck size={14} className="text-emerald-500" /> Ad-Free & Privacy Focused
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Reading</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li><Link to="/surah" className="hover:text-white hover:translate-x-1 transition-all block">Surah Index</Link></li>
                  <li><Link to="/juz" className="hover:text-white hover:translate-x-1 transition-all block">Juz Browser</Link></li>
                  <li><Link to="/search" className="hover:text-white hover:translate-x-1 transition-all block">Verse Discovery</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Tools</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li><Link to="/tasbeeh" className="hover:text-white hover:translate-x-1 transition-all block">Tasbeeh Counter</Link></li>
                  <li><Link to="/qibla" className="hover:text-white hover:translate-x-1 transition-all block">Qibla Finder</Link></li>
                  <li><Link to="/zakat" className="hover:text-white hover:translate-x-1 transition-all block">Zakat Calculator</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Foundation</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all block">Our Mission</Link></li>
                  <li><Link to="/privacy" className="hover:text-white hover:translate-x-1 transition-all block">Privacy Policy</Link></li>
                  <li><Link to="/donate" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 group transition-all">
                    Support <Heart size={14} className="group-hover:fill-current" />
                  </Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
               <a href="mailto:support@quranseekho.online" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors">
                  <Mail size={16} /> support@quranseekho.online
               </a>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  © {new Date().getFullYear()} Quran Seekho
               </div>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all border border-white/5 group shadow-xl"
              aria-label="Back to top"
            >
              <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
            </button>

            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Developed by <span className="text-white italic font-black underline decoration-emerald-500/50 underline-offset-4">Huzaifa Bin Sardar</span>
            </div>
          </div>
        </div>
      </footer>

      <InstallPWA />
    </div>
  );
};

export default Layout;
