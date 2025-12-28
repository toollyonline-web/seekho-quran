
import { Surah, Ayah, PrayerTimes } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';
const PRAYER_URL = 'https://api.aladhan.com/v1';

export const fetchSurahList = async (): Promise<Surah[]> => {
  const res = await fetch(`${BASE_URL}/surah`);
  const data = await res.json();
  return data.data;
};

export const fetchSurahDetail = async (id: number): Promise<any> => {
  const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
  const res = await fetch(`${BASE_URL}/surah/${id}/editions/${editions.join(',')}`);
  const data = await res.json();
  return data.data;
};

export const fetchJuzDetail = async (id: number): Promise<any> => {
  const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
  const res = await fetch(`${BASE_URL}/juz/${id}/editions/${editions.join(',')}`);
  const data = await res.json();
  return data.data;
};

export const fetchPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimes> => {
  const date = new Date().toLocaleDateString('en-GB').split('/').join('-');
  const res = await fetch(`${PRAYER_URL}/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`);
  const data = await res.json();
  return data.data.timings;
};

export const fetchRandomAyah = async (): Promise<any> => {
  const randomNum = Math.floor(Math.random() * 6236) + 1;
  const editions = ['quran-uthmani', 'en.sahih', 'ur.jalandhara'];
  const res = await fetch(`${BASE_URL}/ayah/${randomNum}/editions/${editions.join(',')}`);
  const data = await res.json();
  return data.data;
};

export const getSurahAudioUrl = (surahNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};

export const getAyahAudioUrl = (ayahGlobalNumber: number): string => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;
};

export const getHijriDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getHijriParts = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).formatToParts(date);
  
  const res: any = {};
  parts.forEach(p => res[p.type] = p.value);
  return res;
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
