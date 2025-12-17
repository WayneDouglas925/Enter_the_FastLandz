import React, { useState } from 'react';
import { ChevronRight, Target, Clock, Scale, Brain, Flame } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  username: string;
}

export interface OnboardingData {
  goals: string[];
  experience: string;
  notifications: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, username }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    experience: '',
    notifications: true,
  });

  const goals = [
    { id: 'weight', label: 'Weight Loss', icon: Scale },
    { id: 'clarity', label: 'Mental Clarity', icon: Brain },
    { id: 'energy', label: 'More Energy', icon: Flame },
    { id: 'health', label: 'Overall Health', icon: Target },
  ];

  const experiences = [
    { id: 'beginner', label: 'Complete Beginner', desc: 'Never tried fasting before' },
    { id: 'some', label: 'Some Experience', desc: 'Tried a few times' },
    { id: 'regular', label: 'Regular Faster', desc: 'Fast frequently' },
  ];

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const canProceed = () => {
    if (step === 1) return data.goals.length > 0;
    if (step === 2) return data.experience !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-stone-500 font-mono uppercase tracking-widest">
              Protocol Initialization
            </span>
            <span className="text-xs text-stone-500 font-mono">
              STEP {step}/2
            </span>
          </div>
          <div className="h-1 bg-stone-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-rust transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-stone-950 border-2 border-stone-800 p-8 md:p-12 relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-rust"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-rust"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-rust"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-rust"></div>

          {/* Welcome Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wider mb-2">
              Welcome, <span className="text-rust">{username}</span>
            </h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest font-mono">
              Let's personalize your journey
            </p>
          </div>

          {/* Step 1: Goals */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl text-white uppercase mb-6 text-center">
                What Are Your Goals?
              </h2>
              <p className="text-stone-400 text-center mb-8 text-sm">
                Select all that apply. This helps us track what matters to you.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {goals.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleGoal(id)}
                    className={`p-6 border-2 transition-all ${
                      data.goals.includes(id)
                        ? 'border-rust bg-rust/10 text-white'
                        : 'border-stone-800 hover:border-stone-700 text-stone-400'
                    }`}
                  >
                    <Icon className="w-8 h-8 mb-3 mx-auto" />
                    <p className="font-display uppercase text-sm tracking-wider">
                      {label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl text-white uppercase mb-6 text-center">
                Fasting Experience?
              </h2>
              <p className="text-stone-400 text-center mb-8 text-sm">
                We'll adjust recommendations based on your level.
              </p>
              
              <div className="space-y-4 mb-8">
                {experiences.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setData(prev => ({ ...prev, experience: id }))}
                    className={`w-full p-6 border-2 text-left transition-all ${
                      data.experience === id
                        ? 'border-rust bg-rust/10'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <p className={`font-display uppercase text-lg mb-1 ${
                      data.experience === id ? 'text-white' : 'text-stone-400'
                    }`}>
                      {label}
                    </p>
                    <p className="text-stone-500 text-sm">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 Part 2: Notifications */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl text-white uppercase mb-6 text-center">
                Stay On Track
              </h2>
              <p className="text-stone-400 text-center mb-8 text-sm">
                The 7-Day Protocol follows a progressive schedule—each day has a designated fasting duration designed to build your resilience.
              </p>
              
              <div className="mb-8">
                <div className="bg-stone-900 border border-stone-800 p-6 mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Flame className="w-6 h-6 text-rust" />
                    <h3 className="font-display text-lg text-white uppercase">Progressive Challenge</h3>
                  </div>
                  <p className="text-stone-400 text-sm text-center">
                    Day 1 starts at 12 hours. Each day increases as you adapt. The protocol guides your journey—you focus on execution.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-stone-900 border border-stone-800">
                  <div>
                    <p className="text-white font-display uppercase text-sm mb-1">
                      Enable Notifications
                    </p>
                    <p className="text-stone-500 text-xs">
                      Get reminders when your fast starts/ends
                    </p>
                  </div>
                  <button
                    onClick={() => setData(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      data.notifications ? 'bg-rust' : 'bg-stone-700'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      data.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-stone-800">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-stone-500 hover:text-white transition-colors uppercase text-sm font-bold tracking-wider"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`ml-auto bg-rust hover:bg-orange-600 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed text-white font-display uppercase tracking-widest px-8 py-3 transition-colors flex items-center gap-2`}
            >
              {step === 2 ? 'Start Challenge' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
