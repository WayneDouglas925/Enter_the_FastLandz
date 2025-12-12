import React, { useEffect, useState, useMemo } from 'react';
import { FastState, ChallengeData } from '../types';
import { Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';

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
      const now = Date.now();
      
      if (fastState.isPaused && fastState.pausedAt) {
        // If paused, time stands still relative to the paused moment
        // But for display, we just show the state when it paused
        return; 
      }

      // Adjust target end time by total paused time if needed, 
      // but usually we want to just push the end time. 
      // Simplified: Target Time is fixed, but if we pause, we might need to extend.
      // For this implementation, we will calculate based on Duration vs Elapsed.
      
      const startTime = fastState.startTime || now;
      const targetTime = fastState.targetEndTime;
      
      // Calculate effective end time considering pauses (if we were implementing complex pause logic)
      // For now, let's assume targetEndTime was updated when resumed.
      
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

  // Format time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Config
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color shift
  const strokeColor = useMemo(() => {
    if (progress < 33) return '#dc2626'; // Red-600
    if (progress < 66) return '#ca8a04'; // Yellow-600
    return '#65a30d'; // Lime-600 (Toxic Green)
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in w-full max-w-md mx-auto">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl text-rust tracking-wider uppercase mb-1">
          {currentChallenge.title}
        </h2>
        <p className="font-body text-stone-400 text-sm tracking-widest">
          {fastState.isPaused ? "STATUS: FROZEN" : "STATUS: SURVIVING"}
        </p>
      </div>

      {/* Donut Chart */}
      <div className="relative w-72 h-72">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
          {/* Background Ring */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#1c1917" // Stone-900
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-white tracking-widest drop-shadow-lg">
            {formatTime(timeLeft)}
          </span>
          <span className="font-body text-stone-500 text-xs mt-2 uppercase tracking-widest">
            Remaining
          </span>
          <span className="font-body text-rust font-bold text-lg mt-1">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full bg-stone-900/50 p-4 border border-stone-800 rounded-sm">
        <div className="text-center">
          <p className="text-stone-500 text-xs uppercase">Start</p>
          <p className="text-stone-300 font-mono">
            {fastState.startTime ? new Date(fastState.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-stone-500 text-xs uppercase">Target</p>
          <p className="text-stone-300 font-mono">
            {fastState.targetEndTime ? new Date(fastState.targetEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full space-x-4">
        <button 
          onClick={onPauseToggle}
          className={`flex-1 flex items-center justify-center p-4 border-2 font-display uppercase tracking-wider transition-colors
            ${fastState.isPaused 
              ? 'border-toxic text-toxic hover:bg-toxic/10' 
              : 'border-dust text-dust hover:bg-dust/10'}`}
        >
          {fastState.isPaused ? <Play className="mr-2 w-5 h-5"/> : <Pause className="mr-2 w-5 h-5"/>}
          {fastState.isPaused ? "Resume" : "Pause"}
        </button>
        
        <button 
          onClick={onEndEarly}
          className="flex-1 flex items-center justify-center p-4 border-2 border-blood text-blood font-display uppercase tracking-wider hover:bg-blood/10 transition-colors"
        >
          <AlertTriangle className="mr-2 w-5 h-5" />
          Abort
        </button>
      </div>

      {/* Motivation */}
      <div className="text-center max-w-xs">
         <p className="font-body italic text-stone-500 text-sm">
           "{quote}"
         </p>
      </div>

    </div>
  );
};