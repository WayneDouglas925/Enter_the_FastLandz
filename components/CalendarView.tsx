import React from 'react';
import { UserProgress, ChallengeData } from '../types';
import { Lock, Check, X, Skull } from 'lucide-react';

interface CalendarViewProps {
  progress: UserProgress;
  challenges: ChallengeData[];
  onSelectDay: (day: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  progress, 
  challenges,
  onSelectDay
}) => {
  // Generate a 30-day grid, but only populate data for the first 7 (Challenge)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md mx-auto pb-20 animate-fade-in">
      <div className="border-l-4 border-toxic pl-4 mb-6">
        <h2 className="font-display text-3xl text-white uppercase">Progress Map</h2>
        <p className="text-stone-400 font-body">The road to the citadel</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {days.map((day) => {
          const isUnlocked = day <= progress.unlockedDays;
          const isCompleted = progress.completedDays.includes(day);
          const isFailed = progress.failedDays.includes(day);
          const isCurrent = day === progress.currentDay && !isCompleted && !isFailed;
          const hasChallenge = day <= 7;

          return (
            <button
              key={day}
              onClick={() => isUnlocked ? onSelectDay(day) : null}
              disabled={!isUnlocked}
              className={`
                aspect-square flex flex-col items-center justify-center border relative overflow-hidden transition-all
                ${isCompleted ? 'bg-toxic/20 border-toxic text-toxic' : ''}
                ${isFailed ? 'bg-blood/20 border-blood text-blood' : ''}
                ${isCurrent ? 'bg-dust/20 border-dust text-dust ring-2 ring-dust ring-opacity-50 animate-pulse' : ''}
                ${!isUnlocked ? 'bg-stone-900 border-stone-800 text-stone-700 opacity-50 cursor-not-allowed' : ''}
                ${isUnlocked && !isCompleted && !isFailed && !isCurrent ? 'bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-400' : ''}
              `}
            >
              {/* Background Icon Faded */}
              {hasChallenge && (
                <Skull className={`absolute w-8 h-8 opacity-10 ${isCompleted ? 'text-toxic' : 'text-stone-500'}`} />
              )}

              <span className="font-display text-lg z-10">{day}</span>
              
              <div className="absolute bottom-1 right-1 z-10">
                {isCompleted && <Check className="w-3 h-3" />}
                {isFailed && <X className="w-3 h-3" />}
                {!isUnlocked && <Lock className="w-3 h-3" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 gap-2 text-xs font-body text-stone-500 uppercase">
        <div className="flex items-center"><div className="w-3 h-3 bg-toxic/20 border border-toxic mr-2"></div> Conquered</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-dust/20 border border-dust mr-2"></div> Current Target</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-blood/20 border border-blood mr-2"></div> Failed</div>
        <div className="flex items-center"><div className="w-3 h-3 bg-stone-900 border border-stone-800 mr-2"></div> Locked</div>
      </div>
      
      {/* Badge Area */}
      {progress.completedDays.length >= 7 && (
        <div className="mt-8 p-4 border-2 border-toxic bg-toxic/10 text-center animate-bounce">
            <h3 className="font-display text-xl text-toxic mb-1">Initiation Complete</h3>
            <p className="text-stone-300 text-sm">You have entered the Hunger Zone.</p>
        </div>
      )}
    </div>
  );
};