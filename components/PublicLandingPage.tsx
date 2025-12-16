import React, { useState } from 'react';
import { Flame, Mail, Brain, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PublicLandingPageProps {
  onShowAuth: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onShowAuth }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email) {
      try {
        // Save lead to Supabase waitlist
        if (supabase) {
          const { error: leadError } = await supabase
            .from('waitlist_leads')
            .insert([
              {
                email,
                source: 'landing_page',
                metadata: {
                  timestamp: new Date().toISOString(),
                  user_agent: navigator.userAgent,
                }
              }
            ]);

          // Ignore duplicate email errors
          if (leadError && !leadError.message.includes('duplicate')) {
            console.error('Lead capture error:', leadError);
          }
        }

        setSubmitted(true);
      } catch (err) {
        console.error('Failed to capture lead:', err);
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-body overflow-x-hidden">

      {/* Navigation */}
      <nav className="border-b border-stone-900 bg-stone-950/90 backdrop-blur fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center text-rust">
            <Flame className="w-6 h-6 mr-2 animate-pulse" />
            <span className="font-display text-2xl tracking-[0.2em] uppercase">FASTLANDZ</span>
          </div>
          <button
            onClick={onShowAuth}
            className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-rust transition-colors border border-stone-800 px-4 py-2 hover:border-rust"
          >
            Member Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 border-b border-stone-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center border border-rust/30 bg-rust/10 px-3 py-1 mb-8 rounded-full">
            <span className="w-2 h-2 bg-rust rounded-full mr-2 animate-pulse"></span>
            <span className="text-[10px] md:text-xs text-rust font-bold uppercase tracking-widest">MVP Testing Now Open</span>
          </div>

          <h1 className="font-display text-5xl md:text-8xl text-white uppercase tracking-tighter mb-6 leading-tight">
            Stop Eating.<br/>
            <span className="text-rust">Start Living.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
            Join the waitlist to become an early tester of the 7-Day Intermittent Fasting Challenge.
            Help shape the future of metabolic health.
          </p>

          {/* Email Capture */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rust to-orange-600 rounded opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200"></div>
            {error && (
              <div className="mb-2 text-red-500 text-sm text-center font-mono">{error}</div>
            )}
            <form onSubmit={handleEmailSubmit} className="relative bg-stone-900 p-2 border border-stone-800 flex flex-col md:flex-row gap-2">
                {!submitted ? (
                    <>
                    <div className="relative flex-grow">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full bg-stone-950 text-white px-4 py-3 pl-10 outline-none border border-stone-800 focus:border-stone-600 font-mono text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-rust hover:bg-orange-600 text-white font-display uppercase tracking-widest px-6 py-3 transition-colors flex items-center justify-center whitespace-nowrap">
                        Join Waitlist
                    </button>
                    </>
                ) : (
                    <div className="w-full py-3 text-center text-green-500 font-display uppercase tracking-widest animate-fade-in bg-stone-950 border border-green-900/30">
                        You're on the list! Check your email for next steps.
                    </div>
                )}
            </form>
            <p className="text-[10px] text-stone-600 mt-2 text-center uppercase tracking-wide">
                Be among the first to test the protocol.
            </p>
          </div>

          {submitted && (
            <div className="mt-8">
              <p className="text-stone-400 mb-4">Already have an account?</p>
              <button
                onClick={onShowAuth}
                className="text-rust font-bold uppercase tracking-widest hover:text-orange-500 transition-colors border border-rust/30 px-6 py-2 hover:border-rust"
              >
                Sign In to Start
              </button>
            </div>
          )}
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20 border-b border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase mb-4">What You'll Experience</h2>
            <div className="h-1 w-20 bg-rust mx-auto mb-6"></div>
            <p className="text-stone-400 max-w-2xl mx-auto">
              As an MVP tester, you'll get early access to our 7-day progressive fasting protocol.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Brain className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Mental Clarity</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Ketones are a super-fuel for your brain. Experience focus without the jitters of caffeine or the crash of sugar.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Shield className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Cellular Repair</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Trigger Autophagy—your body's self-cleaning mechanism that recycles damaged cells and reduces inflammation.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Flame className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Fat Adaptation</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Train your body to access its own energy reserves. Stop being a slave to the snack drawer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Beta Test Section */}
      <section className="py-20 border-b border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl text-white uppercase mb-6">Why We Need Testers</h2>
            <p className="text-stone-400 leading-relaxed mb-6">
              We're building FastLandz to help people reclaim their metabolic health through intermittent fasting.
              Your feedback will directly shape how thousands of people experience this protocol.
            </p>
            <p className="text-stone-400 leading-relaxed mb-8">
              As a tester, you'll get free lifetime access and help us refine the challenge before our official launch.
            </p>
            <div className="flex items-center text-rust font-bold uppercase tracking-widest text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Shape the Future of Fasting
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-rust/5 border border-rust/20 rounded-lg transform -rotate-2"></div>
            <div className="relative bg-stone-900 border border-stone-800 p-8 md:p-12">
              <h3 className="font-display text-3xl text-white uppercase mb-6">What We're Testing</h3>
              <ul className="space-y-4 font-mono text-sm text-stone-400">
                <li className="flex items-center">
                  <span className="text-rust mr-4">→</span> Progressive 7-day challenge flow
                </li>
                <li className="flex items-center">
                  <span className="text-rust mr-4">→</span> Fasting timer & tracking features
                </li>
                <li className="flex items-center">
                  <span className="text-rust mr-4">→</span> Educational content delivery
                </li>
                <li className="flex items-center">
                  <span className="text-rust mr-4">→</span> Journal & reflection tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-stone-900 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-5xl md:text-7xl text-white uppercase mb-8">
            Ready To Test?
          </h2>
          <p className="text-stone-400 mb-10 text-lg">
            Join the waitlist and we'll notify you when spots open up.
          </p>

          {!submitted && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleEmailSubmit} className="relative bg-stone-900 p-2 border border-stone-800 flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-stone-950 text-white px-4 py-3 pl-10 outline-none border border-stone-800 focus:border-stone-600 font-mono text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="bg-rust hover:bg-orange-600 text-white font-display uppercase tracking-widest px-6 py-3 transition-colors flex items-center justify-center whitespace-nowrap">
                  Join Waitlist
                </button>
              </form>
            </div>
          )}

          <p className="mt-8 text-xs text-stone-600 uppercase tracking-widest">
            Limited MVP testing spots available
          </p>
        </div>
      </section>

      <footer className="border-t border-stone-900 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center mb-4 md:mb-0">
            <Flame className="w-4 h-4 mr-2 text-stone-700" />
            Fastlandz Protocol © 2024
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-rust transition-colors">About</a>
            <a href="#" className="hover:text-rust transition-colors">Science</a>
            <a href="#" className="hover:text-rust transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
