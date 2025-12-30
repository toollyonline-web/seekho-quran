
import React, { useState } from 'react';
// Import missing ChevronRight icon from lucide-react
import { Book, Search, Copy, Check, Share2, Quote, BookOpen, ChevronRight } from 'lucide-react';
// Import missing Link component from react-router-dom
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

const HadithLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredHadiths = HADITHS.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.ur.includes(searchTerm) ||
    h.number.toString() === searchTerm
  );

  const handleCopy = (hadith: any) => {
    const text = `Hadith ${hadith.number}: ${hadith.title}\n\n${hadith.arabic}\n\n${hadith.en}\n\n${hadith.ur}\n\nShared via QuranSeekho.online`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (hadith: any) => {
    const text = `*Hadith ${hadith.number}: ${hadith.title}*\n\n${hadith.arabic}\n\n"${hadith.en}"\n\n"${hadith.ur}"\n\nShared via QuranSeekho.online`;
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
      handleCopy(hadith);
      alert('Hadith text copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Quote size={32} />
        </div>
        <h1 className="text-4xl font-bold">40 Hadith of Imam Nawawi</h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">A fundamental collection of the Prophet Muhammad's (PBUH) teachings.</p>
      </div>

      <div className="sticky top-20 z-40 bg-green-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 -mx-4 px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by number, title, or keyword..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredHadiths.map((hadith) => (
          <div key={hadith.number} className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {hadith.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{hadith.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Imam Nawawi Collection</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleShare(hadith)}
                  className="p-3 rounded-xl text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
                  title="Share Hadith"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => handleCopy(hadith)}
                  className={`p-3 rounded-xl transition-all ${copiedId === hadith.number ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-green-600'}`}
                  title="Copy to Clipboard"
                >
                  {copiedId === hadith.number ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <p className="font-arabic text-3xl md:text-4xl text-right leading-[1.8] quran-text text-slate-800 dark:text-slate-100" dir="rtl" lang="ar">
                {hadith.arabic}
              </p>
              
              <div className="space-y-6">
                <div className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-900/30">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                    <BookOpen size={14} /> English Translation
                  </p>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                    "{hadith.en}"
                  </p>
                </div>

                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-3 tracking-widest text-right">اردو ترجمہ</p>
                  <p className="font-urdu text-2xl text-slate-800 dark:text-slate-200 leading-relaxed text-right" dir="rtl">
                    {hadith.ur}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredHadiths.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700">
            <Search size={48} className="mx-auto text-slate-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Hadith Found</h2>
            <p className="text-slate-500">Try searching for a different number or keyword.</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-700 text-center space-y-4">
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          This is a curated selection. More Hadiths from Imam Nawawi's collection are being added regularly.
        </p>
        <Link to="/surah" className="inline-flex items-center gap-2 text-green-700 font-bold hover:underline">
          Return to Quran Reader <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default HadithLibrary;
