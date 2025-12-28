
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahReader from './pages/SurahReader';
import JuzList from './pages/JuzList';
import Bookmarks from './pages/Bookmarks';
import Learn from './pages/Learn';
import AsmaUlHusna from './pages/AsmaUlHusna';
import Tasbeeh from './pages/Tasbeeh';

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
          <Route path="/about" element={<div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">About QuranSeekho</h1>
            <p className="max-w-xl mx-auto text-slate-500">
              QuranSeekho.online is a dedicated platform for Muslims around the world to read, learn, and grow spiritually.
              Our goal is to provide a clean, accessible, and high-quality digital experience for the Holy Quran.
            </p>
          </div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
