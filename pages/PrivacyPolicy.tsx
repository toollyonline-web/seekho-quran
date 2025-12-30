
import React from 'react';
import { ShieldCheck, Lock, Eye, Globe, Mail, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "December 30, 2025";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:underline">
        <ChevronLeft size={20} /> Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm border dark:border-slate-700">
        <header className="mb-12 border-b dark:border-slate-700 pb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last Updated: {lastUpdated}</p>
        </header>

        <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Globe size={20} className="text-green-600" /> Introduction
            </h2>
            <p>
              Welcome to <strong>QuranSeekho Online</strong> ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (quranseekho.online) or use our mobile application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Lock size={20} className="text-green-600" /> Information Collection
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider">Geolocation Data</h3>
                <p className="text-sm">
                  We request access to your device's location to provide accurate <strong>Prayer Times</strong> based on your current coordinates. This data is processed in real-time and is <strong>not stored on our servers</strong>. You can choose to deny this permission and use default settings (Mecca) instead.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider">Local Storage</h3>
                <p className="text-sm">
                  To provide a personalized experience, we save your <strong>Bookmarks, Reading Themes, Font Sizes, and Tasbeeh counts</strong> locally on your device using browser "Local Storage." This data remains on your device and is never uploaded to our servers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Eye size={20} className="text-green-600" /> Third-Party Services
            </h2>
            <p className="mb-4">We use the following trusted third-party APIs to provide our services:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>AlQuran.cloud:</strong> To retrieve Quranic text and translations.</li>
              <li><strong>Aladhan.com:</strong> To calculate accurate prayer times and Hijri dates.</li>
              <li><strong>Islamic.network:</strong> To provide audio recitations.</li>
            </ul>
            <p className="mt-4 text-sm">These services do not receive any personal identification data from you through our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldCheck size={20} className="text-green-600" /> Children's Privacy
            </h2>
            <p>
              Our services are intended for a general audience. We do not knowingly collect personal identifiable information from children under the age of 13.
            </p>
          </section>

          <section className="pt-8 border-t dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <Mail size={20} className="text-green-600" /> Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
            </p>
            <a href="mailto:support@quranseekho.online" className="inline-block px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">
              support@quranseekho.online
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
