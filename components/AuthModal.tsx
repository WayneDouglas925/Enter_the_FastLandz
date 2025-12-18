import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Mail, X, Chrome, AlertTriangle } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
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

  const validateFields = () => {
    const errors: typeof fieldErrors = {};

    if (mode === 'signup') {
      if (username.length > 0 && username.length < 3) {
        errors.username = 'Callsign must be at least 3 characters';
      }
      if (password.length > 0 && password.length < 6) {
        errors.password = 'Secret code must be at least 6 characters';
      }
      if (confirmPassword.length > 0 && password !== confirmPassword) {
        errors.confirmPassword = 'Secret codes do not match';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
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
        if (password !== confirmPassword) {
          throw new Error('Secret codes do not match');
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
      setConfirmPassword('');
      setUsername('');
      setAcceptedTerms(false);
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
      setFieldErrors({});
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      setAcceptedTerms(false);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Trap focus in modal
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading]);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-stone-950 border-2 border-rust max-w-md w-full relative shadow-[0_0_50px_rgba(194,65,12,0.3)] my-auto">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-toxic"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-toxic"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-toxic"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-toxic"></div>

        <div className="p-6 md:p-8">
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors disabled:opacity-50 touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6 md:mb-8">
            <h2
              id="auth-modal-title"
              className="font-display text-2xl md:text-3xl lg:text-4xl text-rust uppercase mb-2 tracking-wider"
            >
              {mode === 'signin' ? 'Enter Fastlandz' : 'Join The Wasteland'}
            </h2>
            <div className="h-1 w-16 bg-stone-800 mx-auto mb-3"></div>
            <p className="text-stone-500 text-xs md:text-sm uppercase tracking-widest font-mono">
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
            className="w-full bg-white hover:bg-stone-100 text-black font-display uppercase py-3 tracking-wider mb-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base touch-manipulation min-h-[44px]"
          >
            {loading ? (
              <span className="font-mono animate-pulse">INITIALIZING...</span>
            ) : (
              <>
                <Chrome className="w-5 h-5 mr-2" />
                {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                  Callsign (Username)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" aria-hidden="true" />
                  <input
                    type="text"
                    id="username-input"
                    required
                    minLength={3}
                    className={`w-full bg-stone-900 border ${fieldErrors.username ? 'border-blood' : 'border-stone-700'} text-white p-3 pl-10 focus:border-rust focus:ring-2 focus:ring-rust/50 outline-none font-mono transition-colors`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      validateFields();
                    }}
                    onBlur={validateFields}
                    placeholder="survivor_001"
                    disabled={loading}
                    aria-label="Enter your username"
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                  />
                </div>
                {fieldErrors.username && (
                  <p id="username-error" className="text-blood text-xs mt-1 font-mono flex items-center gap-1" role="alert">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {fieldErrors.username}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                Wasteland ID (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" aria-hidden="true" />
                <input
                  type="email"
                  id="email-input"
                  required
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust focus:ring-2 focus:ring-rust/50 outline-none font-mono transition-colors"
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
                {mode === 'signin' ? 'Access Code' : 'Secret Code (Password)'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" aria-hidden="true" />
                <input
                  type="password"
                  id="password-input"
                  required
                  className={`w-full bg-stone-900 border ${fieldErrors.password ? 'border-blood' : 'border-stone-700'} text-white p-3 pl-10 focus:border-rust focus:ring-2 focus:ring-rust/50 outline-none font-mono transition-colors`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (mode === 'signup') validateFields();
                  }}
                  onBlur={() => mode === 'signup' && validateFields()}
                  placeholder="••••••••"
                  minLength={6}
                  disabled={loading}
                  aria-label={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : mode === 'signup' ? 'password-hint' : undefined}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
              {mode === 'signup' && !fieldErrors.password && (
                <p id="password-hint" className="text-stone-600 text-xs mt-1 font-mono">
                  Minimum 6 characters required
                </p>
              )}
              {fieldErrors.password && (
                <p id="password-error" className="text-blood text-xs mt-1 font-mono flex items-center gap-1" role="alert">
                  <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {fieldErrors.password}
                </p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-stone-500 text-xs uppercase mb-2 font-bold tracking-wider">
                  Confirm Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-stone-600" aria-hidden="true" />
                  <input
                    type="password"
                    id="confirm-password-input"
                    required
                    className={`w-full bg-stone-900 border ${fieldErrors.confirmPassword ? 'border-blood' : 'border-stone-700'} text-white p-3 pl-10 focus:border-rust focus:ring-2 focus:ring-rust/50 outline-none font-mono transition-colors`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateFields();
                    }}
                    onBlur={validateFields}
                    placeholder="••••••••"
                    minLength={6}
                    disabled={loading}
                    aria-label="Confirm your password"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="confirm-password-error" className="text-blood text-xs mt-1 font-mono flex items-center gap-1" role="alert">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-stone-900 border-stone-700 rounded focus:ring-rust focus:ring-2"
                  required
                />
                <label htmlFor="accept-terms" className="text-stone-500 text-xs font-mono leading-relaxed">
                  I accept the{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Implement terms modal or navigate to terms page
                      alert('Terms of Survival page coming soon');
                    }}
                    className="text-rust hover:text-orange-600 underline transition-colors"
                  >
                    Terms of Survival
                  </a>
                  {' '}and understand the wasteland rules
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !acceptedTerms)}
              className="w-full bg-rust hover:bg-orange-600 text-black font-display uppercase py-3 tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(194,65,12,0.3)] hover:shadow-[0_0_30px_rgba(194,65,12,0.5)] text-sm md:text-base touch-manipulation min-h-[44px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-black rounded-full animate-pulse"></span>
                  <span className="animate-pulse font-mono">INITIALIZING...</span>
                  <span className="inline-block w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
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
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              disabled={loading}
              className="text-stone-500 text-sm hover:text-rust transition-colors font-mono disabled:opacity-50 touch-manipulation"
              aria-label={mode === 'signin' ? 'Switch to sign up' : 'Switch to sign in'}
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
