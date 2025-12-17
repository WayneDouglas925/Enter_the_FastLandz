import React, { useState } from 'react';
import { Flame, ChevronRight, Zap, Shield, Brain, ArrowRight, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LandingPageProps {
  onEnterApp: () => void;
  onShowAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onShowAuth }) => {
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
        
        // Show auth modal to convert lead to user
        setTimeout(() => {
          onShowAuth();
        }, 1500);
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
            <span className="text-[10px] md:text-xs text-rust font-bold uppercase tracking-widest">Protocol V1.0 Active</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-8xl text-white uppercase tracking-tighter mb-6 leading-tight">
            Stop Eating.<br/>
            <span className="text-rust">Start Living.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-stone-400 text-lg md:text-xl leading-relaxed mb-10 font-light">
            The modern food environment is a wasteland of sugar and constant snacking. 
            Reclaim your metabolic edge with the 7-Day Survival Protocol.
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
                        Access Granted. Loading Protocol...
                    </div>
                )}
            </form>
            <p className="text-[10px] text-stone-600 mt-2 text-center uppercase tracking-wide">
                Join 12,000+ Survivors recovering their health.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 border-b border-stone-900 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-rust/5 border border-rust/20 rounded-lg transform -rotate-2"></div>
                <div className="relative bg-stone-900 border border-stone-800 p-8 md:p-12">
                    <h3 className="font-display text-3xl text-white uppercase mb-6">The Modern Trap</h3>
                    <ul className="space-y-4 font-mono text-sm text-stone-400">
                        <li className="flex items-center">
                            <span className="text-red-500 mr-4">✖</span> Constant Insulin Spikes
                        </li>
                        <li className="flex items-center">
                            <span className="text-red-500 mr-4">✖</span> Brain Fog & Afternoon Crashes
                        </li>
                        <li className="flex items-center">
                            <span className="text-red-500 mr-4">✖</span> Reliance on Sugar for Energy
                        </li>
                        <li className="flex items-center">
                            <span className="text-red-500 mr-4">✖</span> Confusing Diet Advice
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <h2 className="font-display text-4xl text-white uppercase mb-6">Your body wasn't built for 24/7 feeding.</h2>
                <p className="text-stone-400 leading-relaxed mb-6">
                    We live in an environment of abundance, but our biology is built for scarcity. 
                    When you eat all day, your body never switches into repair mode (Autophagy). 
                    You become metabolically rigid—dependent on the next sugar hit to function.
                </p>
                <p className="text-stone-400 leading-relaxed mb-8">
                    Intermittent Fasting isn't a diet. It's a return to baseline. It's about teaching your body to burn its own fuel again.
                </p>
                <div className="flex items-center text-rust font-bold uppercase tracking-widest text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Reset Your Engine
                </div>
            </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-6 bg-stone-950">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="font-display text-4xl md:text-5xl text-white uppercase mb-4">Survival Benefits</h2>
                  <div className="h-1 w-20 bg-rust mx-auto"></div>
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

      {/* CTA Section */}
      <section className="py-24 border-t border-stone-900 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black px-6 text-center">
          <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-5xl md:text-7xl text-white uppercase mb-8">
                  Enter The <span className="text-rust">Fastlandz</span>
              </h2>
              <p className="text-stone-400 mb-10 text-lg">
                  No subscriptions. No complex meal plans. Just a 7-day challenge to initiate you into the lifestyle.
              </p>
              
              <button 
                onClick={onShowAuth}
                className="bg-rust hover:bg-orange-600 text-white font-display text-xl uppercase tracking-[0.2em] px-10 py-5 shadow-[0_0_30px_rgba(194,65,12,0.2)] hover:shadow-[0_0_50px_rgba(194,65,12,0.4)] transition-all transform hover:-translate-y-1"
              >
                  Start The Challenge
              </button>
              
              <p className="mt-8 text-xs text-stone-600 uppercase tracking-widest">
                  Join the MVP test group
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
                  <a href="#" className="hover:text-rust transition-colors">Manifesto</a>
                  <a href="#" className="hover:text-rust transition-colors">Science</a>
                  <a href="#" className="hover:text-rust transition-colors">Contact</a>
              </div>
          </div>
      </footer>

    </div>
  );
};