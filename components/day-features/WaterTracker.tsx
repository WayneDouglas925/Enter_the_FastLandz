import React, { useState } from 'react';
import { Droplet } from 'lucide-react';

interface WaterTrackerProps {
  targetCups?: number;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ targetCups = 8 }) => {
  const [cupsCompleted, setCupsCompleted] = useState<boolean[]>(
    Array(targetCups).fill(false)
  );

  React.useEffect(() => {
    setCupsCompleted(prev => {
      if (prev.length === targetCups) return prev;

      const newCups = Array(targetCups).fill(false);
      // Preserve existing completion state up to the new length
      for (let i = 0; i < Math.min(prev.length, targetCups); i++) {
        newCups[i] = prev[i];
      }

      // Only update if something actually changed to avoid extra renders
      if (newCups.length === prev.length && newCups.every((v, i) => v === prev[i])) {
        return prev;
      }

      return newCups;
    });
  }, [targetCups]);
  const toggleCup = (index: number) => {
    const newCups = [...cupsCompleted];
    newCups[index] = !newCups[index];
    setCupsCompleted(newCups);
  };

  const completedCount = cupsCompleted.filter(Boolean).length;
  const percentage = (completedCount / targetCups) * 100;

  return (
    <div className="bg-stone-900/50 border border-stone-800 p-1">
      <div className="bg-stone-950 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center text-white">
            <Droplet className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Water Tracker</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display text-cyan-400">
              {completedCount}/{targetCups}
            </div>
            <div className="text-xs text-stone-500 uppercase tracking-wider">Cups</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-stone-900 border border-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-stone-500 mt-2 uppercase tracking-wider">
            {completedCount === targetCups ? 'Target Reached!' : `${targetCups - completedCount} cups remaining`}
          </p>
        </div>

        {/* Cup Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cupsCompleted.map((completed, index) => (
            <button
              key={index}
              onClick={() => toggleCup(index)}
              className={`
                aspect-square border-2 transition-all transform hover:scale-105 active:scale-95
                ${completed
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'bg-stone-900 border-stone-700 hover:border-stone-600'
                }
              `}
            >
              <Droplet
                className={`
                  w-full h-full p-2
                  ${completed ? 'text-cyan-400' : 'text-stone-700'}
                `}
              />
            </button>
          ))}
        </div>

        {completedCount === targetCups && (
          <div className="mt-6 text-center p-4 bg-cyan-500/10 border border-cyan-400/30">
            <p className="text-cyan-400 font-display uppercase tracking-wider">
              Hydration Complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
