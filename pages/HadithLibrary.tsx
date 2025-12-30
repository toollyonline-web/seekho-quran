
import React, { useState } from 'react';
import { 
  Search, Copy, Check, Share2, Quote, 
  BookOpen, ChevronRight, Languages, 
  ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HADITHS = [
  {
    number: 1,
    title: "Actions are by Intentions",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ",
    en: "Actions are but by intentions and every man shall have only that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was for a worldly benefit for himself or for a woman to marry, his migration was for that which he migrated to.",
    ur: "اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کی طرف ہوگی تو اس کی ہجرت اللہ اور اس کے رسول ہی کی طرف (شمار) ہوگی، اور جس کی ہجرت دنیا حاصل کرنے کے لیے ہو یا کسی عورت سے نکاح کرنے کے لیے ہو تو اس کی ہجرت اسی کے لیے ہوگی جس کے لیے اس نے ہجرت کی۔"
  },
  {
    number: 2,
    title: "Islam, Iman, and Ihsan",
    arabic: "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعَرِ... قَالَ: فَأَخْبِرْنِي عَنْ الْإِيمَانِ، قَالَ: أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ",
    en: "While we were sitting with the Messenger of Allah (PBUH) one day, a man appeared with very white clothes and very black hair... He said: Tell me about Iman. The Prophet said: It is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in divine decree, both its good and its evil.",
    ur: "ایک دن ہم رسول اللہ ﷺ کی خدمت میں حاضر تھے کہ ایک شخص نمودار ہوا جس کے کپڑے انتہائی سفید اور بال انتہائی سیاہ تھے... اس نے کہا: مجھے ایمان کے بارے میں بتائیے؟ آپ ﷺ نے فرمایا: (ایمان یہ ہے کہ) تم اللہ پر، اس کے فرشتوں پر، اس کی کتابوں پر، اس کے رسولوں پر اور یومِ آخرت پر ایمان لاؤ اور اچھی اور بری تقدیر پر ایمان لاؤ۔"
  },
  {
    number: 3,
    title: "The Pillars of Islam",
    arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
    en: "Islam has been built on five [pillars]: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing the prayer, paying the zakat, making the pilgrimage to the House, and fasting in Ramadan.",
    ur: "اسلام کی بنیاد پانچ چیزوں پر ہے: اس بات کی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ ادا کرنا، بیت اللہ کا حج کرنا اور رمضان کے روزے رکھنا۔"
  },
  {
    number: 4,
    title: "Creation in the Womb",
    arabic: "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا نُطْفَةً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ",
    en: "Verily the creation of each one of you is brought together in his mother's womb for forty days in the form of a drop of sperm, then he becomes a clot for a like period, then a morsel of flesh for a like period, then there is sent to him the angel who blows the breath of life into him.",
    ur: "تم میں سے ہر ایک کی تخلیق اس کی ماں کے پیٹ میں چالیس دن تک نطفہ کی صورت میں جمع رہتی ہے، پھر اتنے ہی دن وہ علقہ (جونک کی طرح کا خون) بنا رہتا ہے، پھر اتنے ہی دن وہ مضغہ (گوشت کا لوتھڑا) بنا رہتا ہے، پھر اس کی طرف فرشتہ بھیجا جاتا ہے جو اس میں روح پھونکتا ہے۔"
  },
  {
    number: 5,
    title: "Rejection of Innovation",
    arabic: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
    en: "He who innovates something in this matter of ours (Islam) that is not of it will have it rejected.",
    ur: "جس نے ہمارے اس دین میں کوئی ایسی نئی بات نکالی جو اس میں سے نہیں ہے، تو وہ مردود ہے۔"
  }
];

const HadithCard: React.FC<{ hadith: typeof HADITHS[0] }> = ({ hadith }) => {
  const [showEn, setShowEn] = useState(false);
  const [showUr, setShowUr] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Hadith ${hadith.number}: ${hadith.title}\n\n${hadith.arabic}\n\n${hadith.en}\n\n${hadith.ur}\n\nShared via QuranSeekho.online`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    const text = `*Hadith ${hadith.number}: ${hadith.title}*\n\n${hadith.arabic}\n\nShared via QuranSeekho.online`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: hadith.title,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      handleCopy();
      alert('Hadith text copied to clipboard!');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 border dark:border-slate-700 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-700 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-green-100 dark:ring-green-900/30">
            {hadith.number}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{hadith.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Imam Nawawi Collection</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-3 rounded-xl text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
            title="Share"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={handleCopy}
            className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-green-600'}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <p className="font-arabic text-3xl md:text-5xl text-right leading-[1.8] quran-text text-slate-800 dark:text-slate-100 py-4" dir="rtl" lang="ar">
          {hadith.arabic}
        </p>
        
        <div className="flex flex-wrap gap-3 pt-4 border-t dark:border-slate-700">
          <button 
            onClick={() => setShowEn(!showEn)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${showEn ? 'bg-green-700 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border dark:border-slate-700 hover:border-green-400'}`}
          >
            <Languages size={16} />
            {showEn ? 'Hide English' : 'View in English'}
            {showEn ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            onClick={() => setShowUr(!showUr)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${showUr ? 'bg-blue-700 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border dark:border-slate-700 hover:border-blue-400'}`}
          >
            <Languages size={16} />
            {showUr ? 'اردو چھپائیں' : 'اردو میں دیکھیں'}
            {showUr ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Translation Content */}
        <div className="space-y-4">
          {showEn && (
            <div className="p-8 bg-green-50/50 dark:bg-green-900/10 rounded-[2rem] border border-green-100 dark:border-green-900/30 animate-in slide-in-from-top-4 duration-500">
              <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                <BookOpen size={14} /> English Commentary
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                "{hadith.en}"
              </p>
            </div>
          )}

          {showUr && (
            <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-top-4 duration-500">
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase mb-4 tracking-widest text-right">اردو ترجمہ</p>
              <p className="font-urdu text-3xl text-slate-800 dark:text-slate-200 leading-relaxed text-right" dir="rtl">
                {hadith.ur}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Quote size={200} />
      </div>
    </div>
  );
};

const HadithLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHadiths = HADITHS.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.number.toString() === searchTerm
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4 pt-10">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 rotate-6 shadow-xl shadow-blue-900/10">
          <Quote size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Imam Nawawi's 40 Hadith</h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
          Master the fundamentals of faith through this legendary collection of Prophetic wisdom.
        </p>
      </div>

      <div className="sticky top-20 z-40 bg-green-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 -mx-4 px-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b dark:border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Hadith number or title..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-full border dark:border-slate-700 shadow-sm">
           <Info size={14} className="text-blue-500" /> Use toggles to view translations
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {filteredHadiths.map((hadith) => (
          <HadithCard key={hadith.number} hadith={hadith} />
        ))}
        
        {filteredHadiths.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700 shadow-sm">
            <Search size={64} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Hadith Not Found</h2>
            <p className="text-slate-500">We couldn't find any Hadith matching "{searchTerm}".</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-white p-10 md:p-14 rounded-[3rem] text-center space-y-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Deepen Your Knowledge</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            Understanding the Hadith is essential to understanding the Quran in context. Every Hadith here is a pillar of Islamic jurisprudence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/surah" className="px-10 py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95">
              Read the Quran <ChevronRight size={20} />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <BookOpen size={300} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default HadithLibrary;
