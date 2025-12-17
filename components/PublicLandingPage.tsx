import React, { useState } from 'react';
import { Flame, Mail, Brain, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isValidEmail } from '../utils/validators';

interface PublicLandingPageProps {
  onShowAuth: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onShowAuth }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Save lead to Supabase waitlist
      if (supabase) {
        const { error: leadError } = await supabase
          .from('waitlist_leads')
          .insert([
            {
              email: email.trim(),
              source: 'landing_page',
              metadata: {
                timestamp: new Date().toISOString(),
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
              },
            },
          ]);

        // Ignore duplicate email errors — supabase error messages vary, check defensively
        const message = (leadError && (leadError.message || leadError.details || leadError.code)) || '';
        if (leadError && !/(duplicate|unique)/i.test(String(message))) {
          console.error('Lead capture error:', leadError);
          setError('Failed to save your email. Please try again later.');
          setIsSubmitting(false);
          return;
        }
      }

      setSubmitted(true);

      // Show auth modal to convert lead to user after brief delay
      setTimeout(() => {
        onShowAuth();
      }, 1500);
    } catch (err) {
      console.error('Failed to capture lead:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            className="bg-rust text-white font-display uppercase px-4 py-2 rounded"
            aria-label="Open authentication modal"
          >
            Member Login
          </button>
        </div>
      </nav>

      {/* Hero & Email Capture */}
      <section className="py-24 border-b border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-8xl text-white uppercase tracking-tighter mb-6 leading-tight">
            Stop Eating.<br />
            <span className="text-rust">Start Living.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
            Join the waitlist to become an early tester of the 7-Day Intermittent Fasting Challenge.
            Help shape the future of metabolic health.
          </p>

          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rust to-orange-600 rounded opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200"></div>
            {error && (
              <div className="mb-2 text-red-500 text-sm text-center font-mono" role="alert">
                {error}
              </div>
            )}

            {submitted && (
              <div className="mb-4 text-green-400 text-center" role="status" aria-live="polite">
                Thanks — check your email for updates.
              </div>
            )}

            {!submitted && (
              <form onSubmit={handleEmailSubmit} className="relative bg-stone-900 p-2 border border-stone-800 flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                  <input
                    aria-label="Email address"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-stone-950 text-white px-4 py-3 pl-10 outline-none border border-stone-800 focus:border-stone-600 font-mono text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-rust hover:bg-orange-600 text-white font-display uppercase tracking-widest px-6 py-3 transition-colors flex items-center justify-center whitespace-nowrap disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-label="Join waitlist"
                >
                  {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Why section */}
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
            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Brain className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Fat Adaptation</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Train your body to access its own energy reserves. Stop being a slave to the snack drawer.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Flame className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Mindful Hunger</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Learn to differentiate true hunger from habit or boredom.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-stone-800 p-8 hover:border-rust/50 transition-colors group">
              <Shield className="w-10 h-10 text-stone-600 mb-6 group-hover:text-rust transition-colors" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Sustained Energy</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Build routines that keep you focused and energetic throughout the day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-900 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs font-mono uppercase tracking-widest">
          <div>© {new Date().getFullYear()} Fastlandz</div>
          <div className="mt-4 md:mt-0">Built with care</div>
        </div>
      </footer>
    </div>
  );
};
