
import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, Star } from 'lucide-react';

const Feedback: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold">JazakAllah Khair!</h1>
        <p className="text-slate-500">Your feedback has been received. This helps us improve Quran Seekho for the entire Ummah.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-green-700 font-bold hover:underline"
        >
          Send another response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Tester Feedback</h1>
        <p className="text-slate-500">Help us polish Quran Seekho before the global launch. Your input is vital for our Google Play review.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">How would you rate the app?</label>
          <div className="flex gap-4 justify-center py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all transform hover:scale-125 ${rating >= star ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
              >
                <Star size={36} fill={rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">What did you like most?</label>
          <textarea 
            required
            rows={3}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-green-600 outline-none resize-none"
            placeholder="e.g. The clean reading experience, prayer times accuracy..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Any bugs or suggestions?</label>
          <textarea 
            required
            rows={4}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-green-600 outline-none resize-none"
            placeholder="Describe any issues you faced..."
          />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
            Your feedback is sent directly to the development team. It is used to fix issues and fulfill Google Play's testing requirements.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading || rating === 0}
          className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={18} /> Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
