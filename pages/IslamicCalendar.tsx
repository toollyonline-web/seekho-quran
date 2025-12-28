
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Star } from 'lucide-react';
import { getHijriParts, ISLAMIC_EVENTS } from '../services/quranApi';

const IslamicCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriInfo, setHijriInfo] = useState<any>(null);

  useEffect(() => {
    setHijriInfo(getHijriParts(currentDate));
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(next);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const totalDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
          <CalendarIcon size={32} />
        </div>
        <h1 className="text-4xl font-bold">Islamic Calendar</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Track Hijri dates and stay updated with upcoming Islamic festivals and significant days.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border dark:border-slate-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-left">
                  <h2 className="text-xl font-bold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  {hijriInfo && (
                    <p className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">
                      {hijriInfo.month} {hijriInfo.year} AH
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg"
              >
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold uppercase text-slate-400 tracking-widest py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
              {days.map(d => {
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                const isToday = dayDate.toDateString() === new Date().toDateString();
                const hijri = getHijriParts(dayDate);
                
                return (
                  <div 
                    key={d} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all ${
                      isToday 
                        ? 'bg-green-700 text-white border-green-700 shadow-lg scale-105 z-10' 
                        : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:border-green-300 dark:hover:border-green-600'
                    }`}
                  >
                    <span className="text-lg font-bold leading-none">{d}</span>
                    <span className={`text-[10px] font-bold mt-1 opacity-70 ${isToday ? 'text-green-100' : 'text-slate-500'}`}>
                      {hijri.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-slate-900 rounded-2xl p-6 border border-green-100 dark:border-slate-800">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-green-800 dark:text-green-300">
              <Info size={16} /> Hijri Calendar Fact
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The Islamic calendar is a lunar calendar consisting of 12 months in a year of 354 or 355 days. 
              It is used to determine the proper days of Islamic holidays and rituals, such as the annual period of fasting and the proper time for Hajj.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" /> Key Dates
            </h2>
            <div className="space-y-4">
              {ISLAMIC_EVENTS.map((event, idx) => (
                <div key={idx} className="p-4 rounded-2xl border dark:border-slate-700 hover:border-green-300 transition-all group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {event.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {event.hijri}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicCalendar;
