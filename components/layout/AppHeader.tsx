import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, User, LogOut } from 'lucide-react';
import { ViewState, UserProgress } from '../../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppHeaderProps {
  user: SupabaseUser | null;
  progress: UserProgress | null;
  view: ViewState;
  setView: (view: ViewState) => void;
  onSignOut: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  progress,
  view,
  setView,
  onSignOut
}) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 px-6 border-b-2 border-rust/20 flex items-center justify-between bg-stone-950/90 sticky top-0 z-50 backdrop-blur-sm">
      <div 
        className="flex items-center text-rust group cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <Flame className="w-6 h-6 mr-2 group-hover:animate-pulse transition-all" />
        <span className="font-display text-xl tracking-[0.2em] uppercase">FASTLANDZ</span>
      </div>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-bold tracking-widest uppercase text-stone-500">
        <button 
          onClick={() => setView('CHALLENGE')} 
          className={`hover:text-rust transition-colors ${view === 'CHALLENGE' || view === 'TIMER' ? 'text-rust border-b border-rust' : ''}`}
        >
          Current Day
        </button>
        <button 
          onClick={() => setView('CALENDAR')} 
          className={`hover:text-rust transition-colors ${view === 'CALENDAR' ? 'text-rust border-b border-rust' : ''}`}
        >
          Missions
        </button>
        <button 
          onClick={() => setView('JOURNAL')} 
          className={`hover:text-rust transition-colors ${view === 'JOURNAL' ? 'text-rust border-b border-rust' : ''}`}
        >
          Journal
        </button>
        {user && (
          <button 
            onClick={onSignOut} 
            className="hover:text-blood transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </nav>

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
  );
};
