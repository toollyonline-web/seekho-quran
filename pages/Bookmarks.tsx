
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';

interface AyahBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  timestamp: number;
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Bookmark className="text-green-600" /> My Bookmarks
        </h1>
        <p className="text-slate-500">Revisit your saved Ayahs from the Holy Quran.</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div 
              key={`${bookmark.surahNumber}:${bookmark.ayahNumber}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm hover:border-green-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link 
                    to={`/surah/${bookmark.surahNumber}`}
                    className="text-sm font-bold text-green-700 dark:text-green-400 hover:underline"
                  >
                    Surah {bookmark.surahName}
                  </Link>
                  <p className="text-xs text-slate-400">Verse {bookmark.ayahNumber}</p>
                </div>
                <button 
                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title="Remove Bookmark"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <p className="font-arabic text-right text-2xl leading-relaxed mb-4" dir="rtl">
                {bookmark.text}
              </p>
              
              <div className="flex justify-end">
                <Link 
                  to={`/surah/${bookmark.surahNumber}`}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors"
                >
                  <BookOpen size={14} /> View in Context
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
          <Bookmark size={48} className="mx-auto text-slate-200 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Bookmarks Yet</h2>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Click the bookmark icon next to an Ayah while reading to save it here.
          </p>
          <Link to="/surah" className="px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-colors inline-block">
            Start Reading
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
