
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

const AskAi: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Assalamu Alaikum! I am your QuranSeekho Assistant. How can I help you today with your Quranic or Islamic questions?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a respectful and knowledgeable AI Islamic Assistant for QuranSeekho.online. 
          Your goals:
          1. Provide accurate information based on the Holy Quran and authentic Sunnah.
          2. Always remain polite and use Islamic greetings when appropriate.
          3. For complex legal rulings (fatwas), advise users to consult qualified scholars.
          4. Include Quranic references (Surah and Ayah number) when quoting the Quran.
          5. Keep answers concise, clear, and easy to understand.
          6. Support both English and Urdu queries.`,
        },
      });

      const botResponse = response.text || "I apologize, I couldn't process that. Please try asking again.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I encountered an error while searching for the answer. Please check your connection or try a different question." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-160px)] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-500" /> Ask AI
          </h1>
          <p className="text-slate-500 text-sm">Powered by Gemini for Islamic guidance.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border dark:border-slate-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none border dark:border-slate-800">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border dark:border-slate-700 flex gap-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about Quran, Salah, or Hadith..."
          className="flex-1 bg-transparent px-4 outline-none text-sm dark:text-white"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-600 disabled:opacity-50 transition-all shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl text-[10px] text-amber-700 dark:text-amber-400">
        <AlertCircle size={14} />
        <span>AI models can sometimes provide incorrect information. For major religious matters, consult a verified Imam.</span>
      </div>
    </div>
  );
};

export default AskAi;
