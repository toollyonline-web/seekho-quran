
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
  // Using Mishary Rashid Alafasy as default
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
};

export const getAyahAudioUrl = (ayahGlobalNumber: number): string => {
  // Returns individual Ayah audio URL (Mishary Rashid Alafasy)
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;
};

export const getHijriDate = () => {
  return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());
};
