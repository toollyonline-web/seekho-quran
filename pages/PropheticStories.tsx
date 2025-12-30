
import React, { useState } from 'react';
import { 
  BookOpen, Languages, ChevronDown, ChevronUp, ChevronRight,
  Sparkles, History, Search, ArrowLeft, 
  Heart, Star, Shield, Sun, Cloud, Anchor
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Story {
  id: string;
  name: string;
  arabicName: string;
  titleEn: string;
  titleUr: string;
  icon: React.ReactNode;
  color: string;
  summaryEn: string;
  summaryUr: string;
}

const STORIES: Story[] = [
  {
    id: "adam",
    name: "Adam (AS)",
    arabicName: "آدم عليه السلام",
    titleEn: "The First Human",
    titleUr: "پہلے انسان",
    icon: <Sun size={24} />,
    color: "bg-amber-500",
    summaryEn: "Adam (AS) was the first human created by Allah from clay. He was granted immense knowledge and lived in Paradise with his wife, Hawwa. After being tested by Iblis, they were sent to Earth. Adam (AS) is the father of all humanity and the first Prophet, teaching us the power of repentance (Tawbah).",
    summaryUr: "آدم علیہ السلام اللہ تعالیٰ کے پہلے پیدا کردہ انسان اور پہلے نبی ہیں۔ آپ کو مٹی سے پیدا کیا گیا اور فرشتوں نے آپ کو سجدہ کیا۔ آپ اور آپ کی اہلیہ حضرت حوا جنت میں رہتے تھے، لیکن شیطان کے بہکاوے میں آنے کے بعد آپ کو زمین پر اتار دیا گیا۔ آپ کی زندگی ہمیں سچی توبہ اور اللہ کی طرف رجوع کرنے کا سبق دیتی ہے۔"
  },
  {
    id: "nuh",
    name: "Nuh (AS)",
    arabicName: "نوح عليه السلام",
    titleEn: "The Great Ark",
    titleUr: "عظیم کشتی",
    icon: <Anchor size={24} />,
    color: "bg-blue-500",
    summaryEn: "For 950 years, Nuh (AS) called his people to the worship of One Allah with incredible patience. When they refused and mocked him, Allah commanded him to build a massive Ark. A great flood purified the Earth, and only the believers on the Ark survived. He is known as the Second Father of Humanity.",
    summaryUr: "حضرت نوح علیہ السلام نے ساڑھے نو سو سال تک اپنی قوم کو اللہ کی طرف بلایا۔ جب قوم نے انکار کیا اور مذاق اڑایا تو اللہ کے حکم سے آپ نے ایک عظیم کشتی تیار کی۔ ایک ہولناک طوفان آیا جس نے منکرین کو غرق کر دیا اور صرف وہ لوگ بچے جو آپ کے ساتھ کشتی میں سوار تھے۔ آپ کو انسانیت کا دوسرا باپ بھی کہا جاتا ہے۔"
  },
  {
    id: "ibrahim",
    name: "Ibrahim (AS)",
    arabicName: "إبراهيم عليه السلام",
    titleEn: "Friend of Allah",
    titleUr: "خلیل اللہ",
    icon: <Shield size={24} />,
    color: "bg-green-600",
    summaryEn: "Ibrahim (AS) is the patriarch of the Prophets. He famously challenged the idol-worshippers of his time and remained unharmed when thrown into a massive fire. Along with his son Ismail (AS), he built the Kaaba in Makkah. His life is a testament to absolute monotheism and unwavering trust in Allah.",
    summaryUr: "حضرت ابراہیم علیہ السلام کو 'خلیل اللہ' کہا جاتا ہے۔ آپ نے اپنی قوم کے بت کدوں کو چیلنج کیا اور جب آپ کو آگ میں ڈالا گیا تو اللہ کے حکم سے آگ گلزار بن گئی۔ آپ نے اپنے فرزند حضرت اسماعیل علیہ السلام کے ساتھ مل کر خانہ کعبہ کی تعمیر کی۔ حج کے اکثر مناسک آپ کی عظیم قربانیوں کی یاد دلاتے ہیں۔"
  },
  {
    id: "musa",
    name: "Musa (AS)",
    arabicName: "موسى عليه السلام",
    titleEn: "The Interlocutor",
    titleUr: "کلیم اللہ",
    icon: <Cloud size={24} />,
    color: "bg-cyan-600",
    summaryEn: "Musa (AS) was sent to confront the tyrant Pharaoh and free the Children of Israel. Armed with miracles like the staff that turned into a serpent and the parting of the Red Sea, he led his people to Sinai where he received the Torah. He is the Prophet mentioned most frequently in the Quran.",
    summaryUr: "حضرت موسیٰ علیہ السلام اللہ کے وہ جلیل القدر نبی ہیں جنہیں اللہ سے کلام کرنے کا شرف حاصل ہوا۔ آپ نے فرعون جیسے ظالم بادشاہ کا مقابلہ کیا اور بنی اسرائیل کو اس کی غلامی سے نجات دلائی۔ معجزاتی طور پر سمندر پھٹ گیا اور آپ کی قوم پار اتر گئی۔ آپ پر اللہ نے تورات نازل فرمائی۔"
  },
  {
    id: "isa",
    name: "Isa (AS)",
    arabicName: "عيسى عليه السلام",
    titleEn: "Spirit of Allah",
    titleUr: "روح اللہ",
    icon: <Heart size={24} />,
    color: "bg-rose-500",
    summaryEn: "Born miraculously without a father to the Virgin Maryam (AS), Isa (AS) spoke from the cradle to defend his mother's honor. He performed great miracles, healing the blind and raising the dead by Allah's leave. He preached the Injeel (Gospel) and taught love, compassion, and the coming of the final Prophet.",
    summaryUr: "حضرت عیسیٰ علیہ السلام بغیر باپ کے حضرت مریم علیہ السلام کے بطن سے پیدا ہوئے۔ آپ نے گہوارے میں اپنی والدہ کی پاک دامنی کی گواہی دی۔ آپ اللہ کے حکم سے اندھوں کو بینائی دیتے اور مردوں کو زندہ کر دیتے تھے۔ آپ پر انجیل نازل ہوئی اور آپ نے آخری نبی ﷺ کی آمد کی بشارت دی۔"
  },
  {
    id: "muhammad",
    name: "Muhammad (PBUH)",
    arabicName: "محمد ﷺ",
    titleEn: "The Final Messenger",
    titleUr: "خاتم النبیین",
    icon: <Star size={24} />,
    color: "bg-emerald-700",
    summaryEn: "Born in Makkah, the Prophet Muhammad (PBUH) received the final revelation—the Quran—at the age of 40. Known as 'Al-Amin' (The Trustworthy), he transformed the world through the message of Islam. His life (Sunnah) is the perfect example of character, justice, and mercy for all of creation.",
    summaryUr: "حضرت محمد مصطفیٰ ﷺ اللہ کے آخری نبی اور رسول ہیں۔ آپ پر چالیس سال کی عمر میں غارِ حرا میں قرآن پاک کا نزول شروع ہوا۔ آپ کی زندگی (سیرت طیبہ) قیامت تک کے انسانوں کے لیے مشعلِ راہ ہے۔ آپ کو تمام جہانوں کے لیے رحمت بنا کر بھیجا گیا۔ آپ نے شرک کا خاتمہ کیا اور دینِ اسلام کی تکمیل فرمائی۔"
  }
];

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUrdu, setShowUrdu] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
      {/* Header section */}
      <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={`${story.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            {story.icon}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{story.name}</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{story.titleEn} • {story.titleUr}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-arabic text-3xl text-green-700 dark:text-green-400" dir="rtl">{story.arabicName}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 md:px-10 pb-8 flex flex-wrap gap-3">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isOpen ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'}`}
        >
          <BookOpen size={18} />
          {isOpen ? 'Close Story' : 'Read Story'}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="px-8 md:px-10 pb-10 space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex gap-3 border-t dark:border-slate-700 pt-8">
            <button 
              onClick={() => setShowEnglish(!showEnglish)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showEnglish ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
            >
              <Languages size={14} /> {showEnglish ? 'Hide English' : 'View English'}
            </button>
            <button 
              onClick={() => setShowUrdu(!showUrdu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showUrdu ? 'bg-green-700 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
            >
              <Languages size={14} /> {showUrdu ? 'اردو چھپائیں' : 'اردو میں دیکھیں'}
            </button>
          </div>

          <div className="space-y-4">
            {showEnglish && (
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {story.summaryEn}
                </p>
              </div>
            )}
            {showUrdu && (
              <div className="p-6 bg-green-50/30 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-900/30">
                <p className="font-urdu text-3xl text-right text-slate-800 dark:text-slate-200 leading-[1.8]" dir="rtl">
                  {story.summaryUr}
                </p>
              </div>
            )}
            {!showEnglish && !showUrdu && (
              <div className="py-12 text-center text-slate-400">
                <Sparkles size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">Select a language to begin reading the story of {story.name}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PropheticStories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStories = STORIES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4 pt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-green-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Library
        </Link>
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 rotate-3 shadow-xl shadow-emerald-900/10">
          <History size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Qisas al-Anbiya</h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
          The timeless stories of the Prophets as mentioned in the Holy Quran. Lessons of faith, courage, and divine wisdom.
        </p>
      </div>

      <div className="sticky top-20 z-40 bg-green-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 -mx-4 px-4 border-b dark:border-slate-800">
        <div className="relative w-full max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for a Prophet (e.g. Musa, Ibrahim)..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-3xl shadow-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}

        {filteredStories.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700">
            <Search size={64} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Stories Found</h2>
            <p className="text-slate-500">We couldn't find a story for "{searchTerm}".</p>
          </div>
        )}
      </div>

      <div className="bg-emerald-900 text-white p-10 md:p-14 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Read Their Lessons in the Quran</h2>
          <p className="text-emerald-100/70 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            Every story of the Prophets is a reflection of a Quranic miracle. Deepen your understanding by reading the verses directly.
          </p>
          <Link to="/surah" className="px-10 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-all inline-flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95">
            Read the Quran Chapters <ChevronRight size={20} />
          </Link>
        </div>
        <div className="absolute -bottom-20 -right-20 opacity-[0.05] pointer-events-none rotate-12">
          <BookOpen size={400} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default PropheticStories;
