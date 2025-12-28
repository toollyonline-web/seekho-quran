
import React from 'react';
import { CheckCircle2, BookOpen, GraduationCap, Mic } from 'lucide-react';

const Learn: React.FC = () => {
  const tajweedRules = [
    { title: 'Nun Sakinah & Tanween', desc: 'Rules for the quiet "n" sound or double vowels.', icon: <Mic className="text-blue-500" /> },
    { title: 'Madd (Elongation)', desc: 'How long to stretch specific vowels for correct pronunciation.', icon: <Mic className="text-green-500" /> },
    { title: 'Makharij (Articulation)', desc: 'The physical points in the mouth and throat where letters are formed.', icon: <Mic className="text-red-500" /> },
    { title: 'Ghunnah', desc: 'The nasal sound required for certain letters.', icon: <Mic className="text-purple-500" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 mx-auto mb-6">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Learn Quran Step by Step</h1>
        <p className="text-lg text-slate-500">Master the basics of Arabic recitation with Tajweed rules.</p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <BookOpen className="text-green-600" /> Essential Tajweed Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tajweedRules.map((rule, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 hover:border-green-300 transition-colors">
              <div className="mb-4">{rule.icon}</div>
              <h3 className="font-bold text-lg mb-2">{rule.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
         <div className="relative z-10 max-w-xl">
           <h2 className="text-3xl font-bold mb-4">Daily Reminder</h2>
           <p className="text-xl text-green-100 mb-8 italic">"The best among you are those who learn the Quran and teach it."</p>
           <p className="text-sm opacity-80">— Prophet Muhammad (PBUH) [Sahih Bukhari]</p>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <GraduationCap size={200} />
         </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
              { step: 1, title: 'Learn Alphabet', desc: 'Start with the basic Hijaiyah letters.' },
              { step: 2, title: 'Simple Vowels', desc: 'Understand Fatha, Kasra, and Damma.' },
              { step: 3, title: 'Word Structure', desc: 'Join letters to form basic Arabic words.' }
          ].map((s) => (
              <div key={s.step} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold mx-auto mb-4">{s.step}</div>
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Learn;
