
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Route path="/about" element={<div className="text-center py-20 px-4">
            <h1 className="text-3xl font-bold mb-4">About QuranSeekho</h1>
            <p className="max-w-xl mx-auto text-slate-500 leading-relaxed">
              QuranSeekho.online is a modern, open-source platform dedicated to making the Holy Quran accessible, 
              readable, and understandable for everyone. No ads, no distractions, just pure guidance.
            </p>
          </div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
