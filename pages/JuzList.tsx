
import React from 'react';
import { Link } from 'react-router-dom';

const JuzList: React.FC = () => {
  const juzArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Browse by Juz</h1>
        <p className="text-slate-500">The Quran is divided into 30 equal parts for easy reading.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {juzArray.map((num) => (
          <Link
            key={num}
            to={`/juz/${num}`}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl border dark:border-slate-700 flex flex-col items-center justify-center hover:border-green-500 dark:hover:border-green-600 hover:shadow-lg transition-all group"
          >
            <span className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 opacity-60">PART</span>
            <span className="text-4xl font-bold group-hover:scale-110 transition-transform">{num}</span>
            <div className="mt-4 text-xs font-medium uppercase tracking-widest opacity-40">Open Juz</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JuzList;
