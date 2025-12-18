import React, { useState } from 'react';
import { CheckCircle, Circle, X } from 'lucide-react';

interface SnackItem {
  time: string;
  food: string;
}

export const SnackAssassin: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState({
    noMorningSnack: false,
    noAfternoonSnack: false,
    noEveningSnack: false,
    noLateNightSnack: false,
  });

  const [confession, setConfession] = useState('');
  const [snacks, setSnacks] = useState<SnackItem[]>([]);

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checkboxes).every(Boolean);
  const checkedCount = Object.values(checkboxes).filter(Boolean).length;

  const checkboxItems = [
    { key: 'noMorningSnack' as const, label: 'No Morning Snack', time: '6AM - 12PM' },
    { key: 'noAfternoonSnack' as const, label: 'No Afternoon Snack', time: '12PM - 4PM' },
    { key: 'noEveningSnack' as const, label: 'No Evening Snack', time: '4PM - 8PM' },
    { key: 'noLateNightSnack' as const, label: 'No Late Night Snack', time: '8PM - 12AM' },
  ];

  return (
    <div className="bg-stone-900/50 border border-stone-800 p-1">
      <div className="bg-stone-950 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center text-white">
            <X className="w-5 h-5 text-pink-500 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Snack Elimination</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display text-pink-500">
              {checkedCount}/4
            </div>
            <div className="text-xs text-stone-500 uppercase tracking-wider">Zones Clear</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-stone-900 border border-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-300"
              style={{ width: `${(checkedCount / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          {checkboxItems.map(({ key, label, time }) => (
            <button
              key={key}
              onClick={() => toggleCheckbox(key)}
              className={`
                w-full p-4 border-2 transition-all text-left flex items-center justify-between group
                ${checkboxes[key]
                  ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                  : 'bg-stone-900 border-stone-700 hover:border-stone-600'
                }
              `}
            >
              <div className="flex items-center">
                {checkboxes[key] ? (
                  <CheckCircle className="w-5 h-5 text-pink-500 mr-3" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-600 mr-3" />
                )}
                <div>
                  <div className={`font-display uppercase tracking-wider ${checkboxes[key] ? 'text-pink-400' : 'text-white'}`}>
                    {label}
                  </div>
                  <div className="text-xs text-stone-500 font-mono">{time}</div>
                </div>
              </div>
              {checkboxes[key] && (
                <span className="text-xs text-pink-500 font-mono uppercase">✓ Clear</span>
              )}
            </button>
          ))}
        </div>

        {/* Confession Box (if they failed) */}
        <div className="border-t border-stone-800 pt-6">
          <label className="block text-stone-400 text-sm uppercase tracking-wider mb-2">
            Confession Zone (Be Honest)
          </label>
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder="If you snacked, write it here. No judgment. Only truth."
            className="w-full bg-black border border-stone-800 text-white p-4 text-sm font-mono focus:border-pink-500 outline-none transition-colors min-h-[100px] resize-none"
          />
        </div>

        {allChecked && (
          <div className="mt-6 text-center p-4 bg-pink-500/10 border border-pink-500/30">
            <p className="text-pink-500 font-display uppercase tracking-wider">
              Perfect Execution. No Snacks. Pure Discipline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
