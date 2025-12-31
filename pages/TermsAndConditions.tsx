
import React from 'react';
import { Gavel, ShieldCheck, FileText, AlertCircle, HelpCircle, BookOpen, Heart, Globe, ExternalLink, ChevronLeft, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const lastUpdated = "December 31, 2025";

  const legalPillars = [
    { title: "Universal Access", desc: "No paywalls. No premium tiers. No data harvesting." },
    { title: "Religious Integrity", desc: "Content sourced from verified scholarly sources." },
    { title: "User Responsibility", desc: "Respect the sanctity of the text in digital form." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 page-transition pb-32">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-emerald-500 transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="space-y-12">
        {/* Modern Header */}
        <header className="relative p-12 md:p-16 rounded-[3.5rem] bg-slate-900 border border-white/5 overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-emerald-500 shadow-2xl border border-white/10">
              <Gavel size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none text-white">Platform Terms</h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Revised: {lastUpdated}</p>
            </div>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
              These terms outline the expectations and rules for using the Quran Seekho platform. We aim to provide a safe, respectful, and high-quality environment for spiritual study.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white">
            <Scale size={300} />
          </div>
        </header>

        {/* Legal Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalPillars.map((p, i) => (
            <div key={i} className="quran-card p-8 rounded-[2.5rem] space-y-3 border-white/5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-500">{p.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Terms Content */}
        <div className="quran-card p-8 md:p-16 rounded-[4rem] border-white/5 space-y-16">
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black italic">Agreement to Terms</h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                By accessing Quran Seekho, you are entering into a binding agreement with the platform. This service is provided for educational and devotional purposes. Misuse of the platform, including unauthorized data scraping or attempts to disrupt the service, may result in access restrictions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Content Accuracy</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                While we source translations and recitations from highly reputable scholarly databases (Sahih International, Jalandhari, etc.), no translation can fully encompass the depth of the original Arabic Quran. We encourage users to consult with local scholars for deeper Tafsir (exegesis).
              </p>
            </div>
          </section>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black italic">Limitation of Liability</h2>
            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 space-y-4">
               <div className="flex items-center gap-3 text-emerald-500 mb-2">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Clause</span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-wide">
                 QURAN SEEKHO IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY KIND. WE ARE NOT LIABLE FOR ANY DISCREPANCIES IN PRAYER TIMES, QIBLA DIRECTION, OR CONTENT AVAILABILITY CAUSED BY THIRD-PARTY INFRASTRUCTURE OR GEOLOCATION INACCURACY.
               </p>
            </div>
          </section>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black italic">Community Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <ArrowRight size={14} className="text-emerald-500" /> Respectful Use
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Users should handle the digital display of Quranic verses with the same respect they would accord a physical Mushaf.</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <ArrowRight size={14} className="text-emerald-500" /> No Commercial Use
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed">The contents and tools on this platform are for spiritual benefit and cannot be sold, rented, or bundled for profit.</p>
              </div>
            </div>
          </section>

          <footer className="pt-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-white/5 rounded-[3rem]">
               <div className="space-y-2 text-center md:text-left">
                  <h4 className="font-black italic">Legal Inquiries</h4>
                  <p className="text-xs text-slate-500">Need clarification on these terms?</p>
               </div>
               <a href="mailto:legal@quranseekho.online" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                  Contact Compliance
               </a>
            </div>
          </footer>
        </div>
      </div>
      <p className="mt-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        "And fulfill every covenant, for every covenant will be questioned." (Quran 17:34)
      </p>
    </div>
  );
};

export default TermsAndConditions;
