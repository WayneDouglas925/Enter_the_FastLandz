import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Mail, X, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Cleanup ref for setTimeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        // Wait for auth state to update before navigating
        timeoutRef.current = setTimeout(() => {
          onClose();
          navigate('/app');
        }, 500);
      } else {
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        await signUp(email, password, username);
        // Wait for auth state to update before navigating
        timeoutRef.current = setTimeout(() => {
          onClose();
          navigate('/welcome');
        }, 500);
      }
      // Reset form
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      // onClose() will be called after redirect
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError('');
      setEmail('');
      setPassword('');
      setUsername('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-950 border-2 border-rust max-w-md w-full relative shadow-[0_0_50px_rgba(194,65,12,0.3)]">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-toxic"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-toxic"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-toxic"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-toxic"></div>

        <div className="p-8">
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-rust uppercase mb-2 tracking-wider">
              {mode === 'signin' ? 'Enter Fastlandz' : 'Join The Wasteland'}
            </h2>
            <div className="h-1 w-16 bg-stone-800 mx-auto mb-3"></div>
            <p className="text-stone-500 text-sm uppercase tracking-widest font-mono">
              {mode === 'signin' ? 'Resume your survival' : 'Begin your journey'}
            </p>
          </div>

          {error && (
            <div className="bg-blood/20 border border-blood text-blood p-3 mb-4 text-sm font-mono">
              <span className="font-bold">[ERROR]</span> {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-stone-100 text-black font-display uppercase py-3 tracking-wider mb-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-950 px-2 text-stone-600 font-mono">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                  Callsign (Username)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none font-mono transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="survivor_001"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                Email Frequency
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                <input
                  type="email"
                  required
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none font-mono transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" />
                <input
                  type="password"
                  required
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none font-mono transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  disabled={loading}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-stone-600 text-xs mt-1 font-mono">
                  Minimum 6 characters required
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rust hover:bg-orange-600 text-black font-display uppercase py-3 tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(194,65,12,0.3)] hover:shadow-[0_0_30px_rgba(194,65,12,0.5)]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">Processing...</span>
                </span>
              ) : mode === 'signin' ? (
                'Access System'
              ) : (
                'Register Survivor'
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-stone-900 pt-6">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              disabled={loading}
              className="text-stone-500 text-sm hover:text-rust transition-colors font-mono disabled:opacity-50"
            >
              {mode === 'signin' ? (
                <>
                  <span className="text-stone-700">[NEW USER?]</span> Create Account →
                </>
              ) : (
                <>
                  <span className="text-stone-700">[RETURNING?]</span> Access Existing Account →
                </>
              )}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="mt-4 text-center">
              <p className="text-stone-700 text-xs font-mono">
                By registering, you accept the wasteland rules
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
