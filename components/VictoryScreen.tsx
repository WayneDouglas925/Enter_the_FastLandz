import React from 'react';
import { Skull, Share2 } from 'lucide-react';

interface VictoryScreenProps {
  onContinue?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ onContinue }) => {
  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Fastlandz Victory',
        text: 'I just conquered Easy Mode in Fastlandz! 7 days of fasting discipline. 💪',
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-stone-950 to-black">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Badge with Glow */}
        <div className="relative mb-8">
          {/* Green Glow Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Badge Container */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-64 h-64 mx-auto rounded-full border-4 border-green-500/30 flex items-center justify-center bg-gradient-to-b from-stone-900 to-black p-4">
              {/* Inner Ring */}
              <div className="w-56 h-56 rounded-full border-2 border-stone-800 flex items-center justify-center bg-gradient-to-b from-amber-900 via-amber-700 to-amber-900 shadow-2xl">
                {/* Skull Icon */}
                <Skull className="w-24 h-24 text-amber-200" strokeWidth={1.5} />
              </div>
            </div>

            {/* Level Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-black font-display text-xs uppercase tracking-wider px-4 py-1 border-2 border-black">
                Level 7 Complete
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight mb-2">
          <span className="text-white">Easy Mode: </span>
          <span className="text-green-500">Conquered</span>
        </h1>

        {/* Subtitle */}
        <div className="mb-6">
          <p className="text-red-500 text-sm font-mono uppercase tracking-wider mb-2">
            ▼ You've entered the Hunger Zone. ▼
          </p>
          <p className="text-stone-400 text-base">
            You just did more in 7 days than most people do in 7 years.
          </p>
          <p className="text-stone-500 text-sm mt-2">
            And you didn't die once.
          </p>
        </div>

        {/* Stats Summary (Optional) */}
        <div className="bg-stone-900/50 border border-stone-800 p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-display text-green-500">7</div>
              <div className="text-xs text-stone-500 uppercase">Days</div>
            </div>
            <div>
              <div className="text-2xl font-display text-green-500">~100</div>
              <div className="text-xs text-stone-500 uppercase">Hours Fasted</div>
            </div>
            <div>
              <div className="text-2xl font-display text-green-500">100%</div>
              <div className="text-xs text-stone-500 uppercase">Discipline</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-display text-lg uppercase py-4 px-8 tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continue to Intermediate Mode</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white font-display text-sm uppercase py-3 px-8 tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Victory</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-stone-600 text-xs uppercase tracking-wider">
          Challenge Completed: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
