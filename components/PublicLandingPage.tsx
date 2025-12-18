import React, { useState } from 'react';
import { Flame, Calendar, Trophy, Clock, ArrowRight, Loader2, AlertTriangle, X, Chrome, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PublicLandingPageProps {
  onShowAuth?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onShowAuth }) => {
  const { signInWithGoogle, signIn, error, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      await signInWithGoogle();
      // After successful sign-in, navigate to the app
      setTimeout(() => navigate('/app'), 1000);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthError('');
      await signIn(email, password);
      // After successful sign-in, navigate to the app
      setTimeout(() => navigate('/app'), 1000);
    } catch (err: any) {
      setAuthError(err.message || 'Sign-in failed');
    }
  };

  const handleAuthClick = () => {
    if (onShowAuth) {
      onShowAuth();
    } else {
      setShowAuthForm(true);
    }
  };

  const closeAuthForm = () => {
    setShowAuthForm(false);
    setAuthError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-950 to-emerald-950/20 text-stone-300 font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-stone-900/50 bg-stone-950/90 backdrop-blur fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center text-emerald-400">
            <Flame className="w-5 h-5 mr-2" />
            <span className="font-display text-lg tracking-[0.15em] uppercase">FASTLANDZ</span>
          </div>
          <button
            onClick={handleAuthClick}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase px-5 py-2 rounded-full text-sm tracking-wider transition-colors"
            aria-label="Open login modal"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl"></div>
         
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Survival Mode Active</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter mb-4 leading-[0.9]">
            ENTER THE
          </h1>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-emerald-400 uppercase tracking-tighter mb-8 leading-[0.9]">
            FASTLANDZ
          </h1>

          {/* Tagline */}
          <p className="text-stone-400 text-lg md:text-xl mb-3">
            Fast. Track. Transform. <span className="text-emerald-400">(Then eat.)</span>
          </p>
          <p className="text-stone-600 text-xs uppercase tracking-[0.3em] font-mono mb-10">
            // SYSTEM STATUS: HUNGER LEVELS RISING
          </p>

          {/* CTA Button */}
          <button
            onClick={handleAuthClick}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase px-8 py-4 rounded-full text-lg tracking-wider transition-all transform hover:scale-105 inline-flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-stone-600 text-xs mt-6 font-mono">
            Join 10,000+ survivors in the 7-day intermittent fasting RPG.
          </p>
        </div>
      </section>

      {/* Wasteland Mechanics Section */}
      <section className="py-20 px-6 border-t border-stone-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mb-3">Wasteland Mechanics</h2>
            <p className="text-stone-500 max-w-xl">
              This isn't just a diet. It's a fight for survival. Equip yourself with the tools to master your metabolic state.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Card 1 - 7 Day Challenge */}
            <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 hover:border-emerald-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <Calendar className="w-8 h-8 text-stone-800 group-hover:text-stone-700 transition-colors" />
              </div>
              <h3 className="font-display text-xl text-white uppercase mb-2">7 Day Challenge</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                A guided survival journey through the metabolic desert. Can you make it to the oasis?
              </p>
            </div>

            {/* Feature Card 2 - XP System */}
            <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 hover:border-emerald-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <Trophy className="w-8 h-8 text-stone-800 group-hover:text-stone-700 transition-colors" />
              </div>
              <h3 className="font-display text-xl text-white uppercase mb-2">XP System</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Level up your health stats. Earn XP for every hour fasted and every healthy meal logged.
              </p>
            </div>

            {/* Feature Card 3 - Fasting Windows */}
            <div className="bg-stone-900/30 border border-stone-800/50 rounded-lg p-6 hover:border-emerald-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <Clock className="w-8 h-8 text-stone-800 group-hover:text-stone-700 transition-colors" />
              </div>
              <h3 className="font-display text-xl text-white uppercase mb-2">Fasting Windows</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Master your hunger. Dynamic timers track your fasting and eating windows with precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900/50 bg-stone-950 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-stone-600 mb-4 md:mb-0">
            <Flame className="w-4 h-4 mr-2" />
            <span className="text-xs uppercase tracking-widest">FASTLANDZ RPG</span>
          </div>
           
          <div className="flex items-center gap-8 text-stone-600 text-xs uppercase tracking-wider">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Support</a>
          </div>
           
          <div className="text-stone-700 text-xs mt-4 md:mt-0">
            © 2024 Fastlandz. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-950 border-2 border-emerald-500 max-w-md w-full relative rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <button
              onClick={closeAuthForm}
              disabled={loading}
              className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Close auth form"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl text-emerald-400 uppercase mb-2 tracking-wider">
                  Enter Fastlandz
                </h2>
                <p className="text-stone-500 text-sm uppercase tracking-widest font-mono">
                  Resume your survival
                </p>
              </div>

              {authError && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 mb-4 text-sm font-mono rounded">
                  <span className="font-bold">[ERROR]</span> {authError}
                </div>
              )}

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-stone-100 text-black font-display uppercase py-3 tracking-wider mb-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="font-mono animate-pulse">INITIALIZING...</span>
                ) : (
                  <>
                    <Chrome className="w-5 h-5 mr-2" />
                    Sign in with Google
                  </>
                )}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-stone-950 px-2 text-stone-600 font-mono">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                    Wasteland ID (Email)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                    <input
                      type="email"
                      required
                      className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={loading}
                      aria-label="Enter your email address"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                    Access Code (Password)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                    <input
                      type="password"
                      required
                      className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono transition-colors"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      disabled={loading}
                      aria-label="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-display uppercase py-3 tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="animate-pulse font-mono">ACCESSING...</span>
                    </span>
                  ) : (
                    'Access System'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-stone-900 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/welcome')}
                  disabled={loading}
                  className="text-stone-500 text-sm hover:text-emerald-400 transition-colors font-mono disabled:opacity-50"
                >
                  <span className="text-stone-700">[NEW USER?]</span> Create Account →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
