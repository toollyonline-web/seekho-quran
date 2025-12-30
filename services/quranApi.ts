
import { Surah, Ayah, PrayerTimes } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_URL = 'https://api.aladhan.com/v1';

const fetchWithTimeout = async (resource: string, options = {}) => {
  const { timeout = 8000 } = options as any;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
};

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/surah`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("fetchSurahList error:", err);
    return [];
  }
};

export const fetchSurahDetail = async (id: number): Promise<any> => {
  try {
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const res = await fetchWithTimeout(`${BASE_URL}/surah/${id}/editions/${editions.join(',')}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchSurahDetail error:", err);
    throw err;
  }
};

export const fetchJuzDetail = async (id: number): Promise<any> => {
  try {
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const res = await fetchWithTimeout(`${BASE_URL}/juz/${id}/editions/${editions.join(',')}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchJuzDetail error:", err);
    throw err;
  }
};

export const searchAyah = async (query: string): Promise<any> => {
  if (!query || query.length < 3) return null;
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/search/${query}/all/en.sahih`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("searchAyah error:", err);
    return null;
  }
};

export const fetchPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimes> => {
  try {
    const date = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const res = await fetchWithTimeout(`${PRAYER_URL}/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`);
    if (!res.ok) throw new Error("Prayer times API failed");
    const data = await res.json();
    return data.data.timings;
  } catch (err) {
    console.warn("Using fallback prayer times due to error:", err);
    // Fallback to Mecca
    const fallbackRes = await fetch(`${PRAYER_URL}/timings?latitude=21.4225&longitude=39.8262&method=2`);
    const fallbackData = await fallbackRes.json();
    return fallbackData.data.timings;
  }
};

export const fetchRandomAyah = async (): Promise<any> => {
  try {
    const randomNum = Math.floor(Math.random() * 6236) + 1;
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const res = await fetchWithTimeout(`${BASE_URL}/ayah/${randomNum}/editions/${editions.join(',')}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchRandomAyah error:", err);
    return null;
  }
};

export const getSurahAudioUrl = (surahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};

export const getAyahAudioUrl = (ayahGlobalNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;
};

export const getHijriDate = (date: Date = new Date()) => {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return date.toDateString();
  }
};

export const getHijriParts = (date: Date = new Date()) => {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).formatToParts(date);
    
    const res: any = {};
    parts.forEach(p => res[p.type] = p.value);
    return res;
  } catch (e) {
    return { day: date.getDate(), month: 'Day', year: date.getFullYear() };
  }
};

export const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year', hijri: '1 Muharram', description: 'Start of the new Hijri year.' },
  { name: 'Ashura', hijri: '10 Muharram', description: 'Day of fasting and remembrance.' },
  { name: 'Mawlid an-Nabi', hijri: '12 Rabi al-Awwal', description: 'Birth of the Prophet Muhammad (PBUH).' },
  { name: 'Isra and Mi\'raj', hijri: '27 Rajab', description: 'The Night Journey and Ascension.' },
  { name: 'Ramadan Start', hijri: '1 Ramadan', description: 'The month of fasting begins.' },
  { name: 'Laylat al-Qadr', hijri: '27 Ramadan', description: 'The Night of Power (approximate).' },
  { name: 'Eid ul-Fitr', hijri: '1 Shawwal', description: 'Festival of Breaking the Fast.' },
  { name: 'Day of Arafah', hijri: '9 Dhul-Hijjah', description: 'The climax of Hajj.' },
  { name: 'Eid ul-Adha', hijri: '10 Dhul-Hijjah', description: 'Festival of Sacrifice.' },
];
