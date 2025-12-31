
import { GraduationCap, ChevronLeft, ChevronRight, RotateCcw, Check, Brain, Star, BookOpen, Search, History } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { translations, Language } from '../services/i18n';

interface FlashCard {
  word: string;
  trans: string;
  meaning: string;
  frequency: number;
  grammar?: string;
}

const TOP_WORDS: FlashCard[] = [
  { word: "من", trans: "Min", meaning: "From / Than", frequency: 3226, grammar: "Particle" },
  { word: "الله", trans: "Allah", meaning: "God (Allah)", frequency: 2699, grammar: "Proper Noun" },
  { word: "في", trans: "Fi", meaning: "In", frequency: 1701, grammar: "Particle" },
  { word: "ما", trans: "Ma", meaning: "What / Not", frequency: 1570, grammar: "Relative Pronoun" },
  { word: "لا", trans: "La", meaning: "No / Not", frequency: 1350, grammar: "Particle" },
  { word: "إن", trans: "Inna", meaning: "Indeed", frequency: 1200, grammar: "Particle" },
  { word: "قال", trans: "Qala", meaning: "He said", frequency: 1100, grammar: "Verb" },
  { word: "الذين", trans: "Alladhina", meaning: "Those who", frequency: 1080, grammar: "Relative Pronoun" },
  { word: "على", trans: "Ala", meaning: "On / Upon", frequency: 950, grammar: "Particle" },
  { word: "كان", trans: "Kana", meaning: "Was / Used to be", frequency: 940, grammar: "Verb" },
  { word: "رب", trans: "Rabb", meaning: "Lord", frequency: 850, grammar: "Noun" },
  { word: "يوم", trans: "Yawm", meaning: "Day", frequency: 405, grammar: "Noun" },
  { word: "آمنوا", trans: "Amanu", meaning: "They believed", frequency: 250, grammar: "Verb" },
  { word: "حق", trans: "Haqq", meaning: "Truth / Right", frequency: 227, grammar: "Noun" },
  { word: "نور", trans: "Nur", meaning: "Light", frequency: 43, grammar: "Noun" }
];

const VocabularyBuilder: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  useEffect(() => {
    const saved = localStorage.getItem('qs_known_words');
    if (saved) {
      setKnownWords(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleKnown = (word: string) => {
    const next = new Set(knownWords);
    if (next.has(word)) next.delete(word);
    else next.add(word);
    setKnownWords(next);
    localStorage.setItem('qs_known_words', JSON.stringify(Array.from(next)));
  };

  const filteredWords = TOP_WORDS.filter(w => 
    w.word.includes(searchTerm) || 
    w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentWord = filteredWords[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center py-10 space-y-6">
        <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-amber-900/40 transform rotate-3">
           <GraduationCap size={32} />
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">{t.nav.vocabulary}</h1>
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Master the most frequent words in the Quran. Learn {TOP_WORDS.length} words that cover 80% of the text.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-8 bg-white/5 py-6 px-10 rounded-[2.5rem] border border-white/5">
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Progress</p>
            <p className="text-2xl font-black text-white">{Math.round((knownWords.size / TOP_WORDS.length) * 100)}%</p>
         </div>
         <div className="w-px h-10 bg-white/10"></div>
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Known Words</p>
            <p className="text-2xl font-black text-emerald-500">{knownWords.size}</p>
         </div>
         <div className="w-px h-10 bg-white/10"></div>
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Learning</p>
            <p className="text-2xl font-black text-amber-500">{TOP_WORDS.length - knownWords.size}</p>
         </div>
      </div>

      {/* Flashcard Area */}
      {filteredWords.length > 0 ? (
        <div className="space-y-12">
          <div 
            className="perspective-1000 w-full h-[400px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden quran-card rounded-[4rem] p-12 flex flex-col items-center justify-center space-y-8 border-white/10 shadow-2xl">
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                   Study Mode
                 </div>
                 <p className="font-arabic text-[8rem] md:text-[10rem] text-white leading-none" dir="rtl">{currentWord.word}</p>
                 <p className="text-slate-500 text-xl font-bold uppercase tracking-widest">{currentWord.trans}</p>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">Tap to Reveal</p>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-950/20 quran-card rounded-[4rem] p-12 flex flex-col items-center justify-center space-y-10 border-emerald-500/20 shadow-2xl">
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                   Meaning Revealed
                 </div>
                 <div className="text-center space-y-4">
                    <p className="text-5xl md:text-7xl font-black italic text-white leading-tight">"{currentWord.meaning}"</p>
                    {currentWord.grammar && <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">{currentWord.grammar}</p>}
                 </div>
                 <div className="w-full h-px bg-white/5"></div>
                 <div className="flex items-center gap-4 text-slate-500">
                    <History size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Appears {currentWord.frequency} times in Quran</span>
                 </div>
              </div>

            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-6 px-4">
             <button 
               onClick={(e) => { e.stopPropagation(); prevCard(); }}
               className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all active:scale-90"
             >
                <ChevronLeft size={32} />
             </button>
             
             <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleKnown(currentWord.word); }}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl ${knownWords.has(currentWord.word) ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}
                >
                   {knownWords.has(currentWord.word) ? <Check size={18} /> : <Brain size={18} />}
                   {knownWords.has(currentWord.word) ? 'Mastered' : 'Mark as Known'}
                </button>
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl hover:bg-amber-500 transition-all active:scale-90"
                >
                   <RotateCcw size={24} className={isFlipped ? 'rotate-180' : ''} />
                </button>
             </div>

             <button 
               onClick={(e) => { e.stopPropagation(); nextCard(); }}
               className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all active:scale-90"
             >
                <ChevronRight size={32} />
             </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[4rem] border border-white/5">
           <Search size={64} className="mx-auto text-slate-700 mb-6" />
           <p className="text-2xl font-black italic">No words match your search.</p>
        </div>
      )}

      {/* Search and List */}
      <div className="space-y-12">
         <div className="flex items-center gap-6">
            <div className="h-px bg-white/5 flex-grow"></div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-600">Vocabulary Index</h2>
            <div className="h-px bg-white/5 flex-grow"></div>
         </div>

         <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search words by Arabic or meaning..."
              className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-[2rem] outline-none focus:border-amber-600/50 font-bold"
            />
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TOP_WORDS.map((word, i) => (
               <button 
                 key={i}
                 onClick={() => { setCurrentIndex(i); setIsFlipped(false); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                 className={`p-6 rounded-3xl border transition-all text-center relative group ${currentIndex === i ? 'bg-amber-600 border-amber-500 shadow-xl' : 'bg-white/5 border-white/5 hover:border-amber-600/30'}`}
               >
                  {knownWords.has(word.word) && (
                    <div className="absolute top-2 right-2 text-emerald-500 bg-emerald-500/10 p-1 rounded-full">
                       <Check size={10} />
                    </div>
                  )}
                  <p className="font-arabic text-4xl mb-2">{word.word}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{word.meaning}</p>
               </button>
            ))}
         </div>
      </div>

      <div className="p-12 bg-white/5 rounded-[3rem] border border-white/5 text-center">
         <p className="text-slate-500 italic font-medium leading-relaxed max-w-lg mx-auto">
           "The most beloved of actions to Allah are those that are most consistent, even if they are small." (Sahih Bukhari)
         </p>
      </div>

      <div className="text-center pb-12">
         <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">Quran Seekho • Language Lab</p>
      </div>
    </div>
  );
};

export default VocabularyBuilder;
