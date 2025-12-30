
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
import ZakatCalculator from './pages/ZakatCalculator';
import IslamicCalendar from './pages/IslamicCalendar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Feedback from './pages/Feedback';
import { Heart, Globe, ShieldCheck, Mail, Share2, MessageSquare } from 'lucide-react';

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
        <div className="w-20 h-20 bg-green-700 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-green-900/20">QS</div>
        <h1 className="text-4xl font-bold mb-4">About Quran Seekho</h1>
        <p className="text-xl text-slate-500 italic max-w-2xl mx-auto">"Guiding the hearts through the light of the Noble Quran."</p>
        <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Release v1.0.6-Testing</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-2xl flex items-center justify-center mb-6"><Globe size={24} /></div>
          <h2 className="text-xl font-bold mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Quran Seekho was built with a simple goal: to provide a distraction-free, ad-free, and high-quality digital experience for reading and understanding the Holy Quran. We believe the message of Allah should be accessible to everyone, everywhere.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-700 rounded-2xl flex items-center justify-center mb-6"><Heart size={24} /></div>
          <h2 className="text-xl font-bold mb-4">Pure Experience</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We do not display ads, and we do not sell your data. This platform is a Sadaqah Jariyah project designed for the Ummah. Every feature is crafted to help you focus on spiritual growth and learning.
          </p>
        </div>
      </div>

      <div className="bg-green-800 text-white p-10 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Open for the World</h2>
          <p className="max-w-xl mx-auto opacity-90 mb-8">
            This platform is community-driven. If you find this app helpful, please share it with others so they can also benefit from the word of Allah.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleShareApp}
              className="px-8 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <Share2 size={18} /> Share App
            </button>
            <Link to="/feedback" className="px-8 py-3 bg-green-700 text-white border border-green-600 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2">
              <MessageSquare size={18} /> Give Feedback
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
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
          <Route path="/surah" element={<SurahList />} />
          <Route path="/surah/:id" element={<SurahReader />} />
          <Route path="/juz" element={<JuzList />} />
          <Route path="/juz/:id" element={<SurahReader />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/names" element={<AsmaUlHusna />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
          <Route path="/duas" element={<DuaLibrary />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/calendar" element={<IslamicCalendar />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
