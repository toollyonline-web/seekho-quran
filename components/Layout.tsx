
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, BookOpen, Star, Hash, 
  Search as SearchIcon, Heart, X, Menu,
  Mail, ShieldCheck, Compass, ArrowUp,
  Settings, Languages, ChevronRight, Info, ExternalLink, Github,
  Globe, Sparkles
} from 'lucide-react';
import InstallPWA from './InstallPWA';
import { translations, Language } from '../services/i18n';

interface LayoutProps { children: React.ReactNode; }

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const navItems = [
    { name: t.nav.home, path: '/', icon: <HomeIcon size={20} /> },
    { name: t.nav.surah, path: '/surah', icon: <BookOpen size={20} /> },
    { name: t.nav.miracles, path: '/miracles', icon: <Sparkles size={20} /> },
    { name: t.nav.juz, path: '/juz', icon: <Star size={20} /> },
    { name: t.nav.search, path: '/search', icon: <SearchIcon size={20} /> },
    { name: t.nav.tasbeeh, path: '/tasbeeh', icon: <Hash size={20} /> },
    { name: t.nav.qibla, path: '/qibla', icon: <Compass size={20} /> },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0d] text-[#f4f5f6] selection:bg-emerald-500/30">
      
      {/* Premium Side Navigation Menu */}
      <div className={`fixed inset-0 z-[600] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-full max-w-[340px] h-full bg-[#0b0c0d] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-500 ease-out border-l border-white/5 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           
           {/* Sidebar Branding */}
           <div className="p-8 flex items-center justify-between border-b border-white/5 bg-[#0e0f10]">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)] ring-1 ring-white/10">QS</div>
                 <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight leading-none italic">Quran Seekho</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-1.5">User Portal</span>
                 </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
           </div>
           
           {/* Scrollable Nav Links */}
           <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-2 mb-4">Main Menu</p>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-5 px-5 py-4.5 rounded-2xl font-black text-sm transition-all group ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`${isActive ? 'text-white' : 'text-emerald-500 group-hover:scale-110 transition-transform'}`}>
                      {item.icon}
                    </span>
                    <span className="tracking-widest uppercase text-xs flex-grow">{item.name}</span>
                    {isActive && <ChevronRight size={16} className="text-white/50" />}
                  </Link>
                );
              })}

              <div className="pt-8 pb-4">
                <div className="h-px bg-white/5 mx-2"></div>
              </div>

              <Link 
                to="/duas"
                className="flex items-center gap-5 px-5 py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all group"
              >
                <Heart size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
                <span>Duas & Adhkar</span>
              </Link>
           </nav>

           {/* Sidebar Controls Footer */}
           <div className="p-8 bg-[#0e0f10] border-t border-white/5 space-y-6">
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-between p-4.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <Languages size={18} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
                       <span>Switch Language</span>
                    </div>
                    <span className="text-emerald-500">English</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-4.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <Settings size={18} className="text-slate-400 group-hover:rotate-45 transition-transform" />
                       <span>Preferences</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600" />
                 </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-slate-600">
                <Link to="/privacy" className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Terms</Link>
                <Link to="/about" className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">About</Link>
              </div>
           </div>
        </div>
      </div>

      {/* Modern Fixed Header */}
      <header className={`fixed top-0 z-[400] w-full transition-all duration-500 pt-safe ${scrolled ? 'glass h-16 md:h-20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]' : 'bg-transparent h-20 md:h-26'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          
          {/* Enhanced Logo Area */}
          <Link to="/" className="flex items-center gap-3 md:gap-5 group">
            <div className={`aspect-square bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black shadow-[0_8px_25px_-5px_rgba(16,185,129,0.5)] transition-all duration-500 ring-1 ring-white/20 relative overflow-hidden ${scrolled ? 'w-9 h-9 md:w-11 md:h-11 text-base md:text-xl scale-95' : 'w-12 h-12 md:w-14 md:h-14 text-2xl md:text-3xl group-hover:rotate-6'}`}>
              <span className="relative z-10">QS</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-black tracking-tighter leading-none italic transition-all duration-300 group-hover:text-emerald-500 ${scrolled ? 'text-lg md:text-2xl' : 'text-2xl md:text-3xl'}`}>Quran Seekho</span>
              {!scrolled && (
                <div className="hidden sm:flex items-center gap-3 mt-1.5 animate-in fade-in slide-in-from-left-2 duration-700">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{currentDateStr}</span>
                   <div className="w-1.5 h-1.5 bg-white/10 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Prophetic Hub</span>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Adaptive Navigation */}
          <nav className="hidden xl:flex items-center gap-2 bg-white/5 p-1.5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 font-black px-6 py-2.5 rounded-full transition-all text-[11px] uppercase tracking-[0.2em] ${
                  location.pathname === item.path 
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, { size: 14 })}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2 md:gap-4">
             <Link 
               to="/search" 
               className={`hidden sm:flex w-11 h-11 md:w-13 md:h-13 bg-white/5 items-center justify-center rounded-2xl text-slate-400 hover:text-emerald-500 hover:bg-white/10 transition-all border border-white/5 group ${scrolled ? 'scale-90' : ''}`}
             >
                <SearchIcon size={22} className="group-hover:scale-110 transition-transform" />
             </Link>
             <button 
               onClick={() => setIsMenuOpen(true)}
               className={`w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-2xl bg-emerald-600 text-white transition-all border border-emerald-400/20 shadow-[0_8px_30px_-5px_rgba(5,150,105,0.4)] active:scale-90 relative overflow-hidden group ${scrolled ? 'scale-90' : ''}`}
             >
               <Menu size={24} className="relative z-10" />
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
          </div>
        </div>
      </header>

      {/* Main Page Slot */}
      <main className="flex-grow pt-28 md:pt-40 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* PREMIUM FOOTER */}
      <footer className="relative bg-[#090a0b] border-t border-white/5 mt-32 overflow-hidden">
        {/* Artistic Watermark */}
        <div className="absolute top-0 right-0 p-24 opacity-[0.01] pointer-events-none select-none">
           <span className="text-[30rem] font-black italic leading-none">QS</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            
            {/* Branding Column */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                <Link to="/" className="flex items-center gap-5 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-[0_12px_40px_-8px_rgba(16,185,129,0.3)] transition-transform group-hover:rotate-6 ring-1 ring-white/10">QS</div>
                  <div className="flex flex-col">
                    <span className="font-black text-3xl tracking-tighter italic text-white leading-none">Quran Seekho</span>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mt-3">Pure Digital Sanctuary</span>
                  </div>
                </Link>
                <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-md italic">
                  "A volunteer-led effort dedicated to providing the most beautiful and accessible digital experience for the Noble Quran."
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                  <ShieldCheck size={16} className="text-emerald-500" /> Ad-Free Space
                </div>
                <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                  <Heart size={16} className="text-rose-500" /> 100% Voluntary
                </div>
                <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                  <Globe size={16} className="text-blue-500" /> Worldwide
                </div>
              </div>
            </div>

            {/* Link Navigation Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-emerald-500/80">Revelation</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-400">
                  <li><Link to="/surah" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Surah List <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/miracles" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Miracles Index <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/juz" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Juz browser <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/hadith" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Hadith Hub <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                </ul>
              </div>
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-emerald-500/80">Services</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-400">
                  <li><Link to="/tasbeeh" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Tasbeeh <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/qibla" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Qibla Finder <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/zakat" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Zakat Calc <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                  <li><Link to="/calendar" className="hover:text-emerald-400 hover:translate-x-1 transition-all flex items-center gap-3 group">Calendar <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all"/></Link></li>
                </ul>
              </div>
              <div className="space-y-10 col-span-2 md:col-span-1">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-emerald-500/80">Support</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-400">
                  <li><Link to="/about" className="hover:text-white transition-all">About Team</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-all">Legal Privacy</Link></li>
                  <li><Link to="/feedback" className="hover:text-white transition-all">Feedback</Link></li>
                  <li><Link to="/donate" className="text-emerald-500 hover:text-emerald-400 flex items-center gap-3 font-black group transition-all">Support Now <Heart size={16} className="fill-current group-hover:scale-125 transition-transform" /></Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar Footer */}
          <div className="pt-20 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
               <div className="space-y-2">
                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Official Contact</p>
                 <a href="mailto:support@quranseekho.online" className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-emerald-500 transition-colors">
                    <Mail size={18} /> support@quranseekho.online
                 </a>
               </div>
               <div className="h-10 w-px bg-white/5 hidden md:block"></div>
               <div className="space-y-2">
                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Development</p>
                 <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Github size={18} /> Source</span>
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter ring-1 ring-emerald-500/20">v1.0.8-Official</span>
                 </div>
               </div>
            </div>
            
            <div className="flex flex-col items-center lg:items-end gap-8">
              <button 
                onClick={scrollToTop} 
                className="flex items-center gap-4 px-10 py-5 bg-white/5 rounded-[2.5rem] hover:bg-emerald-600 hover:text-white transition-all border border-white/5 group shadow-2xl active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Scroll to top</span>
                <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[1.5rem] border border-white/5">
                Designed with <Heart size={14} className="text-rose-500 fill-current animate-pulse" /> by <span className="text-white italic font-black">Huzaifa Bin Sardar</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-[11px] font-black uppercase tracking-[0.8em] text-slate-800">
             © {new Date().getFullYear()} Quran Seekho • All Rights Reserved
          </div>
        </div>
      </footer>

      <InstallPWA />
    </div>
  );
};

export default Layout;
