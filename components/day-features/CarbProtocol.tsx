import React, { useState } from 'react';
import { Wheat, Flame, Shield } from 'lucide-react';

type ProtocolType = 'zero-carb' | 'low-carb' | 'moderate-carb' | null;

interface Protocol {
  id: ProtocolType;
  name: string;
  description: string;
  carbLimit: string;
  icon: React.ReactNode;
  difficulty: string;
}

export const CarbProtocol: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>(null);
  const [mealPlan, setMealPlan] = useState('');

  const protocols: Protocol[] = [
    {
      id: 'zero-carb',
      name: 'Zero Carb',
      description: 'Pure carnivore. Meat, eggs, fat only.',
      carbLimit: '0-5g',
      icon: <Shield className="w-6 h-6" />,
      difficulty: 'Extreme',
    },
    {
      id: 'low-carb',
      name: 'Low Carb',
      description: 'Protein + fat + leafy greens.',
      carbLimit: '20-50g',
      icon: <Flame className="w-6 h-6" />,
      difficulty: 'Hard',
    },
    {
      id: 'moderate-carb',
      name: 'Moderate Carb',
      description: 'Some complex carbs allowed.',
      carbLimit: '50-100g',
      icon: <Wheat className="w-6 h-6" />,
      difficulty: 'Moderate',
    },
  ];

  return (
    <div className="bg-stone-900/50 border border-stone-800 p-1">
      <div className="bg-stone-950 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center text-white">
            <Wheat className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Carb Protocol</h3>
          </div>
          {selectedProtocol && (
            <span className="text-xs text-cyan-400 font-mono uppercase border border-cyan-400/30 px-3 py-1 bg-cyan-400/10">
              Selected
            </span>
          )}
        </div>

        <p className="text-stone-400 text-sm mb-6 leading-relaxed">
          Choose your carb strategy for today's fast. The lower the carbs, the faster you enter ketosis.
        </p>

        {/* Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol.id)}
              className={`
                p-5 border-2 transition-all text-left group
                ${selectedProtocol === protocol.id
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-stone-900 border-stone-700 hover:border-stone-600'
                }
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={selectedProtocol === protocol.id ? 'text-cyan-400' : 'text-stone-500'}>
                  {protocol.icon}
                </div>
                <span className={`
                  text-[9px] font-mono uppercase px-2 py-1
                  ${selectedProtocol === protocol.id
                    ? 'text-cyan-400 border border-cyan-400/30 bg-cyan-400/10'
                    : 'text-stone-600 border border-stone-800'
                  }
                `}>
                  {protocol.difficulty}
                </span>
              </div>

              <h4 className={`
                font-display text-lg uppercase tracking-wider mb-2
                ${selectedProtocol === protocol.id ? 'text-cyan-400' : 'text-white'}
              `}>
                {protocol.name}
              </h4>

              <p className="text-sm text-stone-500 mb-3 leading-relaxed">
                {protocol.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-600 uppercase">Daily Limit</span>
                <span className={`
                  text-sm font-mono font-bold
                  ${selectedProtocol === protocol.id ? 'text-cyan-400' : 'text-white'}
                `}>
                  {protocol.carbLimit}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Meal Plan */}
        {selectedProtocol && (
          <div className="border-t border-stone-800 pt-6 animate-fade-in">
            <label className="block text-stone-400 text-sm uppercase tracking-wider mb-2">
              Meal Plan for Break-Fast
            </label>
            <textarea
              value={mealPlan}
              onChange={(e) => setMealPlan(e.target.value)}
              placeholder="Example: 3 eggs, bacon, avocado, black coffee"
              className="w-full bg-black border border-stone-800 text-white p-4 text-sm font-mono focus:border-cyan-400 outline-none transition-colors min-h-[100px] resize-none"
            />

            <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-400/30">
              <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
                Protocol Tip
              </p>
              <p className="text-sm text-stone-400">
                {selectedProtocol === 'zero-carb' && 'Focus on fatty cuts of meat. The fat keeps you satisfied longer.'}
                {selectedProtocol === 'low-carb' && 'Add leafy greens for fiber, but skip starchy vegetables.'}
                {selectedProtocol === 'moderate-carb' && 'Choose complex carbs like sweet potato or quinoa, not bread or pasta.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
