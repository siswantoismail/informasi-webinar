import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface CountdownCardProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  totalMilliseconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
  subLabel?: string;
  isSeconds?: boolean;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label, subLabel, isSeconds }) => {
  const formattedValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Digit Card Container in White and Blue theme */}
      <div className="relative group w-18 sm:w-26 md:w-30 lg:w-34 h-20 sm:h-26 md:h-30 lg:h-34 rounded-2xl bg-white border-2 border-blue-100 shadow-xl shadow-blue-900/10 flex items-center justify-center overflow-hidden">
        {/* Subtle top gloss reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none" />

        {/* Central hairline divider mimicking classic flip clock */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-blue-100 shadow-[0_1px_0_rgba(255,255,255,0.9)] z-10" />

        {/* Side notch pegs */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-3 bg-slate-100 rounded-r border border-blue-200 z-20" />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-3 bg-slate-100 rounded-l border border-blue-200 z-20" />

        {/* Animated Digit */}
        <div className="relative z-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={formattedValue}
              initial={{ y: -26, opacity: 0.25, filter: 'blur(2px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 26, opacity: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`font-mono-num font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl ${
                isSeconds ? 'text-blue-600 drop-shadow-[0_2px_12px_rgba(37,99,235,0.25)]' : 'text-slate-900'
              }`}
            >
              {formattedValue}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Corner tech accent */}
        <div className="absolute bottom-1 right-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase hidden sm:block">
          {label.slice(0, 3)}
        </div>
      </div>

      {/* Label */}
      <span className="mt-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-700">
        {label}
      </span>
      {subLabel && (
        <span className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
          {subLabel}
        </span>
      )}
    </div>
  );
};

export const CountdownCard: React.FC<CountdownCardProps> = ({
  days,
  hours,
  minutes,
  seconds,
  isComplete
}) => {
  const hasTriggeredCelebration = useRef(false);

  useEffect(() => {
    if (isComplete && !hasTriggeredCelebration.current) {
      hasTriggeredCelebration.current = true;
      soundEngine.playCelebrationChime();
      
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#2563eb', '#0284c7', '#38bdf8', '#10b981']
        });
      } catch {
        // Fallback
      }
    } else if (!isComplete) {
      hasTriggeredCelebration.current = false;
    }
  }, [isComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Tulisan Kegiatan Akan Segera Dimulai Banner */}
      <div className="mb-4 sm:mb-5 flex items-center justify-center">
        {isComplete ? (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-500/15">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              Webinar Sedang Berlangsung Sekarang
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-800 shadow-sm shadow-blue-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              Kegiatan Akan Segera Dimulai
            </span>
          </div>
        )}
      </div>

      {/* Countdown Grid with Colons */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
        <TimeUnit value={days} label="Hari" subLabel="Days" />
        
        <div className="text-2xl sm:text-4xl text-blue-300 font-mono font-bold pb-6 sm:pb-7 animate-pulse">
          :
        </div>

        <TimeUnit value={hours} label="Jam" subLabel="Hours" />

        <div className="text-2xl sm:text-4xl text-blue-300 font-mono font-bold pb-6 sm:pb-7 animate-pulse">
          :
        </div>

        <TimeUnit value={minutes} label="Menit" subLabel="Minutes" />

        <div className="text-2xl sm:text-4xl text-blue-300 font-mono font-bold pb-6 sm:pb-7 animate-pulse">
          :
        </div>

        <TimeUnit value={seconds} label="Detik" subLabel="Seconds" isSeconds={true} />
      </div>
    </div>
  );
};
