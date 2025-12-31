
import React from 'react';
/* Added EyeOff to the lucide-react imports */
import { ShieldCheck, Lock, Eye, EyeOff, Globe, Mail, ChevronLeft, Info, FileText, Database, Trash2, UserCheck, AlertCircle, ArrowRight, Gavel, Server, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "January 20, 2026";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 page-transition pb-32">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-emerald-500 transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-16">
        {/* Header */}
        <header className="relative p-12 md:p-16 rounded-[3.5rem] bg-emerald-950/20 border border-white/5 overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none text-white">Privacy Policy</h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Version 2.0 • Last Updated: {lastUpdated}</p>
            </div>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed text-lg">
              This document explains how <strong>Quran Seekho</strong> collects, uses, and protects your information. Our primary goal is your spiritual benefit, not data collection.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
            <ShieldCheck size={300} />
          </div>
        </header>

        {/* Extensive Legal Deep Dive */}
        <div className="quran-card p-10 md:p-20 rounded-[4rem] border-white/5 space-y-20">
          
          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <Info size={24} />
              <h2 className="text-2xl font-black italic">1. Introduction</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium text-lg">
              Quran Seekho ("we," "us," or "our") is dedicated to protecting your privacy. This Privacy Policy outlines the types of information that is or is not collected when you use our web application (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <Database size={24} />
              <h2 className="text-2xl font-black italic">2. Data Collection & Usage</h2>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl">Personal Data</h3>
                <p className="text-slate-500 leading-relaxed">
                  We do not require you to create an account or provide any personal identification information (PII) such as your name, email address, or phone number to use the basic features of Quran Seekho.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl">Location Information</h3>
                <p className="text-slate-500 leading-relaxed">
                  The Service requests access to your device's geolocation to provide accurate <strong>Prayer Times</strong> and <strong>Qibla direction</strong>. 
                </p>
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <span>This data is processed <strong>locally</strong> in your browser's execution environment.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <span>We do not store your historical location or transmit it to any external server.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <span>You may revoke this permission at any time via your browser or device settings.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-xl">Local Storage (Cookies)</h3>
                <p className="text-slate-500 leading-relaxed">
                  Quran Seekho uses <strong>LocalStorage</strong> and <strong>IndexedDB</strong> to save your user preferences. This includes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Reading Font Size', 'Language Selection', 'Bookmarks & Favorites', 'Audio Reciter Choice', 'Reading History (Last Read)'].map(item => (
                    <div key={item} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <ArrowRight size={14} className="text-emerald-500" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <Server size={24} />
              <h2 className="text-2xl font-black italic">3. Third-Party Service Providers</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              We employ third-party APIs to deliver the content of the Holy Quran. These services receive technical requests but do not receive any user-identifiable data:
            </p>
            <div className="space-y-4">
              {[
                { name: "AlQuran Cloud", purpose: "Text, Translations, and Tafsir data retrieval.", url: "https://alquran.cloud" },
                { name: "Islamic Network", purpose: "CDN for high-quality audio recitations.", url: "https://islamic.network" },
                { name: "Aladhan API", purpose: "Astronomical calculation of prayer timings.", url: "https://aladhan.com" }
              ].map(provider => (
                <div key={provider.name} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs uppercase tracking-widest text-white">{provider.name}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">External Content Provider</span>
                  </div>
                  <p className="text-xs text-slate-500">{provider.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <Shield size={24} />
              <h2 className="text-2xl font-black italic">4. Security of Data</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your data (such as HTTPS and local encryption where applicable), we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <EyeOff size={24} />
              <h2 className="text-2xl font-black italic">5. "Do Not Track" Signals</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              We do not support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked. However, since we do not track our users across third-party websites, DNT is not applicable to our Service.
            </p>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <Gavel size={24} />
              <h2 className="text-2xl font-black italic">6. Children's Privacy</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              Our Service is intended for users of all ages to learn and read the Quran. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
            </p>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500">
              <FileText size={24} />
              <h2 className="text-2xl font-black italic">7. Changes to This Policy</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="pt-12 border-t border-white/5">
            <div className="bg-emerald-600 p-10 md:p-14 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center space-y-6">
                <h3 className="text-3xl font-black italic text-white leading-none">Compliance & Contact</h3>
                <p className="text-emerald-50 font-medium max-w-md mx-auto opacity-80">
                  For any legal inquiries or data protection requests, please reach out to our dedicated support team.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a href="mailto:support@quranseekho.online" className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                    <Mail size={16} /> Contact Privacy Team
                  </a>
                </div>
              </div>
              <div className="absolute top-0 left-0 p-8 opacity-10">
                <ShieldCheck size={150} />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <p className="mt-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
        Quran Seekho Portal • Transparency & Trust
      </p>
    </div>
  );
};

export default PrivacyPolicy;
