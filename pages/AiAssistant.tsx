
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, Bot, User, Loader2, Sparkles, 
  MessageSquareHeart, ChevronRight, History, 
  Search, ExternalLink, RefreshCcw, Info
} from 'lucide-react';
import { translations, Language } from '../services/i18n';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  groundingUrls?: { uri: string; title: string }[];
}

const SUGGESTIONS = [
  "Ayah for patience and anxiety",
  "Summary of Surah Yusuf",
  "Prophetic story about mercy",
  "How to improve focus in Salah",
  "Verse for seeking success"
];

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Assalamu Alaikum! I am your AI Soul Guide. How can I help you find wisdom from the Quran or the Prophetic traditions today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentLang = (localStorage.getItem('language') as Language) || 'en';
  const t = translations[currentLang] || translations['en'];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "You are a friendly, deeply knowledgeable Islamic Soul Guide and scholar assistant for the 'Quran Seekho' app. Your goal is to provide spiritual guidance, explain Quranic verses, share Prophetic stories, and offer comfort. Always cite Surah and Ayah numbers where possible. Use a respectful, encouraging, and wise tone. If asked about controversial topics, provide a balanced view based on established scholarly consensus. You can use Google Search to find specific authentic references.",
          tools: [{ googleSearch: {} }],
        },
      });

      const aiText = response.text || "I apologize, I couldn't process that. Please try again.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const urls = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));

      const assistantMessage: Message = { 
        role: 'assistant', 
        text: aiText,
        groundingUrls: urls.length > 0 ? urls : undefined
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to my wisdom archives. Please check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-[80vh] pb-24 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-900/40">
           <MessageSquareHeart size={32} />
        </div>
        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none">{t.nav.ai}</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intelligent Spiritual Consultation</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 space-y-8 mb-12 min-h-[400px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-3 mb-4 opacity-50">
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'Seeker' : 'Soul Guide'}</span>
              </div>
              <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {msg.text}
              </div>
              
              {msg.groundingUrls && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Scholarly References</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, i) => (
                      <a key={i} href={url.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                        <ExternalLink size={12} /> {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={24} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Consulting Revelation...</p>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && !loading && (
        <div className="mb-10 space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-px bg-white/5 flex-grow"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Suggested Prompts</span>
              <div className="h-px bg-white/5 flex-grow"></div>
           </div>
           <div className="flex flex-wrap justify-center gap-3">
              {SUGGESTIONS.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:border-emerald-500 transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-6 glass p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask for guidance, stories, or verse explanations..."
             className="w-full bg-transparent pl-8 pr-32 py-6 rounded-[2rem] text-lg font-bold outline-none placeholder:text-slate-700"
           />
           <button 
             type="submit"
             disabled={!input.trim() || loading}
             className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl"
           >
              Send <Send size={16} />
           </button>
        </form>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">
         <RefreshCcw size={12} /> Responses generated by AI • Consult scholars for deep matters
      </div>
    </div>
  );
};

export default AiAssistant;
