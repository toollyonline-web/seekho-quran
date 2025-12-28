import React, { useState } from 'react';
import { Star, Copy, Check, Search, Filter } from 'lucide-react';

const DUA_CATEGORIES = [
  "Morning & Evening",
  "Protection",
  "Gratitude",
  "Forgiveness",
  "Anxiety & Stress",
  "Success & Knowledge"
];

const DUAS = [
  {
    category: "Morning & Evening",
    title: "Morning Remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    trans: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah.",
    en: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner."
  },
  {
    category: "Protection",
    title: "Protection from Evil",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    trans: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    en: "In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing."
  },
  {
    category: "Anxiety & Stress",
    title: "Relief from Distress",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    trans: "Ya Hayyu Ya Qayyumu birahmatika astaghith.",
    en: "O Ever Living One, O Self-Sustaining One, in Your Mercy I seek relief."
  },
  {
    category: "Success & Knowledge",
    title: "Increase in Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    trans: "Rabbi zidni 'ilman.",
    en: "My Lord, increase me in knowledge."
  },
  {
    category: "Forgiveness",
    title: "Seeking Forgiveness",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    trans: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
    en: "O Allah, You are Forgiving and You love forgiveness, so forgive me."
  },
  {
    category: "Gratitude",
    title: "Thanking Allah",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
    trans: "Alhamdu lillahil-ladhi bini'matihi tatimmus-salihat.",
    en: "All praise is for Allah by Whose favor good things are accomplished."
  }
];

const DuaLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = DUAS.filter(dua => {
    const matchesSearch = dua.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dua.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? dua.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={32} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold">Dua & Adhkar</h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">"Call upon Me; I will respond to you." (Quran 40:60)</p>
      </div>

      {/* Filters */}
      <div className="space-y-4 sticky top-20 z-40 bg-green-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 -mx-4 px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Duas by title or meaning..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-green-700 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 hover:border-green-400'}`}
          >
            All Duas
          </button>
          {DUA_CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-green-700 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 hover:border-green-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dua Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full mb-2 inline-block">
                    {dua.category}
                  </span>
                  <h3 className="text-xl font-bold">{dua.title}</h3>
                </div>
                <button 
                  onClick={() => handleCopy(`${dua.arabic}\n\n${dua.en}`, idx.toString())}
                  className={`p-3 rounded-xl transition-all ${copiedId === idx.toString() ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-green-600'}`}
                  title="Copy to Clipboard"
                >
                  {copiedId === idx.toString() ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <div className="space-y-6">
                <p className="font-arabic text-3xl md:text-4xl text-right leading-[1.8] quran-text text-green-900 dark:text-green-100" dir="rtl" lang="ar">
                  {dua.arabic}
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700/50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Transliteration</p>
                    <p className="italic text-slate-600 dark:text-slate-400 leading-relaxed">{dua.trans}</p>
                  </div>
                  <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-2 tracking-widest">Meaning</p>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{dua.en}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
            <Search size={48} className="mx-auto text-slate-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Duas Found</h2>
            <p className="text-slate-500">Try searching for a different keyword or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaLibrary;