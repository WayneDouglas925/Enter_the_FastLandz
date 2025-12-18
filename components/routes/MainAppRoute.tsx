import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ViewState } from '../../types';
import { CHALLENGES } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { useAppActions } from '../../lib/hooks/useAppActions';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { setupOfflineSync } from '../../lib/offlineSync';
import { AppHeader, AppNavigation, AppContent } from '../layout';

export const MainAppRoute: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ViewState>('CHALLENGE');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const { needsOnboarding, isCheckingOnboarding } = useOnboarding();
  
  const {
    handleStartFast,
    handlePauseToggle,
    handleComplete,
    handleSaveEntry,
    handleSignOut,
    handleSelectDay,
    progress,
    fastState,
    journalEntries,
    isLoading
  } = useAppActions({ setView });

  // Setup offline sync
  useEffect(() => {
    const cleanup = setupOfflineSync();
    return cleanup;
  }, []);

  // Show loading while checking onboarding status
  if (isCheckingOnboarding || isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-rust font-display text-xl uppercase tracking-widest animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Redirect to onboarding if needed
  if (needsOnboarding) {
    return <Navigate to="/welcome" replace />;
  }

  const currentChallenge = (progress && CHALLENGES.find(c => c.day === progress.currentDay)) || CHALLENGES[0];

  return (
    <div className="min-h-screen bg-void flex flex-col font-body text-stone-300">
      <AppHeader
        user={user}
        progress={progress}
        view={view}
        setView={setView}
        onSignOut={handleSignOut}
      />

      <AppContent
        view={view}
        progress={progress}
        fastState={fastState}
        currentChallenge={currentChallenge}
        challenges={CHALLENGES}
        journalEntries={journalEntries}
        selectedDay={selectedDay}
        onStartFast={handleStartFast}
        onPauseToggle={handlePauseToggle}
        onComplete={handleComplete}
        onSelectDay={handleSelectDay}
        onSaveEntry={handleSaveEntry}
        onClearSelection={() => setSelectedDay(null)}
      />

      <AppNavigation
        view={view}
        fastState={fastState}
        setView={setView}
        onSignOut={handleSignOut}
      />
    </div>
  );
};
