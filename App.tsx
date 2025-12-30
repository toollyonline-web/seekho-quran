
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahReader from './pages/SurahReader';
import JuzList from './pages/JuzList';
import Bookmarks from './pages/Bookmarks';
import Learn from './pages/Learn';
import AsmaUlHusna from './pages/AsmaUlHusna';
import Tasbeeh from './pages/Tasbeeh';
import DuaLibrary from './pages/DuaLibrary';
import HadithLibrary from './pages/HadithLibrary';
import PropheticStories from './pages/PropheticStories';
import ZakatCalculator from './pages/ZakatCalculator';
import IslamicCalendar from './pages/IslamicCalendar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Feedback from './pages/Feedback';
import Donation from './pages/Donation';
import QiblaFinder from './pages/QiblaFinder';
import Search from './pages/Search';
import { Heart, Globe, ShieldCheck, Mail, Share2, MessageSquare, User, Code2, Sparkles, Coffee } from 'lucide-react';

const AboutPage = () => {
  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quran Seekho - Read Quran Online',
          text: 'Explore the Holy Quran with translations and daily Islamic tools on Quran Seekho.',
          url: 'https://quranseekho.online/',
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText('https://quranseekho.online/');
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-green-700 rounded-[2rem] flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-2xl shadow-green-900/30 transform -rotate-3 hover:rotate-0 transition-transform">QS</div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Meet the Vision</h1>
        <p className="text-xl text-slate-500 italic max-w-2xl mx-auto leading-relaxed">"Guiding the hearts through the light of the Noble Quran."</p>
        <div className="mt-4 inline-block px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Release v1.0.8-Official</div>
      </div>

      <section className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border dark:border-slate-700 shadow-sm mb-12 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4 flex justify-center">
             <div className="w-48 h-48 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-slate-300 relative group overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
                <User size={80} className="group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-green-700/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
          </div>
          <div className="md:col-span-8 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Huzaifa Bin Sardar</h2>
              <p className="text-green-600 dark:text-green-400 font-bold uppercase tracking-widest text-xs">Founder & Lead Developer</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Assalamu Alaikum! My name is <strong>Huzaifa Bin Sardar</strong>. I am a developer with a deep passion for the intersection of technology and faith. I created <strong>Quran Seekho</strong> because I believe that the digital experience of reading the Word of Allah should be as pure and beautiful as the message itself.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold border dark:border-slate-700 flex items-center gap-2"><Code2 size={14} className="text-blue-500" /> Full-Stack Dev</span>
              <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold border dark:border-slate-700 flex items-center gap-2"><Sparkles size={14} className="text-yellow-500" /> UI/UX Focused</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <Heart size={300} strokeWidth={1} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700 shadow-sm group hover:border-green-400 transition-all">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Globe size={24} /></div>
          <h2 className="text-xl font-bold mb-4">The Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            I built this app to solve a problem: many Quran apps are cluttered with ads and trackers. Quran Seekho is a safe, distraction-free space for everyone—from children learning the alphabet to students studying deep translations.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700 shadow-sm group hover:border-rose-400 transition-all">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
          <h2 className="text-xl font-bold mb-4">Ad-Free Forever</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Every line of code I've written is intended as a Sadaqah Jariyah. I do not show ads, I do not sell your data, and I never will. My goal is simple: helping the Ummah connect with the Quran effortlessly.
          </p>
        </div>
      </div>

      <section className="bg-green-800 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Coffee size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6">Keep the Light Glowing</h2>
          <p className="max-w-2xl mx-auto opacity-90 mb-10 text-lg leading-relaxed">
            Running a global platform involves costs for high-speed servers, reliable APIs, and maintenance. If Quran Seekho has touched your heart or helped your learning, consider supporting its growth. Every donation is a contribution to a project dedicated solely to the service of Allah's book.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/donate" className="px-10 py-4 bg-white text-green-800 rounded-2xl font-black hover:bg-green-50 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3">
              <Heart size={20} fill="currentColor" /> Support the Project
            </Link>
            <button 
              onClick={handleShareApp}
              className="px-10 py-4 bg-green-700 text-white border border-green-600/50 rounded-2xl font-black hover:bg-green-600 transition-all flex items-center gap-3"
            >
              <Share2 size={20} /> Share with Ummah
            </button>
          </div>
          <p className="mt-12 text-xs opacity-60 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Secure & Voluntary Contributions
          </p>
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48 blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/10 rounded-full -mr-48 -mb-48 blur-[100px]"></div>
      </section>

      <div className="mt-12 text-center">
         <Link to="/feedback" className="text-slate-400 hover:text-green-700 font-bold text-sm flex items-center justify-center gap-2">
            <MessageSquare size={16} /> Have a suggestion? Let me know
         </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/surah" element={<SurahList />} />
          <Route path="/surah/:id" element={<SurahReader />} />
          <Route path="/juz" element={<JuzList />} />
          <Route path="/juz/:id" element={<SurahReader />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/names" element={<AsmaUlHusna />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
          <Route path="/duas" element={<DuaLibrary />} />
          <Route path="/hadith" element={<HadithLibrary />} />
          <Route path="/prophetic-stories" element={<PropheticStories />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/calendar" element={<IslamicCalendar />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/donate" element={<Donation />} />
          <Route path="/qibla" element={<QiblaFinder />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
