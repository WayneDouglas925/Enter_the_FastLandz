import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ViewState, FastState, UserProgress, JournalEntry } from './types';
import { CHALLENGES, QUOTES } from './data';
import { ChallengeSetup } from './components/ChallengeSetup';
import { TimerDisplay } from './components/TimerDisplay';
import { CalendarView } from './components/CalendarView';
import { JournalView } from './components/JournalView';
import { PublicLandingPage } from './components/PublicLandingPage';
import { WelcomePage } from './components/WelcomePage';
import { AuthModal } from './components/AuthModal';
import { Onboarding, OnboardingData } from './components/Onboarding';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { useProgress } from './lib/hooks/useProgress';
import { useFastSession } from './lib/hooks/useFastSession';
import { useJournal } from './lib/hooks/useJournal';
import { setupOfflineSync } from './lib/offlineSync';
import { Skull, Map, BookOpen, Flame, User, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const navigate = useNavigate();

  // --- AUTH ---
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // --- STATE ---
  const [view, setView] = useState<ViewState>('CHALLENGE');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // --- DATA HOOKS ---
  const { progress, updateProgress, loading: progressLoading } = useProgress();
  const {
    fastState,
    startFastSession,
    updateFastSession,
    completeFastSession,
    failFastSession,
    loading: fastLoading
  } = useFastSession();
  const { entries: journalEntries, addJournalEntry, loading: journalLoading } = useJournal();

  // --- CHECK ONBOARDING STATUS ---
  useEffect(() => {
    const checkOnboarding = async () => {
      if (user && supabase) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile && !profile.onboarding_completed) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [user]);

  // --- OFFLINE SYNC SETUP ---
  useEffect(() => {
    const cleanup = setupOfflineSync();
    return cleanup;
  }, []);

  // --- ACTIONS ---

  const handleStartFast = async (startTime: number, durationHours: number) => {
    if (!progress) return;
    await startFastSession(startTime, durationHours, progress.currentDay);
    setView('TIMER');
  };

  const handlePauseToggle = async () => {
    const now = Date.now();
    if (fastState.isPaused) {
      // Resume
      const pauseDuration = now - (fastState.pausedAt || now);
      await updateFastSession({
        isPaused: false,
        pausedAt: null,
        totalPausedTime: fastState.totalPausedTime + pauseDuration
      });
    } else {
      // Pause
      await updateFastSession({
        isPaused: true,
        pausedAt: now
      });
    }
  };

  const handleEndEarly = async () => {
    if (window.confirm("Abort mission? This day will be marked as FAILED.")) {
      await failFastSession();

      if (progress) {
        await updateProgress({
          failedDays: [...progress.failedDays, progress.currentDay]
        });
      }
      setView('CALENDAR');
    }
  };

  const handleComplete = async () => {
    if (!fastState.isActive) return;

    alert("MISSION ACCOMPLISHED. FEED, SURVIVOR.");

    await completeFastSession();

    if (progress) {
      const nextDay = progress.currentDay + 1;
      await updateProgress({
          completedDays: [...progress.completedDays, progress.currentDay],
          unlockedDays: Math.max(progress.unlockedDays, nextDay),
          currentDay: nextDay > 7 ? 7 : nextDay
      });
    }

    setView('JOURNAL');
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    await addJournalEntry(entry);
  };

  const handleSignOut = async () => {
    if (window.confirm('Sign out? Your progress is saved to your account.')) {
      await signOut();
      navigate('/');
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (user && supabase) {
      // Save onboarding data to profile
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_data: data,
        })
        .eq('id', user.id);

      setNeedsOnboarding(false);
      navigate('/app');
    }
  };

  const handleSelectDay = (day: number) => {
      if (progress.completedDays.includes(day)) {
          alert(`Day ${day} Completed. Review Journal for details.`);
      } else if (day === progress.currentDay) {
          setView('CHALLENGE');
      }
  };

  const currentChallenge = (progress && CHALLENGES.find(c => c.day === progress.currentDay)) || CHALLENGES[0];
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // --- ROUTE GUARDS ---

  // Protected Route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center">
          <div className="text-rust font-display text-xl uppercase tracking-widest animate-pulse">
            Loading...
          </div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  // --- RENDER ---

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          <>
            <PublicLandingPage onShowAuth={() => setShowAuthModal(true)} />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </>
        }
      />

      {/* Welcome Page - Shows after signup */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage onContinue={() => navigate('/onboarding')} />
          </ProtectedRoute>
        }
      />

      {/* Onboarding - 3-step setup */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding
              username={user?.user_metadata?.username || user?.email?.split('@')[0] || 'Survivor'}
              onComplete={handleOnboardingComplete}
            />
          </ProtectedRoute>
        }
      />

      {/* Main App */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            {needsOnboarding ? (
              <Navigate to="/welcome" replace />
            ) : (
              <div className="min-h-screen bg-void flex flex-col font-body text-stone-300">

                {/* Header */}
                <header className="h-16 px-6 border-b-2 border-rust/20 flex items-center justify-between bg-stone-950/90 sticky top-0 z-50 backdrop-blur-sm">
                  <div className="flex items-center text-rust group cursor-pointer" onClick={() => navigate('/')}>
                    <Flame className="w-6 h-6 mr-2 group-hover:animate-pulse transition-all" />
                    <span className="font-display text-xl tracking-[0.2em] uppercase">FASTLANDZ</span>
                  </div>

                  {/* Desktop Nav Links */}
                  <div className="hidden md:flex items-center space-x-8 text-sm font-bold tracking-widest uppercase text-stone-500">
                      <button onClick={() => setView('CHALLENGE')} className={`hover:text-rust transition-colors ${view === 'CHALLENGE' || view === 'TIMER' ? 'text-rust border-b border-rust' : ''}`}>Current Day</button>
                      <button onClick={() => setView('CALENDAR')} className={`hover:text-rust transition-colors ${view === 'CALENDAR' ? 'text-rust border-b border-rust' : ''}`}>Missions</button>
                      <button onClick={() => setView('JOURNAL')} className={`hover:text-rust transition-colors ${view === 'JOURNAL' ? 'text-rust border-b border-rust' : ''}`}>Journal</button>
                      {user && (
                        <button onClick={handleSignOut} className="hover:text-blood transition-colors flex items-center gap-1">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      )}
                  </div>

                  <div className="flex items-center gap-3">
                    {user && (
                      <div className="hidden md:block text-stone-500 text-sm font-mono">
                        <User className="w-4 h-4 inline mr-1" />
                        {user.user_metadata?.username || user.email?.split('@')[0]}
                      </div>
                    )}
                    <div className="text-stone-600 text-sm font-mono bg-stone-900 px-3 py-1 border border-stone-800 rounded-sm">
                        DAY {progress?.currentDay || 1} / 7
                    </div>
                  </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                  <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                      {view === 'CHALLENGE' && (
                      <ChallengeSetup
                          challenge={currentChallenge}
                          onStartFast={handleStartFast}
                          />
                      )}

                      {view === 'TIMER' && (
                          <TimerDisplay
                          fastState={fastState}
                          challengeData={currentChallenge}
                          onPause={handlePauseToggle}
                          onResume={handlePauseToggle}
                          onComplete={handleComplete}
                          />
                      )}

                      {view === 'CALENDAR' && (
                          <CalendarView
                              progress={progress}
                              challenges={CHALLENGES}
                              onSelectDay={handleSelectDay}
                          />
                      )}

                      {view === 'JOURNAL' && (
                          <JournalView
                              currentDay={progress.currentDay}
                              progress={progress}
                              onSaveEntry={handleSaveEntry}
                              entries={journalEntries}
                              challenges={CHALLENGES}
                              selectedDay={selectedDay}
                              onClearSelection={() => setSelectedDay(null)}
                          />
                      )}
                  </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden border-t border-stone-800 bg-stone-950 p-2 fixed bottom-0 w-full grid grid-cols-4 gap-1 z-50">
                  <button
                      onClick={() => {
                          if(fastState.isActive) setView('TIMER');
                          else setView('CHALLENGE');
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'CHALLENGE' || view === 'TIMER' ? 'text-rust bg-stone-900' : 'text-stone-500'}`}
                  >
                      <Skull className="w-6 h-6 mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">Mission</span>
                  </button>

                  <button
                      onClick={() => setView('CALENDAR')}
                      className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'CALENDAR' ? 'text-dust bg-stone-900' : 'text-stone-500'}`}
                  >
                      <Map className="w-6 h-6 mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">Map</span>
                  </button>

                  <button
                      onClick={() => setView('JOURNAL')}
                      className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'JOURNAL' ? 'text-stone-200 bg-stone-900' : 'text-stone-500'}`}
                  >
                      <BookOpen className="w-6 h-6 mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">Log</span>
                  </button>

                  <button
                      onClick={handleSignOut}
                      className="flex flex-col items-center justify-center p-2 rounded transition-colors text-rust"
                  >
                      <LogOut className="w-6 h-6 mb-1" />
                      <span className="text-xs uppercase font-bold tracking-wider">Exit</span>
                  </button>
                </nav>
              </div>
            )}
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
