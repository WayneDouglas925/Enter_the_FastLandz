import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FastState, ChallengeData } from '../types';
import { Play, Pause, AlertTriangle, Zap, Radio, Activity } from 'lucide-react';
import { getRemainingMs } from '../lib/timer';

interface TimerDisplayProps {
  fastState: FastState;
  challengeData: ChallengeData;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  fastState,
  challengeData,
  onPause,
  onResume,
  onComplete,
}) => {
  const [now, setNow] = useState(Date.now());
  const frozenRef = useRef<number | null>(null);

  // Update 'now' every second if active and not paused
  useEffect(() => {
    if (!fastState.isActive || fastState.isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [fastState.isActive, fastState.isPaused]);

  // Calculate remaining time
  // If paused, we want to show the time at the moment of pause (or keep it static).
  // However, getRemainingMs handles the math.
  // To prevent UI flicker or drift while paused, we can memoize or just rely on getRemainingMs
  // which uses totalPausedTime.
  // If we are paused, 'now' isn't updating, so the display should be stable.
  // But if we want to be extra safe, we can use the pausedAt time if available.

  const remainingMs = useMemo(() => {
    if (fastState.isPaused && fastState.pausedAt) {
      // If paused, show remaining time relative to when it was paused
      // This prevents the countdown from jumping if we re-render
      if (frozenRef.current === null) {
        frozenRef.current = getRemainingMs(fastState, fastState.pausedAt);
      }
      return frozenRef.current;
    }
    
    frozenRef.current = null;
    return getRemainingMs(fastState, now);
  }, [fastState, now]);

  // Check for completion
  useEffect(() => {
    if (fastState.isActive && !fastState.isPaused && remainingMs <= 0) {
      onComplete();
    }
  }, [remainingMs, fastState.isActive, fastState.isPaused, onComplete]);

  // Format time helper
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (!fastState.durationHours) return 0;
    const totalMs = fastState.durationHours * 3600 * 1000;
    const elapsed = totalMs - remainingMs;
    return Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
  }, [fastState.durationHours, remainingMs]);

  if (!fastState.isActive) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8 group">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-stone-800 group-hover:border-stone-700 transition-colors"></div>
        
        {/* Progress ring (svg) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-stone-800"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className={`text-rust transition-all duration-1000 ease-linear ${fastState.isPaused ? 'opacity-50' : 'opacity-100'}`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-stone-500 text-xs font-mono uppercase tracking-widest mb-2">
            {fastState.isPaused ? 'Paused' : 'Time Remaining'}
          </div>
          <div className={`font-display text-5xl tabular-nums tracking-tight ${fastState.isPaused ? 'text-stone-500' : 'text-white'}`}>
            {formatTime(remainingMs)}
          </div>
          <div className="mt-2 text-rust text-sm font-mono">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!fastState.isPaused ? (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 border border-stone-800 hover:border-rust/50 text-white rounded transition-all group"
          >
            <Pause className="w-4 h-4 group-hover:text-rust" />
            <span className="font-display uppercase tracking-wider text-sm">Pause Fast</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-6 py-3 bg-rust hover:bg-orange-600 text-white rounded transition-all shadow-lg shadow-orange-900/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="font-display uppercase tracking-wider text-sm">Resume Fast</span>
          </button>
        )}
      </div>

      {/* Current Phase Info */}
      <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-lg backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-stone-950 rounded border border-stone-800">
            <Activity className="w-6 h-6 text-rust" />
          </div>
          <div>
            <h3 className="text-white font-display uppercase tracking-wide mb-1">
              Metabolic State
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              {progress < 25 && "Your body is digesting your last meal and blood sugar levels are stabilizing."}
              {progress >= 25 && progress < 50 && "Glycogen stores are being depleted. You might feel hungry - this is normal."}
              {progress >= 50 && progress < 75 && "Fat burning is increasing. Ketone production has started."}
              {progress >= 75 && "Deep ketosis. Autophagy may be active. Peak mental clarity."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
