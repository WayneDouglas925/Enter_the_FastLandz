import React from 'react';
import { Clock, Coffee, Moon, Zap } from 'lucide-react';

export const TrialStrategy: React.FC = () => {
  const strategies = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'The Long Haul',
      description: 'Fast for 20 hours straight with 1 hour meal window.',
      tip: 'Best for experienced fasters',
      color: 'cyan',
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Break Fast Strategy',
      description: 'Break your fast the next morning with a light meal.',
      tip: 'Easier on the body',
      color: 'pink',
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: 'Sleep Protocol',
      description: 'Fast during waking hours, sleep through the hardest part.',
      tip: '14 hours awake + 6 hours sleep',
      color: 'orange',
    },
  ];

  const survivalTips = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Electrolytes & Bone Broth',
      description: 'Add salt, magnesium, potassium to water. Bone broth is allowed if needed.',
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: 'Conservation Mode',
      description: 'Optional downtime. Don\'t push through extreme fatigue.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Strategy Cards */}
      <div className="bg-stone-900/50 border border-stone-800 p-1">
        <div className="bg-stone-950 p-6 md:p-8">
          <div className="flex items-center text-white mb-6">
            <Clock className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Choose Your Strategy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-stone-900 border border-stone-700 hover:border-stone-600 p-5 group transition-all"
              >
                <div className={`
                  text-${strategy.color}-400 mb-4
                  ${strategy.color === 'cyan' && 'text-cyan-400'}
                  ${strategy.color === 'pink' && 'text-pink-400'}
                  ${strategy.color === 'orange' && 'text-orange-400'}
                `}>
                  {strategy.icon}
                </div>

                <h4 className="font-display text-lg uppercase tracking-wider text-white mb-2">
                  {strategy.title}
                </h4>

                <p className="text-sm text-stone-400 mb-3 leading-relaxed">
                  {strategy.description}
                </p>

                <div className="flex items-center">
                  <span className="text-[9px] text-stone-600 uppercase border border-stone-800 px-2 py-1">
                    {strategy.tip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Survival Tips */}
      <div className="bg-stone-900/50 border border-stone-800 p-1">
        <div className="bg-stone-950 p-6 md:p-8">
          <div className="flex items-center text-white mb-6">
            <Zap className="w-5 h-5 text-pink-500 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Survival Tips</h3>
          </div>

          <div className="space-y-4">
            {survivalTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-stone-900 border border-stone-800"
              >
                <div className="text-pink-500 mr-4 mt-1">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-white uppercase tracking-wider mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mindset Check */}
          <div className="mt-6 p-4 border-l-4 border-cyan-400 bg-cyan-500/10">
            <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
              Mindset Check
            </p>
            <p className="text-stone-300 italic text-sm">
              "Hunger is a sensation, not an emergency. Your body has everything it needs stored away."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
