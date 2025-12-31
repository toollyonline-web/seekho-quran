
import React from 'react';
import { ShieldCheck, Lock, Eye, Globe, Mail, ChevronLeft, Info, FileText, Database, Trash2, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "December 31, 2025";

  const sections = [
    {
      title: "Data Sovereignty",
      desc: "All your spiritual data (bookmarks, progress) stays exclusively on your device. We do not have a centralized user database.",
      icon: <Database className="text-emerald-500" />
    },
    {
      title: "Ad-Free Forever",
      desc: "We do not use trackers, cookies, or any form of advertising. Your journey is private and focused.",
      icon: <Lock className="text-amber-500" />
    },
    {
      title: "Anonymous Usage",
      desc: "No account is required to use Quran Seekho. You remain completely anonymous while using our platform.",
      icon: <UserCheck className="text-blue-500" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 page-transition pb-32">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-emerald-500 transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-12">
        {/* Modern Header */}
        <header className="relative p-12 md:p-16 rounded-[3.5rem] bg-emerald-950/20 border border-white/5 overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none text-white">Privacy Portal</h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Effective: {lastUpdated}</p>
            </div>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              At Quran Seekho, we believe privacy is a fundamental right. Our platform is built to protect your spiritual focus by ensuring your data never leaves your control.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
            <ShieldCheck size={300} />
          </div>
        </header>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <div key={i} className="quran-card p-8 rounded-[2.5rem] space-y-4 border-white/5">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Deep Dive Content */}
        <div className="quran-card p-8 md:p-16 rounded-[4rem] border-white/5 space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-black italic flex items-center gap-4">
              <span className="text-emerald-500">01.</span> Geolocation Privacy
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              To provide accurate <strong>Prayer Times</strong> and <strong>Qibla direction</strong>, we request your location. This data is processed locally in your browser to calculate the celestial angles and is never transmitted to our servers or stored in any database.
            </p>
            <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl flex items-start gap-4">
              <AlertCircle className="text-rose-500 shrink-0" size={20} />
              <p className="text-xs text-rose-500/80 font-bold leading-relaxed">
                WE DO NOT TRACK YOU. Your location is used only for the moment required to show prayer times and then it is discarded.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black italic flex items-center gap-4">
              <span className="text-emerald-500">02.</span> Local Persistence
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              We utilize <strong>LocalStorage</strong> and <strong>IndexedDB</strong> for the sole purpose of enhancing your user experience. This includes saving your reading theme, font size, and bookmarks. This data exists only on the device you are currently using.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Reading History', 'Bookmark Sync', 'Interface Themes', 'Audio Preferences'].map(item => (
                <div key={item} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <ArrowRight size={14} className="text-emerald-500" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black italic flex items-center gap-4">
              <span className="text-emerald-500">03.</span> External Services
            </h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              We rely on trusted open-source APIs to deliver Quranic content. These providers only receive the technical request (e.g., "Give me Surah 1") and do not receive any identifying information about you.
            </p>
            <div className="space-y-3">
              {[
                { name: "AlQuran API", role: "Holy Text & Translations" },
                { name: "Islamic Network", role: "High-quality Audio Recitations" },
                { name: "Aladhan API", role: "Astronomical Prayer Timings" }
              ].map(provider => (
                <div key={provider.name} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                  <span className="font-black text-xs uppercase tracking-widest">{provider.name}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{provider.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-12 border-t border-white/5">
            <div className="bg-emerald-600 p-10 md:p-14 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center space-y-6">
                <h3 className="text-3xl font-black italic text-white leading-none">Questions?</h3>
                <p className="text-emerald-50 font-medium max-w-md mx-auto opacity-80">
                  If you have concerns about your digital footprint or our technical infrastructure, please reach out.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a href="mailto:privacy@quranseekho.online" className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    Email Security Team
                  </a>
                </div>
              </div>
              <div className="absolute top-0 left-0 p-8 opacity-10">
                <Mail size={150} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
