
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';
import { translations, Language } from '../services/i18n';

interface AyahBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  timestamp: number;
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang];

  useEffect(() => {
    const saved = localStorage.getItem('qs_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved).sort((a: any, b: any) => b.timestamp - a.timestamp));
    }
  }, []);

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    const updated = bookmarks.filter(b => b.surahNumber !== surahNumber || b.ayahNumber !== ayahNumber);
    setBookmarks(updated);
    localStorage.setItem('qs_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="pt-10">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <Bookmark className="text-green-600" /> {t.tools.bookmarksTitle}
        </h1>
        <p className="text-slate-500 font-medium">{t.tools.bookmarksSubtitle}</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={`${bookmark.surahNumber}:${bookmark.ayahNumber}`} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm hover:border-green-400 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Link to={`/surah/${bookmark.surahNumber}`} className="text-lg font-black text-green-700 dark:text-green-400 hover:underline">Surah {bookmark.surahName}</Link>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Verse {bookmark.ayahNumber}</p>
                </div>
                <button onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)} className="p-3 text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl">
                  <Trash2 size={24} />
                </button>
              </div>
              <p className="font-arabic text-right text-3xl leading-relaxed mb-8 text-slate-800 dark:text-slate-100" dir="rtl">{bookmark.text}</p>
              <div className="flex justify-end pt-4 border-t dark:border-slate-700">
                <Link to={`/surah/${bookmark.surahNumber}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-all"><BookOpen size={16} /> View Context</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700 shadow-sm">
          <Bookmark size={64} className="mx-auto text-slate-200 mb-6" />
          <h2 className="text-2xl font-black mb-2">No Bookmarks Yet</h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">Revisit your favorite verses by bookmarking them during your reading journey.</p>
          <Link to="/surah" className="px-10 py-4 bg-green-700 text-white rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg">{t.home.browseSurahs}</Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
