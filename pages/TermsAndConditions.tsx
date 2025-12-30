
import React from 'react';
import { Gavel, ShieldCheck, FileText, AlertCircle, HelpCircle, BookOpen, Heart, Globe, ExternalLink, ChevronLeft, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const lastUpdated = "December 30, 2025";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ChevronLeft size={20} /> Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-14 shadow-sm border dark:border-slate-700">
        <header className="mb-12 border-b dark:border-slate-700 pb-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-3xl flex items-center justify-center mb-6">
            <Gavel size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-500 font-medium">Last Revised: {lastUpdated}</p>
        </header>

        <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <ShieldCheck size={24} className="text-green-600" /> 1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using <strong>Quran Seekho</strong> (quranseekho.online), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. This platform is a voluntary initiative dedicated to the service of the global Muslim community.
            </p>
            <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                If you do not agree with any part of these terms, please discontinue use of the service immediately.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <BookOpen size={24} className="text-green-600" /> 2. Content & Religious Context
            </h2>
            <p className="mb-4">
              Quran Seekho provides the Holy Quran's Arabic text, translations, and audio for educational and spiritual purposes. 
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold">01</span>
                <p className="text-sm"><span className="font-bold text-slate-900 dark:text-white">Respect:</span> Users are encouraged to treat the digital Quranic text with the utmost respect as per Islamic tradition.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold">02</span>
                <p className="text-sm"><span className="font-bold text-slate-900 dark:text-white">Translations:</span> Translations are provided "as-is" from established sources (Sahih International, Jalandhari, etc.). Please note that no translation can perfectly capture the infinite depth of the original Arabic Word of Allah.</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <Scale size={24} className="text-green-600" /> 3. Use of Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                <h4 className="font-bold mb-2 text-sm">Personal Use Only</h4>
                <p className="text-xs opacity-70 leading-relaxed">The Service is intended for individual study and devotion. Commercial scraping or resale of data accessed through this platform is strictly prohibited.</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                <h4 className="font-bold mb-2 text-sm">Integrity</h4>
                <p className="text-xs opacity-70 leading-relaxed">You agree not to use the platform for any purpose that is unlawful, disrespectful, or intended to harm the reputation of Islamic teachings.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <Globe size={24} className="text-green-600" /> 4. Third-Party Links & APIs
            </h2>
            <p className="mb-4">
              Our service relies on external API providers (alquran.cloud, aladhan.com) to provide real-time data.
            </p>
            <div className="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4">
              <AlertCircle className="text-rose-600 shrink-0" size={20} />
              <p className="text-xs text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
                Quran Seekho does not guarantee the 100% uptime of these services and is not liable for any discrepancies in prayer times or availability of audio recitations caused by these third parties.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <Heart size={24} className="text-green-600" /> 5. Donations & Sustainability
            </h2>
            <p className="mb-4">
              Quran Seekho is a free, ad-free platform. Donations are entirely voluntary and are used exclusively for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm opacity-80">
              <li>Server and hosting maintenance.</li>
              <li>Domain renewals.</li>
              <li>Future feature development and optimization.</li>
            </ul>
            <p className="mt-4 text-sm italic">Donations do not grant users any special privileges or ownership of the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <AlertCircle size={24} className="text-green-600" /> 6. Limitation of Liability
            </h2>
            <p className="text-sm opacity-80 mb-4">
              IN NO EVENT SHALL QURAN SEEKHO OR ITS DEVELOPERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-sm opacity-80">
              The prayer times and Qibla direction are provided for guidance. Users are encouraged to verify important timings with their local Masjids for congregational prayers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <HelpCircle size={24} className="text-green-600" /> 7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms on this page and updating the "Last Revised" date at the top.
            </p>
          </section>

          <section className="pt-10 border-t dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <FileText size={24} className="text-green-600" /> 8. Contact
            </h2>
            <p className="mb-6">
              For any legal inquiries or clarifications regarding these terms, please reach out to us:
            </p>
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm uppercase font-bold tracking-widest opacity-80 mb-1">Legal & Compliance</p>
                <p className="text-2xl font-bold">legal@quranseekho.online</p>
              </div>
              <a href="mailto:legal@quranseekho.online" className="px-8 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2">
                Send Inquiry <ExternalLink size={18} />
              </a>
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-12 text-center text-slate-400 text-sm italic">
        "O you who have believed, fulfill [all] contracts." (Quran 5:1)
      </div>
    </div>
  );
};

export default TermsAndConditions;
