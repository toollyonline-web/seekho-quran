
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
      heroTitle: "Experience the Sacred",
      heroSubtitle: "A premium, distraction-free environment for reading and understanding the Noble Quran.",
      browseSurahs: "Explore All Surahs",
      popularSurahs: "Sacred Selection",
      prayerTimes: "Prayer Times",
      resumeReading: "Continue Journey",
      readingGoal: "Daily Progress",
      knowledgeDay: "Verse of the Day"
    },
    tools: {
      tasbeehTitle: "Digital Tasbeeh",
      tasbeehSubtitle: "Elegant counter for your daily Dhikr",
      tapToCount: "Tap anywhere to count",
      target: "Target",
      total: "Total",
      reset: "Reset",
      zakatTitle: "Zakat Calculator",
      zakatSubtitle: "Fulfill your pillar with precision",
      assets: "Net Assets",
      cash: "Cash on hand",
      goldSilver: "Gold & Silver",
      investments: "Investments",
      liabilities: "Total Liabilities",
      netWealth: "Net Wealth",
      dueZakat: "Payable Zakat",
      bookmarksTitle: "My Bookmarks",
      bookmarksSubtitle: "Your personal library of light"
    },
    reader: {
      settings: "Reading Modes",
      translation: "Translation",
      fontSize: "Typography",
      theme: "Interface Theme"
    },
    ui: {
      settings: "Dashboard Settings",
      theme: "Theme",
      language: "Language",
      close: "Dismiss",
      back: "Go Back",
      search: "Search the Wisdom..."
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
      heroTitle: "نورِ قرآن تلاش کریں",
      heroSubtitle: "قرآن پاک کی تلاوت اور فہم کے لیے ایک پرسکون اور خوبصورت ماحول۔",
      browseSurahs: "تمام سورتیں",
      popularSurahs: "منتخب سورتیں",
      prayerTimes: "نماز کے اوقات",
      resumeReading: "تلاوت جاری رکھیں",
      readingGoal: "روزانہ کا ہدف",
      knowledgeDay: "آج کی آیت"
    },
    tools: {
      tasbeehTitle: "ڈیجیٹل تسبیح",
      tasbeehSubtitle: "ذکر الٰہی کے لیے خوبصورت کاؤنٹر",
      tapToCount: "گننے کے لیے کہیں بھی کلک کریں",
      target: "ہدف",
      total: "کل",
      reset: "دوبارہ شروع",
      zakatTitle: "زکوٰۃ کیلکولیٹر",
      zakatSubtitle: "آسانی سے اپنی زکوٰۃ کا حساب لگائیں",
      assets: "کل اثاثے",
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
      fontSize: "تحریر کا سائز",
      theme: "تھیم"
    },
    ui: {
      settings: "ترتیبات",
      theme: "تھیم",
      language: "زبان",
      close: "بند کریں",
      back: "واپس",
      search: "تلاش کریں..."
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
      heroTitle: "نور القرآن",
      heroSubtitle: "بيئة هادئة وجميلة لقراءة وفهم القرآن الكريم.",
      browseSurahs: "كل السور",
      popularSurahs: "سور مختارة",
      prayerTimes: "أوقات الصلاة",
      resumeReading: "متابعة القراءة",
      readingGoal: "الهدف اليومي",
      knowledgeDay: "آية اليوم"
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
      bookmarksTitle: "إشاراتي",
      bookmarksSubtitle: "مكتبتك الشخصية من النور"
    },
    reader: {
      settings: "الإعدادات",
      translation: "الترجمة",
      fontSize: "الخط",
      theme: "المظهر"
    },
    ui: {
      settings: "الإعدادات",
      theme: "المظهر",
      language: "اللغة",
      close: "إغلاق",
      back: "رجوع",
      search: "بحث..."
    }
  }
};
