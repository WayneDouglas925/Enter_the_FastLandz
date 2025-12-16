import React from 'react';
import { Flame, Target, Timer, Calendar, BookOpen, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
  onContinue: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-body flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center text-rust mb-6">
            <Flame className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tighter mb-4">
            Welcome To The <span className="text-rust">Fastlandz</span>
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto">
            You're about to embark on a 7-day journey to reclaim your metabolic health.
            Here's what to expect.
          </p>
        </div>

        {/* What You'll Get */}
        <div className="bg-stone-900/50 border border-stone-800 p-8 md:p-12 mb-8">
          <h2 className="font-display text-3xl text-white uppercase mb-8 text-center">The 7-Day Protocol</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="bg-rust/10 border border-rust/30 p-3 rounded">
                <Target className="w-6 h-6 text-rust" />
              </div>
              <div>
                <h3 className="font-display text-white uppercase mb-2">Progressive Challenge</h3>
                <p className="text-stone-500 text-sm">
                  Start with a 12-hour fast and progressively build up to 24 hours over 7 days.
                  Each day unlocks as you complete the previous one.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="bg-rust/10 border border-rust/30 p-3 rounded">
                <Timer className="w-6 h-6 text-rust" />
              </div>
              <div>
                <h3 className="font-display text-white uppercase mb-2">Fasting Timer</h3>
                <p className="text-stone-500 text-sm">
                  Track your fasts in real-time with our wasteland-themed timer.
                  Pause, resume, or end early if needed.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="bg-rust/10 border border-rust/30 p-3 rounded">
                <Calendar className="w-6 h-6 text-rust" />
              </div>
              <div>
                <h3 className="font-display text-white uppercase mb-2">Mission Map</h3>
                <p className="text-stone-500 text-sm">
                  Visualize your progress through a 7-day calendar.
                  See completed days, current challenges, and what's ahead.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
              <div className="bg-rust/10 border border-rust/30 p-3 rounded">
                <BookOpen className="w-6 h-6 text-rust" />
              </div>
              <div>
                <h3 className="font-display text-white uppercase mb-2">Daily Lessons</h3>
                <p className="text-stone-500 text-sm">
                  Learn the science behind fasting with educational content tailored to each day's challenge.
                </p>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-stone-950 border border-stone-800 p-6">
            <h3 className="font-display text-white uppercase mb-4 flex items-center">
              <span className="w-2 h-2 bg-rust rounded-full mr-3 animate-pulse"></span>
              Important Protocol Rules
            </h3>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li className="flex items-start">
                <span className="text-rust mr-3 mt-1">→</span>
                <span>Each day unlocks after completing the previous day's fast</span>
              </li>
              <li className="flex items-start">
                <span className="text-rust mr-3 mt-1">→</span>
                <span>You can pause your fast if needed, but try to maintain consistency</span>
              </li>
              <li className="flex items-start">
                <span className="text-rust mr-3 mt-1">→</span>
                <span>Drink water, black coffee, or plain tea during fasting windows</span>
              </li>
              <li className="flex items-start">
                <span className="text-rust mr-3 mt-1">→</span>
                <span>Journal your experience after each fast to track your progress</span>
              </li>
              <li className="flex items-start">
                <span className="text-rust mr-3 mt-1">→</span>
                <span>Listen to your body - you can end a fast early if you need to</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-blood/10 border border-blood/30 p-4 mb-8 text-center">
          <p className="text-stone-500 text-xs font-mono uppercase tracking-wide">
            ⚠ Medical Advisory: Consult a healthcare provider before starting any fasting protocol,
            especially if you have pre-existing conditions or take medications.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-stone-400 mb-6">
            Ready to begin your transformation? Let's personalize your experience.
          </p>
          <button
            onClick={onContinue}
            className="bg-rust hover:bg-orange-600 text-white font-display text-xl uppercase tracking-[0.2em] px-10 py-5 shadow-[0_0_30px_rgba(194,65,12,0.2)] hover:shadow-[0_0_50px_rgba(194,65,12,0.4)] transition-all transform hover:-translate-y-1 inline-flex items-center"
          >
            Continue to Setup
            <ArrowRight className="ml-3 w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};
