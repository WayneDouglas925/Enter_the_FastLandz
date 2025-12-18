import React from 'react';
import { Skull, Map, BookOpen, LogOut } from 'lucide-react';
import { ViewState, FastState } from '../../types';

interface AppNavigationProps {
  view: ViewState;
  fastState: FastState;
  setView: (view: ViewState) => void;
  onSignOut: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  view,
  fastState,
  setView,
  onSignOut
}) => {
  const handleMissionClick = () => {
    if (fastState.isActive) {
      setView('TIMER');
    } else {
      setView('CHALLENGE');
    }
  };

  return (
    <nav className="md:hidden border-t border-stone-800 bg-stone-950 p-2 fixed bottom-0 w-full grid grid-cols-4 gap-1 z-50">
      <button
        onClick={handleMissionClick}
        className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
          view === 'CHALLENGE' || view === 'TIMER' 
            ? 'text-rust bg-stone-900' 
            : 'text-stone-500'
        }`}
      >
        <Skull className="w-6 h-6 mb-1" />
        <span className="text-xs uppercase font-bold tracking-wider">Mission</span>
      </button>

      <button
        onClick={() => setView('CALENDAR')}
        className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
          view === 'CALENDAR' 
            ? 'text-dust bg-stone-900' 
            : 'text-stone-500'
        }`}
      >
        <Map className="w-6 h-6 mb-1" />
        <span className="text-xs uppercase font-bold tracking-wider">Map</span>
      </button>

      <button
        onClick={() => setView('JOURNAL')}
        className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
          view === 'JOURNAL' 
            ? 'text-stone-200 bg-stone-900' 
            : 'text-stone-500'
        }`}
      >
        <BookOpen className="w-6 h-6 mb-1" />
        <span className="text-xs uppercase font-bold tracking-wider">Log</span>
      </button>

      <button
        onClick={onSignOut}
        className="flex flex-col items-center justify-center p-2 rounded transition-colors text-rust"
      >
        <LogOut className="w-6 h-6 mb-1" />
        <span className="text-xs uppercase font-bold tracking-wider">Exit</span>
      </button>
    </nav>
  );
};
