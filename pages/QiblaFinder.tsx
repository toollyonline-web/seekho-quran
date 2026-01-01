
import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, Info, AlertTriangle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

const QiblaFinder: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [locationPending, setLocationPending] = useState(true);

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

  const requestLocation = () => {
    setLocationPending(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(calculateQibla(latitude, longitude));
        setLocationPending(false);
      },
      (err) => {
        setError("Location access is required to calculate the direction to Makkah. Please enable location services in your browser settings.");
        setLocationPending(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);
    requestLocation();

    if (!ios) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleOrientation = (e: any) => {
    let compass = 0;
    if (e.webkitCompassHeading !== undefined) {
      compass = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      compass = 360 - e.alpha;
    }
    setHeading(compass);
  };

  const requestSensorPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setPermissionGranted(true);
        }
      } catch (err) {
        setError("Compass sensor permission rejected.");
      }
    } else {
      setPermissionGranted(true);
    }
  };

  const isAligned = heading !== null && qiblaDirection !== null && Math.abs(heading - qiblaDirection) < 5;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in duration-700 min-h-[80vh] flex flex-col items-center">
      <header className="text-center mb-12 w-full">
        <div className="w-16 h-16 bg-emerald-600/10 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Compass size={32} />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter">Qibla Finder</h1>
        <p className="text-slate-500 font-medium mt-2">Accurate direction to the Holy Kaaba</p>
      </header>

      {locationPending ? (
        <div className="text-center py-20 space-y-4">
           <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checking Permissions...</p>
        </div>
      ) : !location ? (
        <div className="quran-card p-10 rounded-[3rem] text-center space-y-8 w-full border-rose-500/20 shadow-2xl">
           <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto">
              <MapPin size={40} />
           </div>
           <div className="space-y-3">
              <h2 className="text-2xl font-black italic text-white">Location Access Required</h2>
              <p className="text-slate-500 leading-relaxed">
                 To find the Qibla, we need to know your current coordinates. Your privacy is our priority—this data never leaves your device.
              </p>
           </div>
           <div className="bg-emerald-600/10 p-4 rounded-2xl flex items-start gap-3 border border-emerald-500/20 text-left">
              <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-relaxed">
                 Privacy Guaranteed: Local Processing Only.
              </p>
           </div>
           <button 
             onClick={requestLocation}
             className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl"
           >
              Allow Location Access
           </button>
        </div>
      ) : isIOS && !permissionGranted ? (
        <div className="quran-card p-10 rounded-[3rem] text-center space-y-6 w-full shadow-xl">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner"><Navigation /></div>
          <h2 className="text-xl font-black italic">Sensor Calibration</h2>
          <p className="text-sm text-slate-500">iOS requires manual permission to access the device's magnetic compass sensor.</p>
          <button 
            onClick={requestSensorPermission}
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
          >
            Enable Compass
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-8 mb-16 group">
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 -z-10 ${isAligned ? 'bg-emerald-500/30 scale-125' : 'bg-transparent'}`}></div>
            <div className="w-72 h-72 rounded-full bg-slate-900 shadow-2xl border-8 border-white/5 flex items-center justify-center relative">
              <div 
                className="absolute inset-2 border border-white/5 rounded-full transition-transform duration-300"
                style={{ transform: `rotate(${- (heading || 0)}deg)` }}
              >
                 {['N', 'E', 'S', 'W'].map((dir, i) => (
                    <span 
                      key={dir} 
                      className="absolute font-black text-slate-700 text-sm"
                      style={{ 
                        top: i === 0 ? '4%' : i === 2 ? '90%' : '50%',
                        left: i === 3 ? '4%' : i === 1 ? '90%' : '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 90}deg)`
                      }}
                    >
                      {dir}
                    </span>
                 ))}
              </div>

              {qiblaDirection !== null && (
                <div 
                  className="absolute inset-0 transition-transform duration-300"
                  style={{ transform: `rotate(${qiblaDirection - (heading || 0)}deg)` }}
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg animate-bounce">
                       <CheckCircle2 size={24} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase mt-2 tracking-[0.3em]">KAABA</span>
                  </div>
                </div>
              )}

              <div className={`w-1.5 h-36 rounded-full absolute transition-all duration-300 ${isAligned ? 'bg-emerald-500 scale-y-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'bg-slate-700'}`}>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-current rounded-full ring-4 ring-slate-900"></div>
              </div>

              <div className="text-center z-10">
                <p className="text-4xl font-mono font-black text-white leading-none">
                  {Math.round(heading || 0)}°
                </p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">
                  Heading
                </p>
              </div>
            </div>

            <div className={`mt-12 text-center transition-all duration-500 transform ${isAligned ? 'scale-110' : 'scale-100'}`}>
              {isAligned ? (
                <div className="bg-emerald-600/10 text-emerald-500 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 mx-auto animate-pulse border border-emerald-500/20 shadow-xl shadow-emerald-900/10">
                  <CheckCircle2 size={18} /> Perfectly Aligned
                </div>
              ) : (
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-6 py-2.5 rounded-full border border-white/5">
                   <Lock size={12} /> Rotate device toward marker
                </div>
              )}
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Location Status</p>
                <p className="text-xs font-black text-emerald-500 flex items-center gap-2">
                  <MapPin size={12} /> {location ? 'Verified' : 'Detecting...'}
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Qibla Angle</p>
                <p className="text-xs font-black text-white">{qiblaDirection ? `${Math.round(qiblaDirection)}°` : '--'}</p>
              </div>
            </div>

            <div className="bg-blue-600/5 p-5 rounded-[2rem] border border-blue-500/10 flex items-start gap-4">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Calibration Tip: Move your device in a "figure-8" motion and keep it flat on your palm for maximum precision.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaFinder;
