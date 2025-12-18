import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewState, FastState, UserProgress, JournalEntry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from './useProgress';
import { useFastSession } from './useFastSession';
import { useJournal } from './useJournal';

export interface AppActionsReturn {
  // Fast session actions
  handleStartFast: (startTime: number, durationHours: number) => Promise<void>;
  handlePauseToggle: () => Promise<void>;
  handleEndEarly: () => Promise<void>;
  handleComplete: () => Promise<void>;
  // Journal actions
  handleSaveEntry: (entry: JournalEntry) => Promise<void>;
  // Auth actions
  handleSignOut: () => Promise<void>;
  // Day selection
  handleSelectDay: (day: number) => void;
  // State
  progress: UserProgress;
  fastState: FastState;
  journalEntries: JournalEntry[];
  // Loading states
  isLoading: boolean;
}

interface UseAppActionsProps {
  setView: (view: ViewState) => void;
}

export function useAppActions({ setView }: UseAppActionsProps): AppActionsReturn {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
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

  const handleStartFast = useCallback(async (startTime: number, durationHours: number) => {
    if (!progress) return;
    await startFastSession(startTime, durationHours, progress.currentDay);
    setView('TIMER');
  }, [progress, startFastSession, setView]);

  const handlePauseToggle = useCallback(async () => {
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
  }, [fastState, updateFastSession]);

  const handleEndEarly = useCallback(async () => {
    if (!window.confirm("Abort mission? This day will be marked as FAILED.")) return;

    if (!progress) {
      // If we don't have progress locally, just try to fail the session and navigate
      try {
        await failFastSession();
        setView('CALENDAR');
      } catch (err: any) {
        alert('Failed to mark session as failed. Please try again.');
      }
      return;
    }

    const dayToFail = progress.currentDay;
    const originalFailed = [...progress.failedDays];

    // First, optimistically add the failed day to progress. If this fails, abort early.
    try {
      await updateProgress({
        failedDays: [...originalFailed, dayToFail]
      });
    } catch (err: any) {
      alert('Failed to update progress to add failed day. Please try again.');
      return;
    }

    // Then attempt to mark the session failed. If this fails, rollback the progress change.
    try {
      await failFastSession();
    } catch (err: any) {
      // Attempt rollback, but don't throw if rollback fails — surface a clear error.
      try {
        await updateProgress({ failedDays: originalFailed });
      } catch (rollbackErr) {
        console.error('Rollback of failed day update failed:', rollbackErr);
        alert('Critical: failed to mark session as failed and rollback progress. Please contact support.');
        return;
      }

      alert('Failed to mark session as failed. Progress change was rolled back. Please try again.');
      return;
    }

    setView('CALENDAR');
  }, [failFastSession, progress, updateProgress, setView]);

  const handleComplete = useCallback(async () => {
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
  }, [fastState.isActive, completeFastSession, progress, updateProgress, setView]);

  const handleSaveEntry = useCallback(async (entry: JournalEntry) => {
    await addJournalEntry(entry);
  }, [addJournalEntry]);

  const handleSignOut = useCallback(async () => {
    if (window.confirm('Sign out? Your progress is saved to your account.')) {
      await signOut();
      navigate('/');
    }
  }, [signOut, navigate]);

  const handleSelectDay = useCallback((day: number) => {
    if (!progress) return;

    if (progress.completedDays.includes(day)) {
      alert(`Day ${day} Completed. Review Journal for details.`);
    } else if (day === progress.currentDay) {
      setView('CHALLENGE');
    }
  }, [progress, setView]);

  const isLoading = progressLoading || fastLoading || journalLoading;

  return {
    handleStartFast,
    handlePauseToggle,
    handleEndEarly,
    handleComplete,
    handleSaveEntry,
    handleSignOut,
    handleSelectDay,
    progress,
    fastState,
    journalEntries,
    isLoading
  };
}
