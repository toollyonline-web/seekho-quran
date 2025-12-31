
import React, { useState, useMemo } from 'react';
import { 
  Search, Copy, Check, Share2, Quote, 
  BookOpen, ChevronRight, Languages, 
  ChevronDown, ChevronUp, Info, Bookmark,
  Star, Sparkles, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Full Collection of Imam Nawawi's 40 Hadith
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
  },
  {
    number: 6,
    title: "The Lawful and Unlawful",
    arabic: "إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَلَالَ بَيِّنٌ وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لَا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ...",
    en: "The lawful is clear and the unlawful is clear, and between them are matters which are ambiguous and of which many people do not know...",
    ur: "حلال واضح ہے اور حرام بھی واضح ہے، اور ان دونوں کے درمیان کچھ مشتبہ چیزیں ہیں جنہیں بہت سے لوگ نہیں جانتے..."
  },
  {
    number: 7,
    title: "Religion is Sincerity",
    arabic: "الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ",
    en: "The religion is sincerity. We said: To whom? He said: To Allah, His Book, His Messenger, and to the leaders of the Muslims and their common folk.",
    ur: "دین خیر خواہی کا نام ہے۔ ہم نے پوچھا: کس کے لیے؟ آپ ﷺ نے فرمایا: اللہ کے لیے، اس کی کتاب کے لیے، اس کے رسول کے لیے، مسلمانوں کے ائمہ کے لیے اور ان کے عام لوگوں کے لیے۔"
  },
  {
    number: 8,
    title: "The Sanctity of a Muslim",
    arabic: "أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...",
    en: "I have been commanded to fight against people till they testify that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah...",
    ur: "مجھے حکم دیا گیا ہے کہ میں لوگوں سے اس وقت تک قتال کروں جب تک وہ اس بات کی گواہی نہ دے دیں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں..."
  },
  {
    number: 9,
    title: "Obligations within Capacity",
    arabic: "مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ...",
    en: "What I have forbidden for you, avoid. What I have commanded you, do as much of it as you can...",
    ur: "جس سے میں نے تمہیں منع کیا اس سے بچو، اور جس کا میں نے تمہیں حکم دیا اس میں سے اتنا کرو جتنی تم میں استطاعت ہے..."
  },
  {
    number: 10,
    title: "Wholesome Consumption",
    arabic: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا...",
    en: "Allah is Pure and He accepts only that which is pure...",
    ur: "اللہ تعالیٰ پاک ہے اور وہ صرف پاکیزہ چیز کو ہی قبول کرتا ہے..."
  },
  {
    number: 11,
    title: "Avoiding Doubt",
    arabic: "دَعْ مَا يَرِيبُكَ إِلَى مَا لَا يَرِيبُكَ",
    en: "Leave that which makes you doubt for that which does not make you doubt.",
    ur: "اس چیز کو چھوڑ دو جو تمہیں شک میں ڈالے اور اسے اختیار کرو جو تمہیں شک میں نہ ڈالے۔"
  },
  {
    number: 12,
    title: "Focusing on Significance",
    arabic: "مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    en: "Part of the excellence of a man's Islam is his leaving that which does not concern him.",
    ur: "انسان کے اسلام کی خوبی یہ ہے کہ وہ ان چیزوں کو چھوڑ دے جو اس کے لیے بے فائدہ ہیں۔"
  },
  {
    number: 13,
    title: "Love for One's Brother",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    en: "None of you [truly] believes until he loves for his brother that which he loves for himself.",
    ur: "تم میں سے کوئی اس وقت تک (کامل) مومن نہیں ہوسکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو وہ اپنے لیے پسند کرتا ہے۔"
  },
  {
    number: 14,
    title: "Prohibition of Bloodshed",
    arabic: "لَا يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ إِلَّا بِإِحْدَى ثَلَاثٍ...",
    en: "The blood of a Muslim is not lawful except in three cases...",
    ur: "کسی مسلمان کا خون حلال نہیں سوائے تین صورتوں کے..."
  },
  {
    number: 15,
    title: "Good Speech and Hospitality",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ...",
    en: "Whosoever believes in Allah and the Last Day, let him say good or remain silent...",
    ur: "جو اللہ اور یومِ آخرت پر ایمان رکھتا ہو اسے چاہیے کہ اچھی بات کہے یا خاموش رہے..."
  },
  {
    number: 16,
    title: "Do Not Get Angry",
    arabic: "لَا تَغْضَبْ",
    en: "Do not get angry.",
    ur: "غصہ نہ کرو۔"
  },
  {
    number: 17,
    title: "Excellence in Everything",
    arabic: "إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ...",
    en: "Verily Allah has prescribed excellence (Ihsan) in everything...",
    ur: "بے شک اللہ نے ہر چیز میں احسان (خوبصورتی اور کمال) فرض کیا ہے..."
  },
  {
    number: 18,
    title: "Taqwa and Good Character",
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    en: "Fear Allah wherever you are, and follow up a bad deed with a good deed and it will wipe it out, and behave towards the people with good character.",
    ur: "جہاں کہیں بھی ہو اللہ سے ڈرو، اور برائی کے بعد نیکی کرو وہ اسے مٹا دے گی، اور لوگوں کے ساتھ حسنِ اخلاق سے پیش آؤ۔"
  },
  {
    number: 19,
    title: "Guidance to Young",
    arabic: "يَا غُلَامُ، إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ...",
    en: "Young man, I shall teach you some words [of advice]: Be mindful of Allah and Allah will protect you...",
    ur: "اے لڑکے، میں تمہیں چند کلمات سکھاتا ہوں: اللہ کے احکامات کی حفاظت کرو، اللہ تمہاری حفاظت فرمائے گا..."
  },
  {
    number: 20,
    title: "Modesty and Faith",
    arabic: "إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلَامِ النُّبُوَّةِ الْأُولَى: إِذَا لَمْ تَسْتَحِ فَاصْنَعْ مَا شِئْتَ",
    en: "Among the words of the first prophecy which have reached the people are: If you do not feel ashamed, do as you wish.",
    ur: "لوگوں کو نبوت کے پہلے کلام سے جو بات ملی وہ یہ ہے: اگر تمہیں شرم نہ آئے تو جو چاہو کرو۔"
  },
  {
    number: 21,
    title: "Steadfastness",
    arabic: "قُلْ: آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ",
    en: "Say: I believe in Allah, then stand firm.",
    ur: "کہو: میں اللہ پر ایمان لایا، پھر اس پر ڈٹ جاؤ۔"
  },
  {
    number: 22,
    title: "Entering Paradise",
    arabic: "أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الْحَلَالَ، وَحَرَّمْتُ الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ",
    en: "Tell me, if I pray the prescribed prayers, fast in Ramadan, treat as lawful that which is lawful, and treat as forbidden that which is forbidden, and do nothing more, shall I enter Paradise? He (PBUH) said: Yes.",
    ur: "بتائیے اگر میں فرض نمازیں پڑھوں، رمضان کے روزے رکھوں، حلال کو حلال اور حرام کو حرام جانوں اور اس پر کچھ زیادہ نہ کروں، تو کیا میں جنت میں جاؤں گا؟ آپ ﷺ نے فرمایا: ہاں۔"
  },
  {
    number: 23,
    title: "Purity of Soul",
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ...",
    en: "Purity is half of faith, and 'Alhamdulillah' fills the scale...",
    ur: "پاکیزگی ایمان کا حصہ ہے، اور 'الحمدللہ' ترازو کو بھر دیتا ہے..."
  },
  {
    number: 24,
    title: "Allah's Prohibition of Injustice",
    arabic: "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلَا تَظَالَمُوا...",
    en: "O My servants, I have forbidden injustice for Myself and forbade it among you, so do not wrong one another...",
    ur: "اے میرے بندو، میں نے ظلم کو اپنے اوپر حرام کیا اور تمہارے درمیان بھی اسے حرام قرار دیا، پس ایک دوسرے پر ظلم نہ کرو..."
  },
  {
    number: 25,
    title: "Charity for Every Joint",
    arabic: "أَوَلَيْسَ قَدْ جَعَلَ اللَّهُ لَكُمْ مَا تَصَدَّقُونَ بِهِ؟ إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً...",
    en: "Has Allah not given you that with which you may give charity? Verily every glorification is charity...",
    ur: "کیا اللہ نے تمہارے لیے صدقہ کرنے کی چیزیں نہیں بنائیں؟ بے شک ہر بار 'سبحان اللہ' کہنا صدقہ ہے..."
  },
  {
    number: 26,
    title: "Daily Acts of Charity",
    arabic: "كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ...",
    en: "Each person's every joint must perform a charity every day the sun rises...",
    ur: "انسان کے ہر جوڑ پر صدقہ لازم ہے، ہر اس دن جس میں سورج نکلتا ہے..."
  },
  {
    number: 27,
    title: "Righteousness and Sin",
    arabic: "الْبِرُّ حُسْنُ الْخُلُقِ، وَالْإِثْمُ مَا حَاكَ فِي نَفْسِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ",
    en: "Righteousness is good character, and sin is that which wavers in your heart and you hate for people to know about it.",
    ur: "نیکی حسنِ اخلاق ہے، اور گناہ وہ ہے جو تمہارے دل میں کھٹکے اور تم ناپسند کرو کہ لوگوں کو اس کا پتہ چلے۔"
  },
  {
    number: 28,
    title: "Following the Sunnah",
    arabic: "عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ...",
    en: "You must adhere to my Sunnah and the Sunnah of the Rightly Guided Successors...",
    ur: "تم پر میری سنت اور ہدایت یافتہ خلفائے راشدین کی سنت لازم ہے..."
  },
  {
    number: 29,
    title: "Paths to Goodness",
    arabic: "أَلَا أَدُلُّكَ عَلَى أَبْوَابِ الْخَيْرِ؟ الصَّوْمُ جُنَّةٌ، وَالصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ...",
    en: "Shall I not guide you to the doors of goodness? Fasting is a shield, and charity extinguishes sin...",
    ur: "کیا میں تمہیں بھلائی کے دروازے نہ بتاؤں؟ روزہ ڈھال ہے، اور صدقہ گناہوں کو ایسے مٹاتا ہے جیسے پانی آگ کو..."
  },
  {
    number: 30,
    title: "Limits of Allah",
    arabic: "إِنَّ اللَّهَ تَعَالَى فَرَضَ فَرَائِضَ فَلَا تُضَيِّعُوهَا...",
    en: "Verily Allah has prescribed obligations, so do not neglect them...",
    ur: "بے شک اللہ تعالیٰ نے کچھ فرائض مقرر کیے ہیں انہیں ضائع نہ کرو..."
  },
  {
    number: 31,
    title: "Reality of Asceticism",
    arabic: "ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبَّكَ النَّاسُ",
    en: "Renounce the world and Allah will love you, and renounce what people possess and the people will love you.",
    ur: "دنیا سے بے رغبتی اختیار کرو اللہ تم سے محبت کرے گا، اور جو کچھ لوگوں کے پاس ہے اس سے بے نیازی برتو لوگ تم سے محبت کریں گے۔"
  },
  {
    number: 32,
    title: "No Harm or Reciprocity",
    arabic: "لَا ضَرَرَ وَلَا ضِرَارَ",
    en: "There should be neither harming nor reciprocating harm.",
    ur: "نہ کسی کو نقصان پہنچانا جائز ہے اور نہ نقصان کا بدلہ نقصان سے دینا۔"
  },
  {
    number: 33,
    title: "Burden of Proof",
    arabic: "لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ لَادَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ...",
    en: "If people were given according to their claims, men would claim the wealth and blood of others...",
    ur: "اگر لوگوں کو ان کے دعووں کے مطابق دے دیا جائے تو لوگ دوسروں کے اموال اور خون کا دعویٰ کر دیں گے..."
  },
  {
    number: 34,
    title: "Changing Evil",
    arabic: "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ...",
    en: "Whosoever among you sees an evil, let him change it with his hand; and if he is not able to do so, then with his tongue; and if he is not able to do so, then with his heart...",
    ur: "تم میں سے جو کوئی برائی دیکھے وہ اسے اپنے ہاتھ سے روکے، اگر استطاعت نہ ہو تو اپنی زبان سے، اور اگر اس کی بھی استطاعت نہ ہو تو اپنے دل سے (برا جانے)..."
  },
  {
    number: 35,
    title: "Muslim Brotherhood",
    arabic: "لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا...",
    en: "Do not envy one another, do not outbid one another, do not hate one another, do not turn your backs on one another...",
    ur: "ایک دوسرے سے حسد نہ کرو، دھوکہ نہ دو، ایک دوسرے سے بغض نہ رکھو، اور ایک دوسرے سے پیٹھ نہ پھیرو..."
  },
  {
    number: 36,
    title: "Helping Others",
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ...",
    en: "Whosoever removes a worldly grief from a believer, Allah will remove from him a grief of the Day of Resurrection...",
    ur: "جس نے کسی مومن کی دنیاوی تکلیف دور کی، اللہ تعالیٰ قیامت کے دن اس کی تکلیف دور فرمائے گا..."
  },
  {
    number: 37,
    title: "Rewards of Good Deeds",
    arabic: "إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ...",
    en: "Verily Allah has written down the good deeds and the evil deeds and then explained it...",
    ur: "بے شک اللہ نے نیکیاں اور برائیاں لکھ لی ہیں اور پھر انہیں واضح کر دیا ہے..."
  },
  {
    number: 38,
    title: "Attaining Allah's Nearness",
    arabic: "مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ...",
    en: "Whosoever shows enmity to a friend of Mine, I shall be at war with him...",
    ur: "جس نے میرے کسی ولی سے دشمنی کی میں نے اسے اعلانِ جنگ دے دیا..."
  },
  {
    number: 39,
    title: "Mistakes and Forgetfulness",
    arabic: "إِنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي الْخَطَأَ وَالنِّسْيَانَ وَمَا اسْتُكْرِهُوا عَلَيْهِ",
    en: "Verily Allah has pardoned for me my ummah their mistakes, their forgetfulness and that which they have been coerced to do.",
    ur: "بے شک اللہ نے میری امت کی خطا، بھول چوک اور جس پر انہیں مجبور کیا گیا ہو اسے معاف فرما دیا ہے۔"
  },
  {
    number: 40,
    title: "Being a Stranger",
    arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ",
    en: "Be in this world as if you were a stranger or a traveler.",
    ur: "دنیا میں ایسے رہو جیسے تم اجنبی ہو یا راستے کے مسافر۔"
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
    setTimeout(() => setCopied(false), 2000);
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
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 border dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-900/30 group-hover:rotate-6 transition-transform">
            {hadith.number}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">{hadith.title}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Imam Nawawi Collection</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-3.5 rounded-2xl text-slate-400 bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all"
            title="Share Hadith"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={handleCopy}
            className={`p-3.5 rounded-2xl transition-all shadow-sm ${copied ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-white/5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600'}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10">
           <p className="font-arabic text-3xl md:text-5xl text-right leading-[1.8] quran-text text-slate-800 dark:text-slate-100 py-2" dir="rtl" lang="ar">
             {hadith.arabic}
           </p>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-4 border-t dark:border-slate-700">
          <button 
            onClick={() => setShowEn(!showEn)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${showEn ? 'bg-emerald-700 text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border dark:border-slate-700 hover:border-emerald-400'}`}
          >
            <Languages size={18} />
            {showEn ? 'Hide English' : 'View English'}
            {showEn ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            onClick={() => setShowUr(!showUr)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${showUr ? 'bg-indigo-700 text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border dark:border-slate-700 hover:border-indigo-400'}`}
          >
            <Languages size={18} />
            {showUr ? 'اردو چھپائیں' : 'اردو میں دیکھیں'}
            {showUr ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Translation Content */}
        <div className="space-y-6">
          {showEn && (
            <div className="p-10 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[3rem] border border-emerald-100 dark:border-emerald-900/30 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white"><BookOpen size={16} /></div>
                 <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Commentary (En)</p>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-bold italic">
                "{hadith.en}"
              </p>
            </div>
          )}

          {showUr && (
            <div className="p-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Languages size={16} /></div>
                 <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest text-right">اردو ترجمہ</p>
              </div>
              <p className="font-urdu text-4xl text-slate-800 dark:text-slate-200 leading-[1.8] text-right" dir="rtl">
                {hadith.ur}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700 text-slate-400">
        <Quote size={240} />
      </div>
    </div>
  );
};

const HadithLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'title'>('number');

  const filteredHadiths = useMemo(() => {
    let list = HADITHS.filter(h => 
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.number.toString() === searchTerm ||
      h.en.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => a.number - b.number);
    }
    
    return list;
  }, [searchTerm, sortBy]);

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700 pb-32">
      {/* Dynamic Header */}
      <div className="text-center space-y-6 pt-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-600/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Sparkles size={14} className="animate-pulse" /> Authentic Tradition
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none text-white drop-shadow-2xl">Arba'un an-Nawawi</h1>
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          The legendary collection of Imam an-Nawawi, encompassing the core principles of Islamic life and theology.
        </p>
      </div>

      {/* Modern Control Bar */}
      <div className="sticky top-24 z-40 glass py-6 px-6 -mx-6 flex flex-col md:flex-row gap-6 items-center justify-between border-y border-white/5">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Find by number, title, or keyword..."
            className="w-full pl-16 pr-6 py-4.5 bg-white/5 border border-transparent dark:border-white/5 rounded-[2rem] shadow-xl focus:border-emerald-600 outline-none transition-all font-bold text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button 
             onClick={() => setSortBy(sortBy === 'number' ? 'title' : 'number')}
             className="flex-grow md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all"
           >
              <Filter size={16} /> Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
           </button>
           <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
              <Info size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{filteredHadiths.length} Loaded</span>
           </div>
        </div>
      </div>

      {/* Hadith Feed */}
      <div className="grid grid-cols-1 gap-12">
        {filteredHadiths.map((hadith) => (
          <HadithCard key={hadith.number} hadith={hadith} />
        ))}
        
        {filteredHadiths.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[4rem] border border-white/5 shadow-inner">
            <Search size={80} className="mx-auto text-slate-700 mb-8" />
            <h2 className="text-3xl font-black italic mb-4">No Hadith Matches</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">We couldn't find any Prophetic traditions matching your search. Please try a different number or term.</p>
          </div>
        )}
      </div>

      {/* Contextual Footer Section */}
      <section className="bg-gradient-to-br from-slate-900 to-[#0b0c0d] p-12 md:p-20 rounded-[4rem] text-center space-y-10 relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-900/40 transform rotate-12">
             <Star size={40} className="text-white fill-current" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic leading-none">The Foundation of Character</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            Imam Nawawi's collection is unique because every single Hadith within it is considered a pillar of Islamic law and ethical conduct.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/surah" className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
              Return to Quran <ChevronRight size={20} />
            </Link>
            <Link to="/duas" className="px-12 py-6 bg-white/5 text-white border border-white/10 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
              Explore Duas <Sparkles size={20} />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
          <Quote size={400} strokeWidth={1} />
        </div>
      </section>

      <div className="text-center py-8">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Quran Seekho • Scholars Approved Library</p>
      </div>
    </div>
  );
};

export default HadithLibrary;
