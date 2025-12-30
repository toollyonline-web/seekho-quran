
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
  { id: 16, arabic: "ٱلوہاب", trans: "Al-Wahhab", en: "The Supreme Bestower", ur: "سب کچھ عطا کرنے والا" },
  { id: 17, arabic: "ٱلرزاق", trans: "Ar-Razzaq", en: "The Provider", ur: "بڑا رزق دینے والا" },
  { id: 18, arabic: "ٱلفتاح", trans: "Al-Fattah", en: "The Opener", ur: "مشکل کشا" },
  { id: 19, arabic: "ٱلعليم", trans: "Al-Alim", en: "The All-Knowing", ur: "سب کچھ جاننے والا" },
  { id: 20, arabic: "ٱلقابض", trans: "Al-Qabid", en: "The Withholder", ur: "روکنے والا" },
  { id: 21, arabic: "ٱلباسط", trans: "Al-Basit", en: "The Extender", ur: "کشادہ کرنے والا" },
  { id: 22, arabic: "ٱلخافض", trans: "Al-Khafid", en: "The Abaser", ur: "پست کرنے والا" },
  { id: 23, arabic: "ٱلرافع", trans: "Ar-Rafi", en: "The Exalter", ur: "بلند کرنے والا" },
  { id: 24, arabic: "ٱلمعز", trans: "Al-Mu'izz", en: "The Giver of Honour", ur: "عزت دینے والا" },
  { id: 25, arabic: "ٱلمذل", trans: "Al-Mudhill", en: "The Giver of Dishonour", ur: "ذلت دینے والا" },
  { id: 26, arabic: "ٱلسميع", trans: "As-Sami", en: "The All-Hearing", ur: "سب کچھ سننے والا" },
  { id: 27, arabic: "ٱلبصير", trans: "Al-Basir", en: "The All-Seeing", ur: "سب کچھ دیکھنے والا" },
  { id: 28, arabic: "ٱلحكم", trans: "Al-Hakam", en: "The Judge", ur: "فیصلہ کرنے والا" },
  { id: 29, arabic: "ٱلعدل", trans: "Al-Adl", en: "The Utterly Just", ur: "سراپا عدل" },
  { id: 30, arabic: "ٱللطيف", trans: "Al-Latif", en: "The Subtle One", ur: "بے حد مہربان" },
  { id: 31, arabic: "ٱلخبير", trans: "Al-Khabir", en: "The All-Aware", ur: "خبردار" },
  { id: 32, arabic: "ٱلحليم", trans: "Al-Halim", en: "The Forbearing", ur: "بردبار" },
  { id: 33, arabic: "ٱلعظيم", trans: "Al-Azim", en: "The Magnificent", ur: "عظمت والا" },
  { id: 34, arabic: "ٱلغفور", trans: "Al-Ghafur", en: "The Forgiving", ur: "بڑا بخشنے والا" },
  { id: 35, arabic: "ٱلشكور", trans: "Ash-Shakur", en: "The Grateful", ur: "بڑا قدردان" },
  { id: 36, arabic: "ٱلعلى", trans: "Al-Ali", en: "The Most High", ur: "بہت بلند" },
  { id: 37, arabic: "ٱلكبير", trans: "Al-Kabir", en: "The Greatest", ur: "بہت بڑا" },
  { id: 38, arabic: "ٱلحفيظ", trans: "Al-Hafiz", en: "The Preserver", ur: "حفاظت کرنے والا" },
  { id: 39, arabic: "ٱلمقيت", trans: "Al-Muqit", en: "The Nourisher", ur: "قوت دینے والا" },
  { id: 40, arabic: "ٱلحسيب", trans: "Al-Hasib", en: "The Accounter", ur: "حساب لینے والا" },
  { id: 41, arabic: "ٱلجليل", trans: "Al-Jalil", en: "The Majestic", ur: "بزرگی والا" },
  { id: 42, arabic: "ٱلكريم", trans: "Al-Karim", en: "The Generous", ur: "کرم کرنے والا" },
  { id: 43, arabic: "ٱلرقيب", trans: "Ar-Raqib", en: "The Watchful", ur: "نگہبان" },
  { id: 44, arabic: "ٱلمجيب", trans: "Al-Mujib", en: "The Responsive", ur: "دعا قبول کرنے والا" },
  { id: 45, arabic: "ٱلواسع", trans: "Al-Wasi", en: "The All-Encompassing", ur: "کشادہ" },
  { id: 46, arabic: "ٱلحكيم", trans: "Al-Hakim", en: "The Wise", ur: "حکمت والا" },
  { id: 47, arabic: "ٱلودود", trans: "Al-Wadud", en: "The Loving", ur: "محبت کرنے والا" },
  { id: 48, arabic: "ٱلمجيد", trans: "Al-Majid", en: "The Glorious", ur: "بزرگی والا" },
  { id: 49, arabic: "ٱلباث", trans: "Al-Ba'ith", en: "The Resurrector", ur: "اٹھانے والا" },
  { id: 50, arabic: "ٱلشہيد", trans: "Ash-Shahid", en: "The Witness", ur: "گواہ" },
  { id: 51, arabic: "ٱلحق", trans: "Al-Haqq", en: "The Truth", ur: "سچا" },
  { id: 52, arabic: "ٱلوكيل", trans: "Al-Wakil", en: "The Trustee", ur: "کارساز" },
  { id: 53, arabic: "ٱلقوى", trans: "Al-Qawwi", en: "The Strong", ur: "طاقتور" },
  { id: 54, arabic: "ٱلمتين", trans: "Al-Matin", en: "The Firm One", ur: "مضبوط" },
  { id: 55, arabic: "ٱلولى", trans: "Al-Wali", en: "The Friend", ur: "دوست" },
  { id: 56, arabic: "ٱلحميد", trans: "Al-Hamid", en: "The Praiseworthy", ur: "تعریف والا" },
  { id: 57, arabic: "ٱلمحصى", trans: "Al-Muhsi", en: "The Accounter", ur: "شمار کرنے والا" },
  { id: 58, arabic: "ٱلمبدئ", trans: "Al-Mubdi", en: "The Originator", ur: "پہلی بار پیدا کرنے والا" },
  { id: 59, arabic: "ٱلمعيد", trans: "Al-Mu'id", en: "The Restorer", ur: "دوبارہ پیدا کرنے والا" },
  { id: 60, arabic: "ٱلمحيى", trans: "Al-Muhyi", en: "The Giver of Life", ur: "زندہ کرنے والا" },
  { id: 61, arabic: "ٱلمميت", trans: "Al-Mumit", en: "The Creator of Death", ur: "مارنے والا" },
  { id: 62, arabic: "ٱلحى", trans: "Al-Hayy", en: "The Living", ur: "زندہ" },
  { id: 63, arabic: "ٱلقيوم", trans: "Al-Qayyum", en: "The Sustainer", ur: "قائم رہنے والا" },
  { id: 64, arabic: "ٱلواجد", trans: "Al-Wajid", en: "The Perceiver", ur: "پانے والا" },
  { id: 65, arabic: "ٱلماجد", trans: "Al-Majid", en: "The Noble", ur: "بزرگی والا" },
  { id: 66, arabic: "ٱلواحد", trans: "Al-Wahid", en: "The Unique", ur: "اکیلا" },
  { id: 67, arabic: "ٱلأحد", trans: "Al-Ahad", en: "The One", ur: "واحد" },
  { id: 68, arabic: "ٱلصمد", trans: "As-Samad", en: "The Eternal", ur: "بے نیاز" },
  { id: 69, arabic: "ٱلقادر", trans: "Al-Qadir", en: "The Able", ur: "قدرت والا" },
  { id: 70, arabic: "ٱلمقتدر", trans: "Al-Muqtadir", en: "The Powerful", ur: "بڑی قدرت والا" },
  { id: 71, arabic: "ٱلمقدم", trans: "Al-Muqaddim", en: "The Expediter", ur: "آگے کرنے والا" },
  { id: 72, arabic: "ٱلمؤخر", trans: "Al-Mu'akhkhir", en: "The Delayer", ur: "پیچھے کرنے والا" },
  { id: 73, arabic: "ٱلأول", trans: "Al-Awwal", en: "The First", ur: "پہلا" },
  { id: 74, arabic: "ٱلآخر", trans: "Al-Akhir", en: "The Last", ur: "آخری" },
  { id: 75, arabic: "ٱلظاہر", trans: "Az-Zahir", en: "The Manifest", ur: "ظاہر" },
  { id: 76, arabic: "ٱلباطن", trans: "Al-Batin", en: "The Hidden", ur: "پوشیدہ" },
  { id: 77, arabic: "ٱلوالى", trans: "Al-Wali", en: "The Governor", ur: "مالک" },
  { id: 78, arabic: "ٱلمتعالى", trans: "Al-Muta'ali", en: "The Most Exalted", ur: "بلند صفتوں والا" },
  { id: 79, arabic: "ٱلبر", trans: "Al-Barr", en: "The Source of All Goodness", ur: "احسان کرنے والا" },
  { id: 80, arabic: "ٱلتواب", trans: "At-Tawwab", en: "The Accepter of Repentance", ur: "توبہ قبول کرنے والا" },
  { id: 81, arabic: "ٱلمنتقم", trans: "Al-Muntaqim", en: "The Avenger", ur: "بدلہ لینے والا" },
  { id: 82, arabic: "ٱلعفو", trans: "Al-Afu", en: "The Pardoner", ur: "معاف کرنے والا" },
  { id: 83, arabic: "ٱلرؤوف", trans: "Ar-Ra'uf", en: "The Compassionate", ur: "نہایت مہربان" },
  { id: 84, arabic: "مالك ٱلملك", trans: "Malik-ul-Mulk", en: "The Owner of All", ur: "کائنات کا مالک" },
  { id: 85, arabic: "ذو ٱلجلال وٱلإكرام", trans: "Dhul-Jalali wal-Ikram", en: "The Lord of Majesty and Bounty", ur: "جلال اور انعام والا" },
  { id: 86, arabic: "ٱلمقسط", trans: "Al-Muqsit", en: "The Equitable", ur: "انصاف کرنے والا" },
  { id: 87, arabic: "ٱلجامع", trans: "Al-Jami", en: "The Gatherer", ur: "جمع کرنے والا" },
  { id: 88, arabic: "ٱلغنى", trans: "Al-Ghani", en: "The Self-Sufficient", ur: "بے نیاز" },
  { id: 89, arabic: "ٱلمغنى", trans: "Al-Mughni", en: "The Enricher", ur: "مالدار کرنے والا" },
  { id: 90, arabic: "ٱلمانع", trans: "Al-Mani", en: "The Preventer", ur: "روکنے والا" },
  { id: 91, arabic: "ٱلضار", trans: "Ad-Darr", en: "The Distressor", ur: "نقصان پہنچانے والا" },
  { id: 92, arabic: "ٱلنافع", trans: "An-Nafi", en: "The Propititor", ur: "نفع پہنچانے والا" },
  { id: 93, arabic: "ٱلنور", trans: "An-Nur", en: "The Light", ur: "نور" },
  { id: 94, arabic: "ٱلہادى", trans: "Al-Hadi", en: "The Guide", ur: "ہدایت دینے والا" },
  { id: 95, arabic: "ٱلبديع", trans: "Al-Badi", en: "The Incomparable", ur: "انوکھا پیدا کرنے والا" },
  { id: 96, arabic: "ٱلباقى", trans: "Al-Baqi", en: "The Everlasting", ur: "ہمیشہ رہنے والا" },
  { id: 97, arabic: "ٱلوارث", trans: "Al-Warith", en: "The Inheritor", ur: "وارث" },
  { id: 98, arabic: "ٱلرشيد", trans: "Ar-Rashid", en: "The Guide to Right Path", ur: "نیک راہ بتانے والا" },
  { id: 99, arabic: "ٱلصبور", trans: "As-Sabur", en: "The Patient", ur: "صبر کرنے والا" }
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
      </div>
      <div className="py-12 text-center text-slate-400 italic">
        "And to Allah belong the best names, so invoke Him by them." (7:180)
      </div>
    </div>
  );
};

export default AsmaUlHusna;
