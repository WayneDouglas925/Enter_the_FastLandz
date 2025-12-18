import React, { useState } from 'react';
import { ChallengeData } from '../types';
import { Clock, Moon, AlertOctagon, Flame, Zap, Droplets, ChevronRight } from 'lucide-react';
import { WaterTracker } from './day-features/WaterTracker';
import { SnackAssassin } from './day-features/SnackAssassin';
import { CarbProtocol } from './day-features/CarbProtocol';
import { TrialStrategy } from './day-features/TrialStrategy';
import { BossFight } from './day-features/BossFight';

interface ChallengeSetupProps {
  challenge: ChallengeData;
  onStartFast: (startTime: number, durationHours: number) => void;
}

export const ChallengeSetup: React.FC<ChallengeSetupProps> = ({ challenge, onStartFast }) => {
  const [lastMealTime, setLastMealTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  const handleStart = () => {
    if (!lastMealTime) {
        alert("Enter your last meal time, Survivor.");
        return;
    }
    const now = new Date();
    const [hours, minutes] = lastMealTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    if (startDate.getTime() > now.getTime()) {
        startDate.setDate(startDate.getDate() - 1);
    }
    onStartFast(startDate.getTime(), challenge.fastHours);
  };

  return (
    <div className="w-full animate-fade-in pb-20 md:pb-0">
      
      {/* Hero Title Section */}
      <div className="text-center mb-10 md:mb-16 mt-4">
        <h1 className="font-display text-5xl md:text-7xl text-rust uppercase tracking-tighter mb-2 drop-shadow-lg">
          Day {challenge.day}
        </h1>
        <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-[0.2em] mb-4">
          {challenge.title}
        </h2>
        <div className="h-1 w-24 bg-rust mx-auto mb-4"></div>
        <p className="text-stone-500 text-sm md:text-base uppercase tracking-widest font-mono">
            Survive the night. Your engine needs rest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN (Span 2) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* MISSION BRIEFING CARD */}
            <div className="bg-stone-900/50 border border-stone-800 p-1">
                <div className="bg-stone-950 p-6 md:p-8 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center text-white">
                            <AlertOctagon className="w-5 h-5 text-rust mr-2" />
                            <h3 className="font-display text-xl uppercase tracking-wider">Mission Briefing</h3>
                        </div>
                        <span className="text-[10px] border border-stone-800 px-2 py-1 text-stone-600 font-mono">SECURE</span>
                    </div>

                    <blockquote className="border-l-2 border-rust pl-4 text-stone-400 italic font-body text-base md:text-lg mb-8 max-w-2xl">
                        "{challenge.shortBlurb}"
                    </blockquote>

                    {/* Rules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Rule 01 */}
                        <div className="bg-stone-900 border border-stone-800 p-4 group hover:border-rust/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <Moon className="w-5 h-5 text-rust" />
                                <span className="text-[9px] text-stone-600 uppercase font-bold">Rule 01</span>
                            </div>
                            <h4 className="font-display text-white uppercase text-lg mb-1">{challenge.fastHours}h Block</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">
                                {challenge.behavior}
                            </p>
                        </div>

                         {/* Rule 02 */}
                         <div className="bg-stone-900 border border-stone-800 p-4 group hover:border-rust/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <Zap className="w-5 h-5 text-rust" />
                                <span className="text-[9px] text-stone-600 uppercase font-bold">Rule 02</span>
                            </div>
                            <h4 className="font-display text-white uppercase text-lg mb-1">Gap Protocol</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">
                                Last meal at least 3 hours before sleep mode.
                            </p>
                        </div>

                         {/* Rule 03 */}
                         <div className="bg-stone-900 border border-stone-800 p-4 group hover:border-rust/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <Droplets className="w-5 h-5 text-rust" />
                                <span className="text-[9px] text-stone-600 uppercase font-bold">Rule 03</span>
                            </div>
                            <h4 className="font-display text-white uppercase text-lg mb-1">Movement</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">
                                {challenge.movement}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SYNC CHRONOMETER CARD */}
            <div className="bg-stone-900/50 border border-stone-800 p-1">
                <div className="bg-stone-950 p-6 md:p-8">
                     <div className="flex justify-between items-start mb-8">
                        <h3 className="font-display text-xl uppercase tracking-wider text-white">Sync Chronometer</h3>
                        <div className="flex items-center space-x-2">
                             <span className="w-2 h-2 rounded-full bg-red-900 animate-pulse"></span>
                             <span className="text-[10px] text-red-900 font-mono uppercase">Engine Idle</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div>
                             <label className="flex items-center text-stone-500 text-sm font-bold uppercase mb-3 tracking-wider">
                                 <Clock className="w-4 h-4 mr-2" /> Last Meal Time
                             </label>
                             <input 
                                type="time"
                                value={lastMealTime}
                                onChange={(e) => setLastMealTime(e.target.value)}
                                className="w-full bg-black border border-stone-800 text-white p-4 text-2xl font-mono focus:border-rust outline-none transition-colors"
                             />
                         </div>
                         <div>
                             <label className="flex items-center text-stone-500 text-sm font-bold uppercase mb-3 tracking-wider">
                                 <Moon className="w-4 h-4 mr-2" /> Sleep (Optional)
                             </label>
                             <input 
                                type="time"
                                value={sleepTime}
                                onChange={(e) => setSleepTime(e.target.value)}
                                className="w-full bg-black border border-stone-800 text-white p-4 text-2xl font-mono focus:border-rust outline-none transition-colors"
                             />
                         </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button 
                            onClick={handleStart}
                            className="bg-rust hover:bg-orange-600 text-black font-display text-xl uppercase py-4 px-12 tracking-widest shadow-[0_0_20px_rgba(194,65,12,0.3)] hover:shadow-[0_0_30px_rgba(194,65,12,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center group"
                        >
                            <Flame className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                            Start Engine
                        </button>
                        <p className="text-[10px] text-rust mt-4 uppercase tracking-widest font-bold">
                            <span className="inline-block w-2 h-2 bg-rust rounded-full mr-2"></span>
                            Fast Reminders Enabled
                        </p>
                    </div>
                </div>
            </div>

            {/* DAY-SPECIFIC FEATURES */}
            {challenge.day === 3 && <WaterTracker targetCups={8} />}
            {challenge.day === 4 && <SnackAssassin />}
            {challenge.day === 5 && <CarbProtocol />}
            {challenge.day === 6 && <TrialStrategy />}
            {challenge.day === 7 && <BossFight />}

        </div>

        {/* RIGHT COLUMN (Span 1) - INTEL */}
        <div className="lg:col-span-1">
             <div className="bg-stone-900/50 border border-stone-800 p-1 h-full">
                <div className="bg-stone-950 p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center text-dust">
                            <Flame className="w-4 h-4 mr-2" />
                            <h3 className="font-display text-sm uppercase tracking-wider">Wasteland Intel</h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-600" />
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full aspect-video bg-stone-900 border border-stone-800 mb-6 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                        {/* CSS Pattern to simulate wasteland terrain */}
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-black opacity-50"></div>
                        <div className="absolute bottom-3 left-3 z-20">
                            <span className="text-[9px] font-mono bg-black/80 px-2 py-1 text-stone-400 border border-stone-800">LOG #00{challenge.day}: {challenge.lessonTitle.toUpperCase()}</span>
                        </div>
                    </div>

                    <h4 className="font-display text-xl text-white uppercase mb-3 leading-none">
                        {challenge.lessonTitle}
                    </h4>

                    <div className="text-stone-400 text-base leading-relaxed font-body flex-grow overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                        {challenge.lessonContent}
                    </div>

                    <div className="mt-6 pt-6 border-t border-stone-900 flex justify-between items-end">
                         <div>
                             <p className="text-xs text-stone-600 uppercase mb-1">Source</p>
                             <p className="text-sm text-rust font-bold uppercase">Medical Bay</p>
                         </div>
                         <button className="text-xs uppercase text-stone-500 hover:text-white border-b border-transparent hover:border-white transition-colors">
                             Read Full Log
                         </button>
                    </div>

                </div>
             </div>
        </div>

      </div>
    </div>
  );
};