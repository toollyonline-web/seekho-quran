
import React, { useState, useEffect, useRef } from 'react';
import { Compass, MapPin, Navigation, Info, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

const QiblaFinder: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Calculate Qibla direction using the Great Circle formula
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

  useEffect(() => {
    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Get Location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(calculateQibla(latitude, longitude));
      },
      (err) => {
        setError("Location access denied. We need your location to calculate the Qibla direction.");
      }
    );

    // Handle orientation if not iOS (iOS needs manual click)
    if (!ios) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Fixed: Cast the event to any to support webkitCompassHeading for iOS
  const handleOrientation = (e: any) => {
    let compass = 0;
    // Standard absolute orientation
    if (e.webkitCompassHeading !== undefined) {
      compass = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      // For some Android devices
      compass = 360 - e.alpha;
    }
    setHeading(compass);
  };

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setPermissionGranted(true);
        }
      } catch (err) {
        setError("Orientation permission rejected.");
      }
    } else {
      setPermissionGranted(true);
    }
  };

  const isAligned = heading !== null && qiblaDirection !== null && Math.abs(heading - qiblaDirection) < 5;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in duration-700 min-h-[80vh] flex flex-col items-center">
      <header className="text-center mb-12 w-full">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Compass size={32} />
        </div>
        <h1 className="text-4xl font-bold mb-2">Qibla Finder</h1>
        <p className="text-slate-500">Align your device to find the direction of Kaaba.</p>
      </header>

      {error ? (
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4 mb-8 w-full">
          <AlertTriangle className="shrink-0" />
          <div>
            <p className="font-bold mb-1">Compass Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      ) : isIOS && !permissionGranted ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-xl text-center space-y-6 w-full mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto"><Navigation /></div>
          <h2 className="text-xl font-bold">Calibration Required</h2>
          <p className="text-sm text-slate-500">iOS requires permission to access your device's orientation sensors.</p>
          <button 
            onClick={requestPermission}
            className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg"
          >
            Enable Compass
          </button>
        </div>
      ) : null}

      {/* Compass UI */}
      <div className="relative mt-12 mb-20 group">
        {/* Background Glow when aligned */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 -z-10 ${isAligned ? 'bg-green-400/30 scale-125' : 'bg-transparent'}`}></div>

        <div className="w-72 h-72 rounded-full bg-white dark:bg-slate-800 shadow-2xl border-8 border-slate-50 dark:border-slate-900 flex items-center justify-center relative">
          
          {/* Compass Ring */}
          <div 
            className="absolute inset-2 border border-slate-100 dark:border-slate-700 rounded-full transition-transform duration-300"
            style={{ transform: `rotate(${- (heading || 0)}deg)` }}
          >
             {['N', 'E', 'S', 'W'].map((dir, i) => (
                <span 
                  key={dir} 
                  className="absolute font-black text-slate-300 dark:text-slate-600 text-sm"
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

          {/* Qibla Indicator (Fixed relative to compass) */}
          {qiblaDirection !== null && (
            <div 
              className="absolute inset-0 transition-transform duration-300"
              style={{ transform: `rotate(${qiblaDirection - (heading || 0)}deg)` }}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white shadow-lg animate-bounce">
                   <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase mt-2 tracking-widest">KAABA</span>
              </div>
            </div>
          )}

          {/* Device Direction Indicator */}
          <div className={`w-2 h-40 rounded-full absolute transition-all duration-300 ${isAligned ? 'bg-green-600 scale-y-110 shadow-[0_0_20px_rgba(22,101,52,0.6)]' : 'bg-slate-200 dark:bg-slate-700'}`}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-current rounded-full"></div>
          </div>

          {/* Info in Center */}
          <div className="text-center z-10">
            <p className="text-4xl font-mono font-black text-slate-800 dark:text-white leading-none">
              {Math.round(heading || 0)}°
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Heading
            </p>
          </div>
        </div>

        {/* Alignment Indicator */}
        <div className={`mt-12 text-center transition-all duration-500 transform ${isAligned ? 'scale-110' : 'scale-100'}`}>
          {isAligned ? (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto animate-pulse">
              <CheckCircle2 size={18} /> Perfectly Aligned
            </div>
          ) : (
            <p className="text-slate-400 text-xs font-medium">Turn device until needle hits the icon</p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Your Location</p>
            <p className="text-xs font-bold truncate">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting...'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Qibla Angle</p>
            <p className="text-xs font-bold">{qiblaDirection ? `${Math.round(qiblaDirection)}°` : '--'}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
            For best accuracy, hold your device flat like a real compass and stay away from large metal objects or electronic devices that may cause interference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;
