
export type Language = 'en' | 'ur' | 'ar';

export const translations: Record<Language, any> = {
  en: {
    nav: {
      home: "Home",
      surah: "Surah",
      search: "Search",
      qibla: "Qibla",
      duas: "Duas",
      zakat: "Zakat",
      tasbeeh: "Tasbeeh",
      names: "99 Names",
      calendar: "Calendar"
    },
    home: {
      greeting: "Assalamu Alaikum",
      heroTitle: "Seek Final Knowledge",
      heroSubtitle: "A premium digital sanctuary for reading, learning, and reflecting on the Noble Quran.",
      browseSurahs: "All Surahs",
      popularSurahs: "Featured Reading",
      prayerTimes: "Prayer Times",
      resumeReading: "Resume Reading",
      lastRead: "Last Read",
      readingGoal: "Daily Progress",
      knowledgeDay: "Verse of the Day",
      ayahGoal: "Daily Ayah Goal",
      goalSuccess: "MashaAllah! Goal met."
    },
    tools: {
      tasbeehTitle: "Digital Tasbeeh",
      tasbeehSubtitle: "Simple Dhikr counter for daily remembrance",
      tapToCount: "Tap to count",
      target: "Target",
      total: "Total Session",
      reset: "Reset Counter",
      zakatTitle: "Zakat Calculator",
      zakatSubtitle: "Fulfill your obligation with ease",
      assets: "Net Assets",
      cash: "Cash on hand",
      goldSilver: "Gold & Silver",
      investments: "Investments",
      liabilities: "Liabilities",
      netWealth: "Total Wealth",
      dueZakat: "Payable Zakat",
      bookmarksTitle: "Bookmarks",
      bookmarksSubtitle: "Your saved verses for reflection"
    },
    reader: {
      settings: "Reading Settings",
      translation: "Translation",
      fontSize: "Text Size",
      theme: "Theme Mode",
      hifzMode: "Hifz Mode",
      hifzDesc: "Hide text for memorization",
      audioSettings: "Audio Settings",
      reciter: "Select Reciter"
    },
    ui: {
      settings: "Preferences",
      theme: "Interface Theme",
      language: "App Language",
      close: "Close",
      back: "Go Back",
      search: "Search for surahs, ayahs...",
      discover: "Discover by Topic"
    }
  },
  ur: {
    nav: {
      home: "ہوم",
      surah: "سورتیں",
      search: "تلاش",
      qibla: "قبلہ",
      duas: "دعائیں",
      zakat: "زکوٰۃ",
      tasbeeh: "تسبیح",
      names: "99 نام",
      calendar: "کیلنڈر"
    },
    home: {
      greeting: "السلام علیکم",
      heroTitle: "قرآن کا نور تلاش کریں",
      heroSubtitle: "قرآن پاک کی تلاوت اور فہم کے لیے ایک خوبصورت اور پرسکون ڈیجیٹل ماحول۔",
      browseSurahs: "تمام سورتیں",
      popularSurahs: "منتخب تلاوت",
      prayerTimes: "نماز کے اوقات",
      resumeReading: "تلاوت جاری رکھیں",
      lastRead: "آخری بار پڑھا گیا",
      readingGoal: "روزانہ کا ہدف",
      knowledgeDay: "آج کی آیت",
      ayahGoal: "آیت کا ہدف",
      goalSuccess: "ماشاءاللہ! ہدف پورا ہوا۔"
    },
    tools: {
      tasbeehTitle: "ڈیجیٹل تسبیح",
      tasbeehSubtitle: "ذکر الٰہی کے لیے خوبصورت کاؤنٹر",
      tapToCount: "گننے کے لیے دبائیں",
      target: "ہدف",
      total: "کل تسبیح",
      reset: "دوبارہ شروع",
      zakatTitle: "زکوٰۃ کیلکولیٹر",
      zakatSubtitle: "آسانی سے اپنی زکوٰۃ کا حساب لگائیں",
      assets: "اثاثے",
      cash: "نقدی",
      goldSilver: "سونا اور چاندی",
      investments: "سرمایہ کاری",
      liabilities: "قرضہ جات",
      netWealth: "کل دولت",
      dueZakat: "واجب الادا زکوٰۃ",
      bookmarksTitle: "محفوظ آیات",
      bookmarksSubtitle: "آپ کی پسندیدہ آیات"
    },
    reader: {
      settings: "ترتیبات",
      translation: "ترجمہ",
      fontSize: "فونٹ سائز",
      theme: "تھیم",
      hifzMode: "حفظ موڈ",
      hifzDesc: "یاد کرنے کے لیے عبارت چھپائیں",
      audioSettings: "آڈیو سیٹنگز",
      reciter: "قاری منتخب کریں"
    },
    ui: {
      settings: "ترتیبات",
      theme: "تھیم",
      language: "زبان",
      close: "بند کریں",
      back: "واپس",
      search: "سورت یا آیت تلاش کریں...",
      discover: "موضوعات کے لحاظ سے تلاش کریں"
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      surah: "السور",
      search: "بحث",
      qibla: "القبلة",
      duas: "الأدعية",
      zakat: "الزكاة",
      tasbeeh: "التسبيح",
      names: "الأسماء الحسنى",
      calendar: "التقويم"
    },
    home: {
      greeting: "السلام عليكم",
      heroTitle: "استكشف نور القرآن",
      heroSubtitle: "بيئة هادئة لقراءة وفهم القرآن الكريم.",
      browseSurahs: "كل السور",
      popularSurahs: "سور مختارة",
      prayerTimes: "أوقات الصلاة",
      resumeReading: "متابعة القراءة",
      lastRead: "آخر قراءة",
      readingGoal: "الهدف اليومي",
      knowledgeDay: "آية اليوم",
      ayahGoal: "هدف الآيات",
      goalSuccess: "ما شاء الله! تم الهدف"
    },
    tools: {
      tasbeehTitle: "التسبيح الرقمي",
      tasbeehSubtitle: "عداد أنيق للأذكار اليومية",
      tapToCount: "اضغط للعد",
      target: "الهدف",
      total: "المجموع",
      reset: "إعادة",
      zakatTitle: "حاسبة الزكاة",
      zakatSubtitle: "احسب زكاتك بدقة",
      assets: "الأصول",
      cash: "النقد",
      goldSilver: "الذهب والفضة",
      investments: "الاستثمارات",
      liabilities: "الديون",
      netWealth: "صافي الثروة",
      dueZakat: "الزكاة الواجبة",
      bookmarksTitle: "الإشارات المرجعية",
      bookmarksSubtitle: "آياتك المفضلة"
    },
    reader: {
      settings: "الإعدادات",
      translation: "الترجمة",
      fontSize: "الخط",
      theme: "المظهر",
      hifzMode: "وضع الحفظ",
      hifzDesc: "إخفاء النص للمساعدة في الحفظ",
      audioSettings: "إعدادات الصوت",
      reciter: "اختر القارئ"
    },
    ui: {
      settings: "الإعدادات",
      theme: "المظهر",
      language: "اللغة",
      close: "إغلاق",
      back: "رجوع",
      search: "بحث...",
      discover: "اكتشف حسب الموضوع"
    }
  }
};
