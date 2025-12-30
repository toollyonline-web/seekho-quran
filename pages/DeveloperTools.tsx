
import React, { useRef, useState, useEffect } from 'react';
import { Download, Layout, Palette, ShieldCheck, Book, Moon, Star, Sparkles, RefreshCcw } from 'lucide-react';

const DeveloperTools: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState('#166534'); // Deep Green
  const [iconColor, setIconColor] = useState('#ffffff'); // White
  const [patternOpacity, setPatternOpacity] = useState(0.1);
  const [design, setDesign] = useState<'quran' | 'crescent' | 'text'>('quran');
  const [borderRadius, setRadius] = useState(100); // For visual preview, Play Store needs square (it clips it)

  const drawIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set size
    canvas.width = 512;
    canvas.height = 512;

    // 1. Draw Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 512);

    // 2. Draw Islamic Pattern (Simple geometric overlay)
    ctx.strokeStyle = iconColor;
    ctx.globalAlpha = patternOpacity;
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(512 - i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, 512 - i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Main Icon
    ctx.fillStyle = iconColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (design === 'quran') {
      ctx.font = '240px Inter';
      ctx.fillText('📖', 256, 256);
    } else if (design === 'crescent') {
      ctx.font = '240px Inter';
      ctx.fillText('🌙', 256, 256);
    } else {
      ctx.font = 'bold 200px Inter';
      ctx.fillText('QS', 256, 256);
    }

    // 4. Subtle Gradient Overlay
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  };

  useEffect(() => {
    drawIcon();
  }, [bgColor, iconColor, patternOpacity, design]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'quran-seekho-icon-512.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Play Store Icon Generator</h1>
        <p className="text-slate-500">Create your official 512x512 PNG icon for Google Play Console.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Preview Area */}
        <div className="flex flex-col items-center sticky top-24">
          <div 
            className="shadow-2xl overflow-hidden mb-8"
            style={{ borderRadius: `${borderRadius}px`, width: '320px', height: '320px' }}
          >
            <canvas ref={canvasRef} style={{ width: '320px', height: '320px' }} />
          </div>
          
          <button 
            onClick={download}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-900/20 active:scale-95"
          >
            <Download size={20} /> Download 512x512 PNG
          </button>
          <p className="mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">
            Upload this file to Google Play Console
          </p>
        </div>

        {/* Controls Area */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700 shadow-sm space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Layout size={16} /> Choose Design
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'quran', label: 'Quran', icon: <Book size={18} /> },
                { id: 'crescent', label: 'Moon', icon: <Moon size={18} /> },
                { id: 'text', label: 'Initials', icon: <span className="font-bold text-xs">QS</span> }
              ].map((d) => (
                <button 
                  key={d.id}
                  onClick={() => setDesign(d.id as any)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${design === d.id ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-green-200'}`}
                >
                  {d.icon}
                  <span className="text-[10px] font-bold uppercase">{d.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Palette size={16} /> Color Palette
            </h3>
            <div className="flex gap-4">
              {[
                { name: 'Islamic Green', value: '#166534' },
                { name: 'Royal Gold', value: '#b45309' },
                { name: 'Night Blue', value: '#1e293b' },
                { name: 'Soft Sepia', value: '#5d4037' }
              ].map((c) => (
                <button 
                  key={c.value}
                  onClick={() => setBgColor(c.value)}
                  className={`w-12 h-12 rounded-full border-4 transition-transform ${bgColor === c.value ? 'border-white ring-4 ring-green-600 scale-110' : 'border-transparent shadow-inner'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Sparkles size={16} /> Pattern Intensity
              </h3>
              <span className="text-xs font-mono">{Math.round(patternOpacity * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="0.3" step="0.01" value={patternOpacity} 
              onChange={(e) => setPatternOpacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none accent-green-600"
            />
          </section>

          <section className="space-y-4">
             <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
               <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} /> Play Store Tip
               </h4>
               <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
                 Google Play automatically applies rounded corners to your icon. We provide a square download which is the standard requirement.
               </p>
             </div>
          </section>

          <button 
            onClick={() => {
              setBgColor('#166534');
              setIconColor('#ffffff');
              setPatternOpacity(0.1);
              setDesign('quran');
            }}
            className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-green-600 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <RefreshCcw size={14} /> Reset Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTools;
