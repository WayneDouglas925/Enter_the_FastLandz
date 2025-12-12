import React, { useEffect, useState, useMemo } from 'react';
import { FastState, ChallengeData } from '../types';
import { Play, Pause, AlertTriangle, Zap, Radio, ChevronRight, Activity } from 'lucide-react';

interface TimerDisplayProps {
  fastState: FastState;
  currentChallenge: ChallengeData;
  onPauseToggle: () => void;
  onEndEarly: () => void;
  onComplete: () => void;
  quote: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  fastState, 
  currentChallenge, 
  onPauseToggle, 
  onEndEarly, 
  onComplete,
  quote
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!fastState.isActive || !fastState.targetEndTime) return;

    const interval = setInterval(() => {
      // If paused, don't update the timer - keep it frozen
      if (fastState.isPaused && fastState.pausedAt) {
        return;
      }

      const now = Date.now();
      const startTime = fastState.startTime || now;
      const targetTime = fastState.targetEndTime;

      const totalDuration = targetTime - startTime;
      const elapsed = now - startTime - fastState.totalPausedTime;
      const remaining = Math.max(0, totalDuration - elapsed);

      setTimeLeft(remaining);
      const prog = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(prog);

      if (remaining <= 0 && fastState.isActive) {
        onComplete();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fastState, onComplete]);

  // Format time - Digital Clock Style
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    // Split for digital effect styling if needed, but string is fine for now
    return {
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
    };
  };

  const timeObj = formatTime(timeLeft);

  // SVG Config - Thinner Ring
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full animate-fade-in pb-20 md:pb-0 flex flex-col items-center">
      
      {/* Title Section */}
      <div className="text-center mb-8 md:mb-12 mt-4">
         <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tighter mb-2">
           Day {currentChallenge.day}: <span className="text-stone-500">{currentChallenge.title}</span>
         </h1>
         <div className="h-0.5 w-16 bg-stone-800 mx-auto mb-4"></div>
         <p className="text-stone-500 text-xs uppercase tracking-[0.3em]">
             Survive the hunger. The oasis awaits.
         </p>
      </div>

      {/* Main Timer Graphic */}
      <div className="relative mb-12">
         <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
                {/* Track */}
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="#1c1917"
                    strokeWidth="4"
                    fill="transparent"
                />
                {/* Indicator */}
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="url(#gradient)" // Use gradient definition
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(194,65,12,0.5)]"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c2d12" /> {/* deep rust */}
                    <stop offset="100%" stopColor="#ea580c" /> {/* bright orange */}
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <p className="text-[10px] md:text-xs text-stone-500 uppercase tracking-[0.2em] mb-4">Time Remaining</p>
                 
                 <div className="flex items-baseline font-display text-white text-6xl md:text-8xl tracking-widest drop-shadow-2xl">
                     <span className="tabular-nums">{timeObj.h}</span>
                     <span className="text-stone-700 mx-1">:</span>
                     <span className="tabular-nums">{timeObj.m}</span>
                     <span className="text-stone-700 mx-1">:</span>
                     <span className="tabular-nums text-rust">{timeObj.s}</span>
                 </div>

                 {/* Status Pill */}
                 <div className="mt-6 border border-rust/30 bg-rust/10 px-4 py-1.5 rounded-full flex items-center">
                     <span className="w-1.5 h-1.5 bg-rust rounded-full animate-pulse mr-2"></span>
                     <span className="text-[10px] text-rust uppercase font-bold tracking-widest">Burning Fat</span>
                 </div>
            </div>
         </div>
      </div>

      {/* Transmission / Quote Box */}
      <div className="w-full max-w-2xl bg-stone-900/50 border-l-2 border-rust p-4 mb-10 flex items-start space-x-4">
          <Radio className="w-5 h-5 text-rust mt-1 flex-shrink-0" />
          <div>
              <p className="text-[10px] text-rust font-bold uppercase mb-1 flex items-center">
                  Transmission Incoming <span className="w-2 h-2 bg-rust ml-2 animate-pulse rounded-full"></span>
              </p>
              <p className="text-stone-400 text-sm font-mono leading-relaxed">
                  "{quote}"
              </p>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
          <div className="bg-stone-950 border border-stone-800 p-4">
              <div className="flex items-center text-stone-600 mb-2">
                  <Play className="w-3 h-3 mr-2" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Start Time</span>
              </div>
              <p className="text-xl font-display text-white">
                 {fastState.startTime ? new Date(fastState.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
              </p>
          </div>

          <div className="bg-stone-950 border border-stone-800 p-4">
              <div className="flex items-center text-stone-600 mb-2">
                  <Activity className="w-3 h-3 mr-2" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Target End</span>
              </div>
              <p className="text-xl font-display text-white">
                 {fastState.targetEndTime ? new Date(fastState.targetEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
              </p>
          </div>

          <div className="bg-stone-950 border border-stone-800 p-4">
              <div className="flex items-center text-stone-600 mb-2">
                  <Zap className="w-3 h-3 mr-2" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Fast Type</span>
              </div>
              <p className="text-xl font-display text-white">
                 Warrior
              </p>
              <p className="text-[9px] text-stone-500 font-mono">16:8 Protocol</p>
          </div>

           <div className="bg-stone-950 border border-stone-800 p-4">
              <div className="flex items-center text-stone-600 mb-2">
                  <Activity className="w-3 h-3 mr-2" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Status</span>
              </div>
              <p className="text-xl font-display text-rust uppercase">
                 {fastState.isPaused ? "Paused" : "Fasting"}
              </p>
          </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
          <button 
             onClick={onPauseToggle}
             className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white px-8 py-3 flex items-center font-display uppercase tracking-wider text-sm transition-colors"
          >
              {fastState.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {fastState.isPaused ? "Resume" : "Pause"}
          </button>

          <button 
             onClick={onEndEarly}
             className="bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 text-red-500 px-8 py-3 flex items-center font-display uppercase tracking-wider text-sm transition-colors"
          >
              <AlertTriangle className="w-4 h-4 mr-2" />
              End Early
          </button>
      </div>

    </div>
  );
};