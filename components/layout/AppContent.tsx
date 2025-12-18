import React from 'react';
import { ViewState, FastState, UserProgress, JournalEntry, ChallengeData } from '../../types';
import { ChallengeSetup } from '../ChallengeSetup';
import { TimerDisplay } from '../TimerDisplay';
import { CalendarView } from '../CalendarView';
import { JournalView } from '../JournalView';

interface AppContentProps {
  view: ViewState;
  progress: UserProgress;
  fastState: FastState;
  currentChallenge: ChallengeData;
  challenges: ChallengeData[];
  journalEntries: JournalEntry[];
  selectedDay: number | null;
  onStartFast: (startTime: number, durationHours: number) => Promise<void>;
  onPauseToggle: () => Promise<void>;
  onComplete: () => Promise<void>;
  onSelectDay: (day: number) => void;
  onSaveEntry: (entry: JournalEntry) => Promise<void>;
  onClearSelection: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({
  view,
  progress,
  fastState,
  currentChallenge,
  challenges,
  journalEntries,
  selectedDay,
  onStartFast,
  onPauseToggle,
  onComplete,
  onSelectDay,
  onSaveEntry,
  onClearSelection
}) => {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        {view === 'CHALLENGE' && (
          <ChallengeSetup
            challenge={currentChallenge}
            onStartFast={onStartFast}
          />
        )}

        {view === 'TIMER' && (
          <TimerDisplay
            fastState={fastState}
            challengeData={currentChallenge}
            onPause={onPauseToggle}
            onResume={onPauseToggle}
            onComplete={onComplete}
          />
        )}

        {view === 'CALENDAR' && (
          <CalendarView
            progress={progress}
            challenges={challenges}
            onSelectDay={onSelectDay}
          />
        )}

        {view === 'JOURNAL' && (
          <JournalView
            currentDay={progress.currentDay}
            progress={progress}
            onSaveEntry={onSaveEntry}
            entries={journalEntries}
            challenges={challenges}
            selectedDay={selectedDay}
            onClearSelection={onClearSelection}
          />
        )}
      </div>
    </main>
  );
};
