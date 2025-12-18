import React, { useState } from 'react';
import { Skull, Shield, Droplet, Flame, Radio } from 'lucide-react';
import { saveDayFeatures } from '../../lib/dayFeatures';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../lib/hooks/useProgress';

interface BossFightProps {
  onCompleteBossFight?: (battleLog: string) => Promise<void> | void;
}

export const BossFight: React.FC<BossFightProps> = ({ onCompleteBossFight }) => {
  const [battleLog, setBattleLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { progress } = useProgress();

  const battleRules = [
    {
      icon: <Skull className="w-6 h-6" />,
      title: 'The Long Haul',
      description: 'Fast for 24 hours with 1 hour break OR 20 hours awake + finish after sleep.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Break Fast Strategy',
      description: 'Break your fast the next morning with a light meal.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      title: 'Conservation',
      description: 'Optional downtime with rest only. Don\'t push through extreme fatigue.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Live Transmission Header */}
      <div className="flex items-center justify-center mb-4">
        <Radio className="w-4 h-4 text-green-500 mr-2 animate-pulse" />
        <span className="text-xs text-green-500 font-mono uppercase tracking-widest">
          Live Transmission
        </span>
      </div>

      {/* Battle Rules */}
      <div className="bg-stone-900/50 border border-stone-800 p-1">
        <div className="bg-stone-950 p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center text-white">
              <Skull className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-display text-xl uppercase tracking-wider">Battle Rules</h3>
            </div>
            <span className="text-xs text-green-500 font-mono uppercase border border-green-500/30 px-3 py-1 bg-green-500/10 animate-pulse">
              Final Boss
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {battleRules.map((rule, index) => (
              <div
                key={index}
                className={`p-5 border ${rule.borderColor} ${rule.bgColor} hover:scale-105 transition-transform`}
              >
                <div className={`${rule.color} mb-4`}>
                  {rule.icon}
                </div>

                <h4 className={`font-display text-lg uppercase tracking-wider mb-2 ${rule.color}`}>
                  {rule.title}
                </h4>

                <p className="text-sm text-stone-400 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wasteland Life Section */}
      <div className="bg-stone-900/50 border border-stone-800 p-1">
        <div className="bg-stone-950 p-6 md:p-8">
          <div className="flex items-center text-white mb-6">
            <Flame className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Wasteland Life</h3>
          </div>

          <div className="mb-6">
            <h4 className="text-lg text-green-400 font-display uppercase tracking-wider mb-3">
              Deep Fasting Benefits: The Metabolic Rebirth
            </h4>
            <div className="flex items-start">
              <Droplet className="w-12 h-12 text-green-500 mr-4 flex-shrink-0" />
              <div className="text-stone-400 text-sm leading-relaxed">
                <p className="mb-3">
                  At 24 hours, your body enters maximum autophagy—the cellular cleanup process that removes damaged proteins and organelles. This is where true metabolic healing happens.
                </p>
                <ul className="list-disc list-inside space-y-2 text-stone-500">
                  <li>Growth hormone spikes by up to 500%</li>
                  <li>Maximum fat oxidation and ketone production</li>
                  <li>Cellular repair and immune system reset</li>
                  <li>Mental clarity reaches peak levels</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Survival Tip */}
          <div className="p-4 bg-green-500/10 border border-green-500/30 mb-6">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400 uppercase tracking-wider">Survival Tip</span>
            </div>
            <p className="text-sm text-stone-300">
              <strong className="text-white">Electrolytes & Bone Broth:</strong> Add salt, magnesium, and potassium to your water. Bone broth is permitted if you hit extreme fatigue—it won't break your fast.
            </p>
          </div>

          {/* Mindset Check */}
          <div className="p-4 border-l-4 border-green-500 bg-green-500/10">
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2">
              Mindset Check
            </p>
            <p className="text-stone-300 italic text-sm">
              "You're not hungry. You're breaking free. Hunger is temporary. Discipline is permanent. This is your final test."
            </p>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="bg-stone-900/50 border border-stone-800 p-1">
        <div className="bg-stone-950 p-6 md:p-8">
          <div className="flex items-center text-white mb-4">
            <Skull className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-display text-xl uppercase tracking-wider">Battle Log Entry</h3>
          </div>

          <p className="text-stone-400 text-sm mb-4">
            Document your journey. What hour was hardest? What did you learn?
          </p>

          <textarea
            value={battleLog}
            onChange={(e) => setBattleLog(e.target.value)}
            placeholder="Hour 16 was brutal. Craved pizza. But I pushed through. By hour 20, I felt unstoppable..."
            className="w-full bg-black border border-stone-800 text-white p-4 text-sm font-mono focus:border-green-500 outline-none transition-colors min-h-[150px] resize-none"
          />

          <div className="mt-4 text-center">
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            <button
              onClick={async () => {
                if (loading) return; // prevent double submit
                setError(null);
                setLoading(true);

                try {
                  // If caller passed a custom handler, call it
                  if (onCompleteBossFight) {
                    await onCompleteBossFight(battleLog);
                  } else {
                    // Default: save the battle log via saveDayFeatures (requires auth + progress)
                    if (!user || !progress) {
                      throw new Error('Unable to save: missing user or progress');
                    }

                    await saveDayFeatures(user.id, progress.currentDay, { battleLog });
                  }

                  // Success feedback
                  setBattleLog('');
                  alert('Boss Fight completed — your battle log was saved.');
                } catch (err: any) {
                  console.error('Error completing boss fight:', err);
                  setError(err?.message || 'Failed to complete boss fight.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className={"bg-gradient-to-r from-green-600 to-green-500 " + (loading ? 'opacity-60 cursor-not-allowed' : 'hover:from-green-500 hover:to-green-400') + " text-black font-display text-lg uppercase py-4 px-12 tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 active:scale-95"}
            >
              {loading ? 'Completing...' : 'Complete Boss Fight'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
