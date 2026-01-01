
import React, { useState, useEffect, useCallback } from 'react';
import { Compass, MapPin, Navigation, Info, CheckCircle2, ShieldCheck, Lock, RefreshCw, AlertCircle } from 'lucide-react';

const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

const QiblaFinder: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'loading'>('prompt');
  const [sensorPermission, setSensorPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const calculateQibla = (lat: number, lng: number) => {
    const phi1 = lat * (Math.PI / 180);
    const phi2 = KAABA_COORDS.lat * (Math.PI / 180);
    const lam1 = lng * (Math.PI / 180);
    const lam2 = KAABA_COORDS.lng * (Math.PI / 180);

    const qibla = Math.atan2(
      Math.sin(lam2 - lam1),
      Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lam2 - lam1)
    ) * (180 / Math.PI);

    return (qibla + 360) % 360;
  };

  const handleOrientation = useCallback((e: any) => {
    let compass = 0;
    if (e.webkitCompassHeading !== undefined) {
      // iOS
      compass = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      // Android / Others
      // Most browsers return degrees clockwise from North if absolute is true
      compass = e.absolute ? 360 - e.alpha : e.alpha;
    }
    setHeading(compass);
  }, []);

  const initLocation = () => {
    setPermissionState('loading');
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionState('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(calculateQibla(latitude, longitude));
        setPermissionState('granted');
      },
      (err) => {
        console.error(err);
        setPermissionState('denied');
        setError("Location access was denied. Please enable it in your browser/system settings to find the Qibla.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const initSensors = async () => {
    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setSensorPermission('granted');
        } else {
          setSensorPermission('denied');
        }
      } catch (err) {
        setSensorPermission('denied');
      }
    } else {
      // Android or Non-iOS
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      // Fallback for older browsers
      window.addEventListener('deviceorientation', handleOrientation, true);
      setSensorPermission('granted');
    }
  };

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  const isAligned = heading !== null && qiblaDirection !== null && Math.abs(heading - qiblaDirection) < 5;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-700 min-h-[80vh] flex flex-col items-center">
      <header className="text-center mb-12 w-full">
        <div className="w-20 h-20 bg-emerald-600/10 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-emerald-500/20">
          <Compass size={40} />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter">Qibla Finder</h1>
        <p className="text-slate-500 font-medium mt-3 text-lg">Locate the Sacred House with Precision</p>
      </header>

      {permissionState !== 'granted' ? (
        <div className="quran-card p-10 md:p-14 rounded-[4rem] text-center space-y-10 w-full border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <MapPin size={200} />
           </div>
           
           <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin size={48} />
           </div>
           
           <div className="space-y-4">
              <h2 className="text-3xl font-black italic text-white">Location Access Required</h2>
              <p className="text-slate-400 leading-relaxed text-lg max-w-md mx-auto">
                 To calculate the exact angle to the Kaaba from your current position, we need one-time location access.
              </p>
           </div>

           <div className="bg-emerald-600/5 p-6 rounded-3xl flex items-start gap-4 border border-emerald-500/20 text-left max-w-sm mx-auto">
              <ShieldCheck size={24} className="text-emerald-500 shrink-0 mt-1" />
              <div className="space-y-1">
                 <p className="text-[11px] text-emerald-500 font-black uppercase tracking-[0.2em]">Privacy Promise</p>
                 <p className="text-xs text-slate-500 font-medium">Your location is processed locally and never stored or shared with any third party.</p>
              </div>
           </div>

           {error && (
             <div className="flex items-center gap-3 p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-xs font-bold border border-rose-500/20">
                <AlertCircle size={16} /> {error}
             </div>
           )}

           <button 
             onClick={initLocation}
             disabled={permissionState === 'loading'}
             className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
           >
              {permissionState === 'loading' ? <RefreshCw className="animate-spin mx-auto" /> : 'Allow & Detect Location'}
           </button>
        </div>
      ) : sensorPermission !== 'granted' ? (
        <div className="quran-card p-12 rounded-[4rem] text-center space-y-8 w-full border-white/5">
          <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto">
             <Navigation size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic text-white">Activate Sensors</h2>
            <p className="text-slate-500">Enable your device's compass sensor for real-time direction finding.</p>
          </div>
          <button 
            onClick={initSensors}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95"
          >
            Start Compass
          </button>
        </div>
      ) : (
        <div className="w-full space-y-12">
          {/* Compass Display */}
          <div className="relative group mx-auto w-fit">
            <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 -z-10 ${isAligned ? 'bg-emerald-500/30 scale-125' : 'bg-white/5'}`}></div>
            
            <div className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full bg-slate-950 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[12px] border-white/5 flex items-center justify-center relative ring-1 ring-white/10 overflow-hidden">
              
              {/* Outer Scale */}
              <div 
                className="absolute inset-4 border border-white/10 rounded-full transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${- (heading || 0)}deg)` }}
              >
                 {['N', 'E', 'S', 'W'].map((dir, i) => (
                    <span 
                      key={dir} 
                      className={`absolute font-black text-lg ${dir === 'N' ? 'text-rose-500' : 'text-slate-600'}`}
                      style={{ 
                        top: i === 0 ? '6%' : i === 2 ? '94%' : '50%',
                        left: i === 3 ? '6%' : i === 1 ? '94%' : '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 90}deg)`
                      }}
                    >
                      {dir}
                    </span>
                 ))}
                 {/* Degree ticks */}
                 {Array.from({length: 12}).map((_, i) => (
                   <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                      <div className="h-4 w-0.5 bg-white/10 mt-1"></div>
                   </div>
                 ))}
              </div>

              {/* Kaaba Direction Marker */}
              {qiblaDirection !== null && (
                <div 
                  className="absolute inset-0 transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${qiblaDirection - (heading || 0)}deg)` }}
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce border-2 border-emerald-400">
                       <CheckCircle2 size={32} />
                    </div>
                    <span className="text-[12px] font-black text-emerald-500 uppercase mt-4 tracking-[0.4em] drop-shadow-md">MAKKAH</span>
                  </div>
                </div>
              )}

              {/* Central Heading Info */}
              <div className="text-center z-10 bg-slate-900/80 backdrop-blur-md p-8 rounded-full border border-white/5 shadow-2xl">
                <p className="text-7xl font-mono font-black text-white leading-none tracking-tighter">
                  {Math.round(heading || 0)}°
                </p>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">
                  Current Heading
                </p>
              </div>

              {/* Directional Needle */}
              <div className={`w-2 h-44 md:h-64 rounded-full absolute transition-all duration-300 pointer-events-none ${isAligned ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]' : 'bg-slate-700 opacity-40'}`}>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-current rounded-full ring-[6px] ring-slate-950"></div>
              </div>
            </div>

            <div className={`mt-16 text-center transition-all duration-700 transform ${isAligned ? 'scale-110' : 'scale-100'}`}>
              {isAligned ? (
                <div className="bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-4 mx-auto animate-in zoom-in shadow-2xl shadow-emerald-900/40">
                  <CheckCircle2 size={24} /> Perfectly Aligned
                </div>
              ) : (
                <div className="inline-flex items-center gap-4 text-slate-500 text-xs font-black uppercase tracking-[0.2em] bg-white/5 px-8 py-4 rounded-full border border-white/5 backdrop-blur-md">
                   <Lock size={16} className="animate-pulse" /> Rotate device towards marker
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="quran-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Location Verify</p>
                 <MapPin size={16} className="text-emerald-500" />
              </div>
              <p className="text-lg font-black text-white">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '--'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Coordinates used for calculation</p>
            </div>
            
            <div className="quran-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Calculated Qibla</p>
                 <Navigation size={16} className="text-blue-500" />
              </div>
              <p className="text-lg font-black text-white">{qiblaDirection ? `${Math.round(qiblaDirection)}° from North` : '--'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Magnetic bearing to Kaaba</p>
            </div>
          </div>

          <div className="bg-blue-600/5 p-8 rounded-[3rem] border border-blue-500/10 flex items-start gap-6 max-w-xl mx-auto">
            <Info size={28} className="text-blue-500 shrink-0" />
            <div className="space-y-2">
               <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">Accuracy Tips</p>
               <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Keep your phone flat on your palm. Move your device in a 'Figure-8' motion to calibrate the internal magnetometer. Avoid using near large metal objects or magnetic cases.
               </p>
            </div>
          </div>

          <button 
            onClick={() => { setPermissionState('prompt'); setHeading(null); setLocation(null); }}
            className="mx-auto flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors"
          >
             <RefreshCw size={14} /> Recalibrate Sensors
          </button>
        </div>
      )}
    </div>
  );
};

export default QiblaFinder;
