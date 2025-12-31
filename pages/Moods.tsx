
import React, { useState } from 'react';
import { 
  Smile, Frown, Shield, Heart, Zap, Sparkles, 
  ChevronRight, BookOpen, Quote, RefreshCcw,
  CloudRain, Sun, Anchor, Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOODS = [
  { 
    id: 'sad', 
    label: 'Sad or Depressed', 
    icon: <CloudRain className="text-blue-400" />,
    color: 'from-blue-600 to-indigo-900',
    verses: [
      { ref: '94:5-6', text: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease." },
      { ref: '2:155', text: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient." }
    ]
  },
  { 
    id: 'anxious', 
    label: 'Anxious or Worried', 
    icon: <Wind className="text-emerald-400" />,
    color: 'from-emerald-600 to-teal-900',
    verses: [
      { ref: '13:28', text: "Unquestionably, by the remembrance of Allah hearts are assured." },
      { ref: '2:286', text: "Allah does not charge a soul except [with that within] its capacity." }
    ]
  },
  { 
    id: 'grateful', 
    label: 'Grateful & Happy', 
    icon: <Sun className="text-amber-400" />,
    color: 'from-amber-500 to-orange-800',
    verses: [
      { ref: '14:7', text: "If you are grateful, I will surely increase you [in favor]." },
      { ref: '55:13', text: "So which of the favors of your Lord would you deny?" }
    ]
  },
  { 
    id: 'weak', 
    label: 'Feeling Weak', 
    icon: <Zap className="text-rose-400" />,
    color: 'from-rose-600 to-red-900',
    verses: [
      { ref: '40:60', text: "Call upon Me; I will respond to you." },
      { ref: '3:160', text: "If Allah should aid you, no one can overcome you." }
    ]
  },
  { 
    id: 'confused', 
    label: 'Confused or Lost', 
    icon: <Anchor className="text-purple-400" />,
    color: 'from-purple-600 to-fuchsia-900',
    verses: [
      { ref: '1:6', text: "Guide us to the straight path." },
      { ref: '93:7', text: "And He found you lost and guided [you]." }
    ]
  }
];

const Moods: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="text-center py-12 space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20 text-[10px] font-black uppercase tracking-[0.4em]">
           Emotional Remedy
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">Spiritual Moods</h1>
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          The Quran is a cure for the hearts. Select how you are feeling to find specific verses of guidance and comfort.
        </p>
      </div>

      {/* Grid of Moods */}
      {!selectedMood ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOODS.map(mood => (
            <button 
              key={mood.id}
              onClick={() => setSelectedMood(mood)}
              className="quran-card p-10 rounded-[3rem] text-center space-y-6 hover:scale-105 transition-all group overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:rotate-12 transition-transform">
                {mood.icon}
              </div>
              <h3 className="text-2xl font-black italic text-white">{mood.label}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Find Peace</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedMood(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
              <RefreshCcw size={16} /> Back to moods
            </button>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <h2 className="text-3xl font-black italic">{selectedMood.label}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Divine Wisdom</p>
               </div>
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                  {selectedMood.icon}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
             {selectedMood.verses.map((v, i) => (
               <div key={i} className="quran-card p-12 md:p-16 rounded-[4rem] border-white/5 relative overflow-hidden">
                  <Quote className="absolute top-8 left-8 text-emerald-500 opacity-10" size={80} />
                  <div className="relative z-10 space-y-10">
                    <p className="text-2xl md:text-4xl text-slate-200 font-medium leading-relaxed italic">
                      "{v.text}"
                    </p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-10">
                       <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Surah {v.ref}</span>
                       <Link to={`/surah/${v.ref.split(':')[0]}`} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
                          Read Full Surah <ChevronRight size={14} />
                       </Link>
                    </div>
                  </div>
               </div>
             ))}
          </div>
          
          <div className="p-12 bg-white/5 rounded-[3rem] border border-white/5 text-center">
             <p className="text-slate-500 italic font-medium leading-relaxed">
               "Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)
             </p>
          </div>
        </div>
      )}

      <div className="text-center py-12">
         <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">Quran Seekho • Spiritual Sanctuary</p>
      </div>
    </div>
  );
};

export default Moods;
