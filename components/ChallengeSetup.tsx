import React, { useState } from 'react';
import { ChallengeData } from '../types';
import { Clock, Moon, ChevronDown, ChevronUp, Droplets, Footprints, Flame } from 'lucide-react';

interface ChallengeSetupProps {
  challenge: ChallengeData;
  onStartFast: (startTime: number, durationHours: number) => void;
}

export const ChallengeSetup: React.FC<ChallengeSetupProps> = ({ challenge, onStartFast }) => {
  const [showEducation, setShowEducation] = useState(false);
  const [lastMealTime, setLastMealTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  const handleStart = () => {
    if (!lastMealTime) {
        alert("Enter your last meal time, Survivor.");
        return;
    }
    
    // Parse time string to Date object for today/yesterday
    const now = new Date();
    const [hours, minutes] = lastMealTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    // If selected time is in future relative to right now (e.g. it's 1AM and user picks 8PM),
    // it likely means 8PM yesterday. 
    // Simple heuristic: if selected time is > current time, assume yesterday.
    if (startDate.getTime() > now.getTime()) {
        startDate.setDate(startDate.getDate() - 1);
    }

    onStartFast(startDate.getTime(), challenge.fastHours);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-20 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl text-dust uppercase tracking-tighter">
          Day {challenge.day}
        </h1>
        <h2 className="font-body text-xl text-white uppercase tracking-widest border-b border-stone-800 pb-4 mb-4">
          {challenge.title}
        </h2>
      </div>

      {/* Stats Box */}
      <div className="bg-stone-900 border border-stone-700 p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <Flame className="w-24 h-24 text-rust" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
           <div className="flex flex-col">
               <span className="text-stone-500 text-xs uppercase">Objective</span>
               <span className="text-white font-display text-2xl">{challenge.fastHours} HOURS</span>
           </div>
           <div className="flex flex-col">
               <span className="text-stone-500 text-xs uppercase">Tactic</span>
               <span className="text-rust font-body text-sm font-bold leading-tight">{challenge.behavior}</span>
           </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 gap-2">
            <div className="flex items-center text-stone-300 text-sm">
                <Footprints className="w-4 h-4 mr-2 text-dust"/>
                {challenge.movement}
            </div>
            {challenge.day === 3 && (
                 <div className="flex items-center text-stone-300 text-sm">
                 <Droplets className="w-4 h-4 mr-2 text-blue-500"/>
                 Goal: 8 Cups Water
             </div>
            )}
        </div>
      </div>

      {/* Educational Intel */}
      <div className="mb-6">
        <p className="text-stone-400 text-sm italic mb-3 font-body border-l-2 border-stone-800 pl-3">
          "{challenge.shortBlurb}"
        </p>

        <button 
          onClick={() => setShowEducation(!showEducation)}
          className="w-full bg-stone-800 hover:bg-stone-700 transition-colors p-3 flex items-center justify-between border-l-4 border-dust"
        >
          <span className="font-display uppercase text-dust">Intel: {challenge.lessonTitle}</span>
          {showEducation ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
        </button>

        {showEducation && (
            <div className="bg-stone-900/50 p-4 text-stone-300 border border-stone-800 border-t-0 text-sm leading-relaxed font-body whitespace-pre-line animate-fade-in">
                <p className="mb-4">{challenge.lessonContent}</p>
                <div className="bg-rust/10 border border-rust/30 p-2 rounded">
                  <p className="text-dust font-bold text-xs uppercase">Survivor Tip</p>
                  <p className="text-white italic">{challenge.bonusTip}</p>
                </div>
            </div>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-8">
          <div>
              <label className="flex items-center text-stone-400 text-xs uppercase mb-2">
                  <Clock className="w-4 h-4 mr-2" /> Last Meal Time (Start Point)
              </label>
              <input 
                type="time" 
                value={lastMealTime}
                onChange={(e) => setLastMealTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-600 text-white p-4 text-xl font-display tracking-widest focus:border-rust outline-none"
              />
          </div>

          <div>
              <label className="flex items-center text-stone-500 text-xs uppercase mb-2">
                  <Moon className="w-4 h-4 mr-2" /> Sleep Time (Optional)
              </label>
              <input 
                type="time" 
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-500 p-4 text-xl font-display tracking-widest focus:border-stone-600 outline-none"
              />
          </div>
      </div>

      <button 
        onClick={handleStart}
        className="w-full bg-rust hover:bg-orange-700 text-white font-display text-xl uppercase p-6 tracking-widest shadow-lg shadow-orange-900/20 transition-all transform active:scale-95 border-b-4 border-orange-900"
      >
          Initiate Fast
      </button>

      <p className="text-center text-stone-600 text-xs mt-4 italic max-w-xs mx-auto">
        "You’ll get a reminder when your fast ends. Unless you black out first."
      </p>

    </div>
  );
};