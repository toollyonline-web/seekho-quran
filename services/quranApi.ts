
import { Surah, Ayah, PrayerTimes } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_URL = 'https://api.aladhan.com/v1';

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 'ar.abdurrahmansudais', name: 'Abdurrahman Al-Sudais', style: 'Haramain' },
  { id: 'ar.saoodshuraym', name: 'Saood bin Ibrahim Ash-Shuraym', style: 'Haramain' },
  { id: 'ar.ghamadi', name: 'Saad Al-Ghamdi', style: 'Murattal' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Traditional' },
];

export const TAJWEED_RULES = [
  { name: 'Ghunnah', color: '#FF7E00', desc: 'Nasalization', audio: 'https://www.searchtruth.org/tajweed/ghunnah.mp3' },
  { name: 'Qalqalah', color: '#0091FF', desc: 'Echo/Bouncing', audio: 'https://www.searchtruth.org/tajweed/qalqalah.mp3' },
  { name: 'Ikhfa', color: '#9100FF', desc: 'Hidden Sound', audio: 'https://www.searchtruth.org/tajweed/ikhfa.mp3' },
  { name: 'Idgham', color: '#10B981', desc: 'Merging', audio: 'https://www.searchtruth.org/tajweed/idgham.mp3' },
  { name: 'Madd', color: '#FF0000', desc: 'Prolongation', audio: 'https://www.searchtruth.org/tajweed/madd.mp3' },
];

const fetchWithRetry = async (url: string, retries = 3, timeout = 15000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const fetchSurahList = async (): Promise<Surah[]> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/surah`);
    return data.data || [];
  } catch (err) {
    console.error("List fetch failed:", err);
    return [];
  }
};

export const fetchSurahDetail = async (id: number): Promise<any> => {
  try {
    const editions = ['quran-uthmani', 'quran-tajweed', 'en.sahih', 'ur.jalandhara'];
    const data = await fetchWithRetry(`${BASE_URL}/surah/${id}/editions/${editions.join(',')}`);
    return data.data; // This returns an array of editions
  } catch (err) {
    console.warn("Multi-edition fetch failed, trying basic Uthmani fallback.");
    const data = await fetchWithRetry(`${BASE_URL}/surah/${id}/quran-uthmani`);
    return [data.data]; // Wrap in array to match expected component logic
  }
};

export const fetchJuzDetail = async (id: number): Promise<any> => {
  try {
    // AlQuran Cloud Juz endpoint doesn't support the multi-edition /editions/ suffix
    // We fetch primary Uthmani text and return as a single-element array
    const data = await fetchWithRetry(`${BASE_URL}/juz/${id}/quran-uthmani`);
    return [data.data];
  } catch (err) {
    throw new Error("Juz connection failed.");
  }
};

export const fetchPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimes> => {
  try {
    const date = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const data = await fetchWithRetry(`${PRAYER_URL}/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`);
    return data.data.timings;
  } catch (err) {
    const data = await fetchWithRetry(`${PRAYER_URL}/timings?latitude=21.4225&longitude=39.8262&method=2`);
    return data.data.timings;
  }
};

export const fetchRandomAyah = async (): Promise<any> => {
  try {
    const randomNum = Math.floor(Math.random() * 6236) + 1;
    const editions = ['quran-uthmani', 'en.sahih'];
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

export const getAyahAudioUrl = (ayahGlobalNumber: number, reciterId: string = 'ar.alafasy'): string => {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${ayahGlobalNumber}.mp3`;
};

export const getHijriParts = (date: Date = new Date()) => {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).formatToParts(date);
    const res: any = {};
    parts.forEach(p => res[p.type] = p.value);
    return res;
  } catch (e) {
    return { day: date.getDate(), month: 'Month', year: date.getFullYear() };
  }
};

export const ISLAMIC_EVENTS = [
  { name: 'Ramadan Start', hijri: '1 Ramadan', description: 'The month of fasting begins.' },
  { name: 'Eid ul-Fitr', hijri: '1 Shawwal', description: 'Festival of Breaking the Fast.' },
  { name: 'Eid ul-Adha', hijri: '10 Dhul-Hijjah', description: 'Festival of Sacrifice.' },
];
