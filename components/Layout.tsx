
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, 
  Search as SearchIcon, Heart, X, Menu,
  Mail, ShieldCheck, Compass, ArrowUp,
  Settings, Languages, ChevronRight, Info
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

  // Handle body scroll locking when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navItems = [
    { name: t.nav.home, path: '/', icon: <HomeIcon size={20} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={20} /> },
    { name: t.nav.juz, path: '/juz', icon: <Star size={20} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
    { name: t.nav.qibla, path: '/qibla', icon: <Compass size={20} /> },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0d] text-[#f4f5f6] selection:bg-emerald-500/30">
      
      {/* Premium Side Navigation Menu */}
      <div className={`fixed inset-0 z-[600] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-full max-w-[320px] h-full bg-[#0b0c0d] shadow-2xl flex flex-col transition-transform duration-500 ease-out border-l border-white/5 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           
           {/* Menu Header */}
           <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-900/20">QS</div>
                 <span className="font-black text-lg tracking-tight">Menu</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
           </div>
           
           {/* Nav Links */}
           <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/10' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`${isActive ? 'text-white' : 'text-emerald-500 group-hover:scale-110 transition-transform'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm tracking-wide flex-grow">{item.name}</span>
                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </Link>
                );
              })}

              <div className="pt-8 pb-4">
                <div className="h-px bg-white/5 mx-4"></div>
              </div>

              <Link 
                to="/duas"
                className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-slate-400 hover:bg-white/5 transition-all"
              >
                <Heart size={20} className="text-rose-500" />
                <span className="text-sm tracking-wide">Duas & Adhkar</span>
              </Link>
           </nav>

           {/* Menu Footer (Settings) */}
           <div className="p-6 bg-[#0e0f10] border-t border-white/5 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">App Settings</p>
              
              <div className="space-y-2">
                 <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/5">
                    <div className="flex items-center gap-3">
                       <Languages size={16} className="text-emerald-500" />
                       <span>Language</span>
                    </div>
                    <span className="text-emerald-500">English</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/5">
                    <div className="flex items-center gap-3">
                       <Settings size={16} className="text-slate-400" />
                       <span>Preferences</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600" />
                 </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-slate-600">
                <Link to="/privacy" className="text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">Terms</Link>
                <Link to="/about" className="text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors">About</Link>
              </div>
           </div>
        </div>
      </div>

      {/* Modern Fixed Header */}
      <header className={`fixed top-0 z-[400] w-full transition-all duration-500 pt-safe ${scrolled ? 'glass h-20 shadow-2xl shadow-black/40' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className={`w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transition-all duration-500 ${scrolled ? 'scale-90 shadow-emerald-900/40' : 'group-hover:rotate-12'}`}>QS</div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none italic group-hover:text-emerald-500 transition-colors">Quran Seekho</span>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">{currentDateStr}</span>
                 <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Portal</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5 backdrop-blur-xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-black px-6 py-2.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${
                  location.pathname === item.path 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
             <Link to="/search" className="hidden sm:flex w-11 h-11 bg-white/5 items-center justify-center rounded-2xl text-slate-400 hover:text-emerald-500 hover:bg-white/10 transition-all border border-white/5">
                <SearchIcon size={20} />
             </Link>
             <button 
               onClick={() => setIsMenuOpen(true)}
               className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-600 lg:bg-white/5 text-white lg:text-slate-400 hover:text-emerald-500 transition-all border border-emerald-500/20 lg:border-white/5 shadow-xl shadow-emerald-900/20"
             >
               <Menu size={22} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Enhanced Footer */}
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
