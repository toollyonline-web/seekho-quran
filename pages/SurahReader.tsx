
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSurahDetail } from '../services/quranApi';
import { ChevronLeft, ChevronRight, Settings, Languages, Type, Play, Pause } from 'lucide-react';

const SurahReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [fontSize, setFontSize] = useState(32);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const loadSurah = async () => {
      setLoading(true);
      if (id) {
        const detail = await fetchSurahDetail(parseInt(id));
        setData(detail);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadSurah();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <div>Surah not found.</div>;

  const arabic = data[0];
  const english = data[1];
  const urdu = data[2];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Surah Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <Link to={`/surah/${parseInt(id!) - 1}`} className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) <= 1 ? 'invisible' : ''}`}>
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-widest mb-1">Surah {id}</p>
            <h1 className="text-3xl font-bold">{arabic.englishName}</h1>
            <p className="text-slate-500 dark:text-slate-400">{arabic.englishNameTranslation} • {arabic.revelationType}</p>
          </div>
          <Link to={`/surah/${parseInt(id!) + 1}`} className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-slate-700 transition-colors ${parseInt(id!) >= 114 ? 'invisible' : ''}`}>
            <ChevronRight size={24} />
          </Link>
        </div>

        <div className="flex justify-center py-6 relative z-10">
            <p className="font-arabic text-5xl text-center leading-relaxed">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>

        {/* Floating Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-green-600 transition-colors"
        >
          <Settings size={20} />
        </button>

        {isSettingsOpen && (
          <div className="absolute top-14 right-4 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-2xl p-4 z-50 w-64 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Translations</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={showEnglish} onChange={() => setShowEnglish(!showEnglish)} className="accent-green-600" /> English (Sahih)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={showUrdu} onChange={() => setShowUrdu(!showUrdu)} className="accent-green-600" /> Urdu (Jalandhara)
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Arabic Size</label>
              <input
                type="range" min="20" max="64" value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Verses */}
      <div className="space-y-12 pb-20">
        {arabic.ayahs.map((ayah: any, index: number) => (
          <div key={ayah.number} className="group scroll-mt-24">
            <div className="flex items-start gap-4 md:gap-8 mb-4">
              <div className="w-10 h-10 rounded-full border dark:border-slate-700 flex items-center justify-center text-xs font-mono shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                {ayah.numberInSurah}
              </div>
              <div className="flex-1 space-y-8">
                <p
                  className="font-arabic text-right leading-[2.2] md:leading-[2.5]"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ayah.text}
                </p>

                <div className="space-y-4">
                  {showEnglish && (
                    <div className="border-l-2 border-green-100 dark:border-slate-800 pl-4 py-1">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">{english.ayahs[index].text}</p>
                    </div>
                  )}
                  {showUrdu && (
                    <div className="border-r-2 border-green-100 dark:border-slate-800 pr-4 py-1 text-right">
                      <p className="font-urdu text-2xl text-slate-700 dark:text-slate-300 leading-[1.8]">{urdu.ayahs[index].text}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mt-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahReader;
