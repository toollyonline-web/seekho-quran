
import { Surah, Ayah, PrayerTimes } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_URL = 'https://api.aladhan.com/v1';

/**
 * Enhanced fetch with longer timeout and auto-retry logic for better reliability
 */
const fetchWithRetry = async (url: string, retries = 2, timeout = 12000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/surah`);
    return data.data || [];
  } catch (err) {
    console.error("fetchSurahList error:", err);
    return [];
  }
};

export const fetchSurahDetail = async (id: number): Promise<any> => {
  try {
    // We try to fetch the most essential editions first to ensure loading
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const data = await fetchWithRetry(`${BASE_URL}/surah/${id}/editions/${editions.join(',')}`);
    return data.data;
  } catch (err) {
    console.error("fetchSurahDetail error:", err);
    throw err;
  }
};

export const fetchJuzDetail = async (id: number): Promise<any> => {
  try {
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const data = await fetchWithRetry(`${BASE_URL}/juz/${id}/editions/${editions.join(',')}`);
    return data.data;
  } catch (err) {
    console.error("fetchJuzDetail error:", err);
    throw err;
  }
};

export const fetchPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimes> => {
  try {
    const date = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const data = await fetchWithRetry(`${PRAYER_URL}/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`);
    return data.data.timings;
  } catch (err) {
    // Fallback to Mecca
    const data = await fetchWithRetry(`${PRAYER_URL}/timings?latitude=21.4225&longitude=39.8262&method=2`);
    return data.data.timings;
  }
};

export const fetchRandomAyah = async (): Promise<any> => {
  try {
    const randomNum = Math.floor(Math.random() * 6236) + 1;
    const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
    const data = await fetchWithRetry(`${BASE_URL}/ayah/${randomNum}/editions/${editions.join(',')}`);
    return data.data;
  } catch (err) {
    return null;
  }
};

export const searchAyah = async (query: string): Promise<any> => {
  if (!query || query.length < 3) return null;
  try {
    const data = await fetchWithRetry(`${BASE_URL}/search/${query}/all/en.sahih`);
    return data.data;
  } catch (err) {
    return null;
  }
};

export const getSurahAudioUrl = (surahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};

export const getAyahAudioUrl = (ayahGlobalNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;
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
    return { day: date.getDate(), month: 'Month', year: date.getFullYear() };
  }
};

export const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year', hijri: '1 Muharram', description: 'Start of the new Hijri year.' },
  { name: 'Ashura', hijri: '10 Muharram', description: 'Day of fasting and remembrance.' },
  { name: 'Ramadan Start', hijri: '1 Ramadan', description: 'The month of fasting begins.' },
  { name: 'Eid ul-Fitr', hijri: '1 Shawwal', description: 'Festival of Breaking the Fast.' },
  { name: 'Eid ul-Adha', hijri: '10 Dhul-Hijjah', description: 'Festival of Sacrifice.' },
];
