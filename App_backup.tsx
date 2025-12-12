import React, { useState, useEffect } from 'react';
import { ViewState, FastState, UserProgress, JournalEntry } from './types';
import { CHALLENGES, QUOTES } from './data';
import { ChallengeSetup } from './components/ChallengeSetup';
import { TimerDisplay } from './components/TimerDisplay';
import { CalendarView } from './components/CalendarView';
import { JournalView } from './components/JournalView';
import { Skull, Map, BookOpen, Flame } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<ViewState>('CHALLENGE');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Persistent State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('fastlandz_progress');
    return saved ? JSON.parse(saved) : {
      currentDay: 1,
      unlockedDays: 1,
      completedDays: [],
      failedDays: []
    };
  });

  const [fastState, setFastState] = useState<FastState>(() => {
    const saved = localStorage.getItem('fastlandz_faststate');
    return saved ? JSON.parse(saved) : {
      isActive: false,
      startTime: null,
      targetEndTime: null,
      durationHours: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0
    };
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('fastlandz_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('fastlandz_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('fastlandz_faststate', JSON.stringify(fastState));
  }, [fastState]);

  useEffect(() => {
    localStorage.setItem('fastlandz_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // --- ACTIONS ---

  const handleStartFast = (startTime: number, durationHours: number) => {
    const targetEndTime = startTime + (durationHours * 60 * 60 * 1000);
    setFastState({
      isActive: true,
      startTime,
      targetEndTime,
      durationHours,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0
    });
    setView('TIMER');
  };

  const handlePauseToggle = () => {
    const now = Date.now();
    if (fastState.isPaused) {
      // Resume
      const pauseDuration = now - (fastState.pausedAt || now);
      setFastState(prev => ({
        ...prev,
        isPaused: false,
        pausedAt: null,
        totalPausedTime: prev.totalPausedTime + pauseDuration
      }));
    } else {
      // Pause
      setFastState(prev => ({
        ...prev,
        isPaused: true,
        pausedAt: now
      }));
    }
  };

  const handleEndEarly = () => {
    if (window.confirm("Abort mission? This day will be marked as FAILED.")) {
      setFastState({
        isActive: false,
        startTime: null,
        targetEndTime: null,
        durationHours: 0,
        isPaused: false,
        pausedAt: null,
        totalPausedTime: 0
      });
      
      setProgress(prev => ({
        ...prev,
        failedDays: [...prev.failedDays, progress.currentDay]
      }));
      setView('CALENDAR');
    }
  };

  const handleComplete = () => {
    if (!fastState.isActive) return;

    alert("MISSION ACCOMPLISHED. FEED, SURVIVOR.");
    
    setFastState({
      isActive: false,
      startTime: null,
      targetEndTime: null,
      durationHours: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0
    });

    setProgress(prev => {
        const nextDay = prev.currentDay + 1;
        return {
            ...prev,
            completedDays: [...prev.completedDays, prev.currentDay],
            unlockedDays: Math.max(prev.unlockedDays, nextDay),
            currentDay: nextDay > 7 ? 7 : nextDay 
        };
    });
    
    setView('JOURNAL');
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
  };

  const handleSelectDay = (day: number) => {
      if (progress.completedDays.includes(day)) {
          // Navigate to journal with this day selected
          setSelectedDay(day);
          setView('JOURNAL');
      } else if (day === progress.currentDay) {
          setView('CHALLENGE');
      }
  };

  const currentChallenge = CHALLENGES.find(c => c.day === progress.currentDay) || CHALLENGES[0];
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-void flex flex-col font-body text-stone-300">
      
      {/* Header - Mockup Style */}
      <header className="h-16 px-6 border-b-2 border-rust/20 flex items-center justify-between bg-stone-950/90 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center text-rust group cursor-pointer" onClick={() => setView('CHALLENGE')}>
          <Flame className="w-6 h-6 mr-2 group-hover:animate-pulse transition-all" />
          <span className="font-display text-xl tracking-[0.2em] uppercase">FASTLANDZ</span>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase text-stone-500">
            <button onClick={() => setView('CHALLENGE')} className={`hover:text-rust transition-colors ${view === 'CHALLENGE' || view === 'TIMER' ? 'text-rust border-b border-rust' : ''}`}>Current Day</button>
            <button onClick={() => setView('CALENDAR')} className={`hover:text-rust transition-colors ${view === 'CALENDAR' ? 'text-rust border-b border-rust' : ''}`}>Missions</button>
            <button onClick={() => setView('JOURNAL')} className={`hover:text-rust transition-colors ${view === 'JOURNAL' ? 'text-rust border-b border-rust' : ''}`}>Journal</button>
        </div>

        <div className="text-stone-600 text-xs font-mono bg-stone-900 px-3 py-1 border border-stone-800 rounded-sm">
            DAY {progress.currentDay} / 7
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
                currentChallenge={currentChallenge}
                onPauseToggle={handlePauseToggle}
                onEndEarly={handleEndEarly}
                onComplete={handleComplete}
                quote={randomQuote}
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

      {/* Mobile Bottom Navigation - Only visible on small screens */}
      <nav className="md:hidden border-t border-stone-800 bg-stone-950 p-2 fixed bottom-0 w-full grid grid-cols-3 gap-1 z-50">
        <button
            onClick={() => {
                if(fastState.isActive) setView('TIMER');
                else setView('CHALLENGE');
            }}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'CHALLENGE' || view === 'TIMER' ? 'text-rust bg-stone-900' : 'text-stone-500'}`}
        >
            <Skull className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-bold tracking-wider">Mission</span>
        </button>

        <button
            onClick={() => setView('CALENDAR')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'CALENDAR' ? 'text-dust bg-stone-900' : 'text-stone-500'}`}
        >
            <Map className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-bold tracking-wider">Map</span>
        </button>

        <button
            onClick={() => setView('JOURNAL')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${view === 'JOURNAL' ? 'text-stone-200 bg-stone-900' : 'text-stone-500'}`}
        >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-bold tracking-wider">Log</span>
        </button>
      </nav>

    </div>
  );
};

export default App;