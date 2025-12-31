
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Map as MapIcon, Search, Loader2, 
  MapPin, ExternalLink, RefreshCcw, Info,
  Compass, Globe, Landmark, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HISTORICAL_SITES = [
  "Masjid al-Haram, Makkah",
  "Masjid an-Nabawi, Madinah",
  "Cave of Hira, Jabal an-Nur",
  "Cave of Thawr, Makkah",
  "Al-Aqsa Mosque, Jerusalem",
  "Mount Uhud, Madinah"
];

const IslamicMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const executeMapSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setResults(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide information and historical context for the Islamic site: ${searchTerm}. Mention why it is important in the Quran or Hadith.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || "No details found for this location.";
      const maps = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk: any) => chunk.maps)
        ?.map((chunk: any) => chunk.maps) || [];

      setResults({ text, maps });
    } catch (err) {
      console.error(err);
      setResults({ text: "I couldn't locate the historical significance for this site at the moment.", maps: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-900/40">
           <MapIcon size={32} />
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">History Map</h1>
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Visualize the geography of revelation. Explore historical sites from the Quran and Sunnah with intelligent mapping.
        </p>
      </div>

      {/* Map Search Input */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-blue-500/10 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
        <form onSubmit={(e) => { e.preventDefault(); executeMapSearch(query); }} className="relative">
          <MapPin className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-all" size={24} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a historical site or Prophet's journey..."
            className="w-full pl-16 pr-36 py-6 md:py-8 bg-white/5 border-2 border-white/5 rounded-[2.5rem] shadow-2xl focus:border-blue-600/50 outline-none transition-all text-xl font-bold"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50 transition-all shadow-xl"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Locate"}
          </button>
        </form>
      </div>

      {/* Suggested Historical Sites */}
      {!results && !loading && (
        <div className="space-y-8 animate-in fade-in duration-700">
           <div className="flex items-center gap-4">
              <div className="h-px bg-white/5 flex-grow"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Notable Sites</span>
              <div className="h-px bg-white/5 flex-grow"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {HISTORICAL_SITES.map(site => (
                <button 
                  key={site} 
                  onClick={() => { setQuery(site); executeMapSearch(site); }}
                  className="quran-card p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500 group transition-all"
                >
                  <Landmark size={20} className="text-slate-500 group-hover:text-blue-400" />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{site}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="quran-card p-10 md:p-16 rounded-[4rem] border-white/5 space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-blue-500 pointer-events-none">
                <Globe size={300} />
             </div>
             <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-3xl font-black italic">Geographical Context</h2>
                   <div className="prose prose-invert prose-emerald max-w-none text-xl text-slate-400 leading-relaxed font-medium">
                      {results.text}
                   </div>
                </div>

                {results.maps && results.maps.length > 0 && (
                  <div className="space-y-6 pt-10 border-t border-white/5">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500">Interactive Location Markers</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {results.maps.map((map: any, i: number) => (
                         <a 
                           key={i} 
                           href={map.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group"
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                                  <MapPin size={24} />
                               </div>
                               <div>
                                  <p className="font-bold text-lg">{map.title || "View on Map"}</p>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explore Coordinates</p>
                               </div>
                            </div>
                            <ExternalLink size={20} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                         </a>
                       ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
          
          <button onClick={() => { setResults(null); setQuery(''); }} className="mx-auto flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            <RefreshCcw size={16} /> Reset Search
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
          <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="space-y-2 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-blue-500 shadow-blue-500/20">Mapping Revelation</p>
            <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Querying Historical Landscapes...</p>
          </div>
        </div>
      )}

      <div className="text-center pt-12">
         <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">Quran Seekho • Cartographic Archive</p>
      </div>
    </div>
  );
};

export default IslamicMap;
