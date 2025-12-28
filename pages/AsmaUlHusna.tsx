
import React from 'react';

const NAMES = [
  { id: 1, arabic: "ٱلرحمن", trans: "Ar-Rahman", en: "The Most Gracious", ur: "انتہائی مہربان" },
  { id: 2, arabic: "ٱلرحيم", trans: "Ar-Raheem", en: "The Most Merciful", ur: "نہایت رحم والا" },
  { id: 3, arabic: "ٱلملك", trans: "Al-Malik", en: "The Absolute Ruler", ur: "حقیقی بادشاہ" },
  { id: 4, arabic: "ٱلقدوس", trans: "Al-Quddus", en: "The Pure One", ur: "نہایت پاک" },
  { id: 5, arabic: "ٱلسلام", trans: "As-Salam", en: "The Source of Peace", ur: "سلامتی والا" },
  { id: 6, arabic: "ٱلمؤمن", trans: "Al-Mu'min", en: "The Inspirer of Faith", ur: "امن دینے والا" },
  { id: 7, arabic: "ٱلمہیمن", trans: "Al-Muhaymin", en: "The Guardian", ur: "نگہبان" },
  { id: 8, arabic: "ٱلعزيز", trans: "Al-Aziz", en: "The Victorious", ur: "سب پر غالب" },
  { id: 9, arabic: "ٱلجبار", trans: "Al-Jabbar", en: "The Compeller", ur: "زبردست" },
  { id: 10, arabic: "ٱلمتكبر", trans: "Al-Mutakabbir", en: "The Greatest", ur: "بڑائی والا" },
  { id: 11, arabic: "ٱلخالق", trans: "Al-Khaliq", en: "The Creator", ur: "پیدا کرنے والا" },
  { id: 12, arabic: "ٱلبارئ", trans: "Al-Bari", en: "The Evolver", ur: "ٹھیک بنانے والا" },
  { id: 13, arabic: "ٱلمصور", trans: "Al-Musawwir", en: "The Flawless Shaper", ur: "صورت گری کرنے والا" },
  { id: 14, arabic: "ٱلغفار", trans: "Al-Ghaffar", en: "The Ever-Forgiving", ur: "بڑا بخشنے والا" },
  { id: 15, arabic: "ٱلقہار", trans: "Al-Qahhar", en: "The All-Prevailing", ur: "زبردست قدرت والا" },
  // ... Adding some more prominent ones for visual variety
  { id: 16, arabic: "ٱلوہاب", trans: "Al-Wahhab", en: "The Supreme Bestower", ur: "سب کچھ عطا کرنے والا" },
  { id: 17, arabic: "ٱلرزاق", trans: "Ar-Razzaq", en: "The Provider", ur: "بڑا رزق دینے والا" },
  { id: 18, arabic: "ٱلفتاح", trans: "Al-Fattah", en: "The Opener", ur: "مشکل کشا" },
  { id: 19, arabic: "ٱلعليم", trans: "Al-Alim", en: "The All-Knowing", ur: "سب کچھ جاننے والا" },
  { id: 20, arabic: "ٱلقابض", trans: "Al-Qabid", en: "The Withholder", ur: "روکنے والا" },
];

const AsmaUlHusna: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Asma-ul-Husna</h1>
        <p className="text-slate-500 max-w-lg mx-auto">The 99 Beautiful Names of Allah (SWT). Truly, in the remembrance of Allah do hearts find rest.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NAMES.map((name) => (
          <div 
            key={name.id} 
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border dark:border-slate-700 shadow-sm hover:border-green-400 hover:shadow-md transition-all group relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl font-bold">{name.id}</span>
            </div>
            <p className="font-arabic text-4xl text-green-800 dark:text-green-400 mb-4 leading-relaxed" dir="rtl" lang="ar">{name.arabic}</p>
            <h3 className="text-xl font-bold mb-1">{name.trans}</h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">{name.en}</p>
            <div className="pt-4 border-t dark:border-slate-700">
              <p className="font-urdu text-xl text-slate-600 dark:text-slate-300" dir="rtl">{name.ur}</p>
            </div>
          </div>
        ))}
        {/* Placeholder for remaining names to encourage scrolling/interaction */}
        <div className="lg:col-span-4 py-12 text-center text-slate-400 italic">
          More names are being added to the database. Explore these beautiful meanings daily.
        </div>
      </div>
    </div>
  );
};

export default AsmaUlHusna;
