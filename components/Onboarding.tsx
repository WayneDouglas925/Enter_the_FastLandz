import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Play, Zap, Droplets, Moon, Target, Flame, Shield, Link2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  username: string;
}

export interface OnboardingData {
  warriorName: string;
  goals: string[];
  experience: string;
  notifications: boolean;
  syncBioMetrics: boolean;
  acceptedRules: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, username }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    warriorName: username || '',
    goals: [],
    experience: '',
    notifications: true,
    syncBioMetrics: false,
    acceptedRules: false,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return true; // Roadmap step - always can proceed
    if (step === 2) return true; // Features step - always can proceed
    if (step === 3) return data.warriorName.trim().length >= 3 && data.acceptedRules;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-950 to-emerald-950/20 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-900/50 bg-stone-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center text-emerald-400">
            <Flame className="w-5 h-5 mr-2" />
            <span className="font-display text-lg tracking-[0.15em] uppercase">Fastlandz</span>
          </div>
          <div className="flex items-center gap-6 text-stone-500 text-sm">
            <span className="hidden md:inline">The Map</span>
            <span className="hidden md:inline">Intel</span>
            <span className="hidden md:inline">Survivors</span>
            <button className="bg-emerald-500 text-black font-display uppercase px-4 py-1.5 rounded-full text-xs tracking-wider">
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-stone-950 border-b border-stone-900/50 py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-stone-500 font-mono uppercase tracking-widest">
              Mission Briefing
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              STEP {step} OF 3
            </span>
          </div>
          <div className="h-1 bg-stone-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-5xl">
          
          {/* Step 1: The Roadmap */}
          {step === 1 && (
            <div className="animate-fade-in">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-2">
                  HOW IT WORKS:
                </h1>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-emerald-400 uppercase tracking-tight mb-4">
                  THE WASTELAND AWAITS
                </h2>
                <p className="text-stone-400 max-w-2xl mx-auto">
                  Survive the 7-Day Challenge by mastering your hunger. The journey is treacherous, but the rewards are survival.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - The Roadmap */}
                <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-display text-lg text-white uppercase">The Roadmap</h3>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6">
                    {/* The Warm Up */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400"></div>
                        <div className="w-0.5 h-full bg-stone-800"></div>
                      </div>
                      <div className="pb-6">
                        <h4 className="font-display text-white uppercase mb-1">The Warm Up</h4>
                        <p className="text-emerald-400 text-xs font-mono mb-2">DAYS 1-2</p>
                        <p className="text-stone-500 text-sm">
                          Ease into the wasteland with manageable 12-hour fasting windows. Hydration is key.
                        </p>
                      </div>
                    </div>

                    {/* The Gauntlet */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-stone-700 border-2 border-stone-600"></div>
                        <div className="w-0.5 h-full bg-stone-800"></div>
                      </div>
                      <div className="pb-6">
                        <h4 className="font-display text-white uppercase mb-1">The Gauntlet</h4>
                        <p className="text-emerald-400 text-xs font-mono mb-2">DAYS 4-6</p>
                        <p className="text-stone-500 text-sm">
                          Ramping difficulty. Push to 16-hour fasts. Unlock advanced habits: Protein & Movement.
                        </p>
                      </div>
                    </div>

                    {/* Final Stand */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-stone-700 border-2 border-stone-600"></div>
                      </div>
                      <div>
                        <h4 className="font-display text-white uppercase mb-1">Final Stand</h4>
                        <p className="text-emerald-400 text-xs font-mono mb-2">DAY 7</p>
                        <p className="text-stone-500 text-sm">
                          The ultimate fast. Combine all habits and complete a full 18-hour fast to survive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Features */}
                <div className="space-y-4">
                  {/* The Escalation */}
                  <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-display text-white uppercase mb-1">The Escalation</h4>
                        <p className="text-stone-500 text-sm">
                          Your fasting window expands as you adapt. We start slow and ramp up the intensity only when you are ready.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* The Arsenal */}
                  <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-display text-white uppercase mb-1">The Arsenal</h4>
                        <p className="text-stone-500 text-sm">
                          Fasting isn't enough. You'll need supplies. Unlock daily healthy habits: Hydration, Electrolytes, and Sleep.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* The Intel */}
                  <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Play className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-white uppercase mb-1">The Intel</h4>
                        <p className="text-stone-500 text-sm mb-3">
                          Don't wander the wasteland blind. Educational content unlocks daily, teaching you the science of ketosis and autophagy.
                        </p>
                        <button className="text-emerald-400 text-xs font-mono uppercase tracking-wider hover:text-emerald-300 transition-colors flex items-center gap-1">
                          Preview Content <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Video Preview Placeholder */}
                      <div className="w-24 h-16 bg-stone-800 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-stone-800/50">
                <button className="text-stone-500 text-sm hover:text-stone-300 transition-colors">
                  Learn more about the science
                </button>
                <button
                  onClick={handleNext}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase px-8 py-3 rounded-full tracking-wider transition-all inline-flex items-center gap-2"
                >
                  I'm Ready
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Features Overview */}
          {step === 2 && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
                  Your Survival Kit
                </h1>
                <p className="text-stone-400">
                  These tools will help you conquer the wasteland.
                </p>
              </div>

              <div className="grid gap-4 mb-10">
                {/* Timer Feature */}
                <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-lg">
                    <Moon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white uppercase mb-1">Fasting Timer</h3>
                    <p className="text-stone-500 text-sm">Real-time countdown with pause/resume. Track your metabolic state.</p>
                  </div>
                </div>

                {/* Journal Feature */}
                <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white uppercase mb-1">Mission Log</h3>
                    <p className="text-stone-500 text-sm">Journal your experience. Track mood, symptoms, and victories.</p>
                  </div>
                </div>

                {/* Hydration Feature */}
                <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-lg">
                    <Droplets className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white uppercase mb-1">Hydration Tracker</h3>
                    <p className="text-stone-500 text-sm">Water is your weapon. Track your daily intake to stay sharp.</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-stone-800/50">
                <button
                  onClick={handleBack}
                  className="text-stone-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase px-8 py-3 rounded-full tracking-wider transition-all inline-flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Identity Registration */}
          {step === 3 && (
            <div className="animate-fade-in max-w-lg mx-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
                  Identity Registration
                </h1>
                <p className="text-stone-400">
                  To survive the wastes, you must forge a new legend.<br />
                  Who enters the Fastlandz today?
                </p>
              </div>

              {/* Form */}
              <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 mb-6">
                {/* Warrior Name */}
                <div className="mb-6">
                  <label className="block text-emerald-400 text-xs uppercase mb-3 font-bold tracking-wider">
                    Warrior Name
                  </label>
                  <div className="relative">
                    <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                    <input
                      type="text"
                      value={data.warriorName}
                      onChange={(e) => setData(prev => ({ ...prev, warriorName: e.target.value }))}
                      placeholder="e.g. Furiosa, Max, Road Warrior..."
                      className="w-full bg-stone-950 border border-stone-800 text-white p-4 pl-12 rounded-lg focus:border-emerald-500 outline-none font-mono transition-colors placeholder:text-stone-700"
                      minLength={3}
                      maxLength={20}
                    />
                  </div>
                  {data.warriorName.length > 0 && data.warriorName.length < 3 && (
                    <p className="text-red-400 text-xs mt-2 font-mono">
                      Warrior name must be at least 3 characters
                    </p>
                  )}
                </div>

                {/* Sync Bio-Metrics Toggle */}
                <div className="flex items-center justify-between p-4 bg-stone-950 border border-stone-800 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-stone-600" />
                    <div>
                      <p className="text-white text-sm font-display uppercase">
                        Sync Bio-Metrics
                      </p>
                      <p className="text-stone-600 text-xs">
                        Connect with Apple Health / Google Fit to track your fasting vitals.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setData(prev => ({ ...prev, syncBioMetrics: !prev.syncBioMetrics }))}
                    className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                      data.syncBioMetrics ? 'bg-emerald-500' : 'bg-stone-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      data.syncBioMetrics ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Accept Wasteland Rules Toggle */}
                <div className="flex items-center justify-between p-4 bg-stone-950 border border-stone-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white text-sm font-display uppercase">
                        Accept Wasteland Rules
                      </p>
                      <p className="text-stone-600 text-xs">
                        I certify I am fit for the fast and accept the{' '}
                        <a href="#" className="text-emerald-400 hover:underline">Terms of Survival</a>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setData(prev => ({ ...prev, acceptedRules: !prev.acceptedRules }))}
                    className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                      data.acceptedRules ? 'bg-emerald-500' : 'bg-stone-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      data.acceptedRules ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed text-black font-display uppercase py-4 rounded-full tracking-wider transition-all flex items-center justify-center gap-2"
              >
                Prepare for Battle
                <ChevronRight className="w-5 h-5" />
              </button>

              <p className="text-stone-600 text-xs text-center mt-4 font-mono">
                By entering, you agree to intermittent fasting protocols. Consult a physician before starting.
              </p>

              {/* Back Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleBack}
                  className="text-stone-500 hover:text-white transition-colors text-sm"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
