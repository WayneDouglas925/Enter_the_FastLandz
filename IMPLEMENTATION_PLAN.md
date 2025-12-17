# Fastlandz Backend Integration & Bug Fixes - Implementation Plan

## Overview
Transform Fastlandz from a localStorage-only MVP to a production-ready application with Supabase backend integration, fixing critical bugs and completing missing features.

---

## Phase 1: Critical Bug Fixes (Current MVP)

### 1.1 Fix Timer Pause/Resume Accuracy
**Problem**: Timer displays incorrect remaining time after pause/resume because `totalPausedTime` isn't being applied correctly in TimerDisplay component.

**Current Issue** (TimerDisplay.tsx:37):
```typescript
const elapsed = now - startTime - fastState.totalPausedTime;
```
This calculation works, BUT when paused, the timer continues to calculate against current time.

**Solution**:
- When paused, freeze the display at current `timeLeft` value
- Add conditional logic to prevent recalculation when `isPaused` is true
- Ensure pause duration is only added when resuming

**Files to modify**:
- `TimerDisplay.tsx` lines 25-51

**Implementation**:
```typescript
useEffect(() => {
  if (!fastState.isActive || !fastState.targetEndTime) return;

  const interval = setInterval(() => {
    // If paused, don't update the timer
    if (fastState.isPaused && fastState.pausedAt) {
      return; // Keep current timeLeft frozen
    }

    const now = Date.now();
    const startTime = fastState.startTime || now;
    const targetTime = fastState.targetEndTime;

    const totalDuration = targetTime - startTime;
    const elapsed = now - startTime - fastState.totalPausedTime;
    const remaining = Math.max(0, totalDuration - elapsed);

    setTimeLeft(remaining);
    const prog = Math.min(100, (elapsed / totalDuration) * 100);
    setProgress(prog);

    if (remaining <= 0 && fastState.isActive) {
      onComplete();
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [fastState, onComplete]);
```

**Testing**:
- Start a fast
- Pause after 5 minutes
- Wait 2 minutes
- Resume
- Verify remaining time is correct (should not include the 2 paused minutes)

---

### 1.2 Remove or Implement Profile Feature
**Problem**: Profile button exists but is disabled, creating user confusion.

**Options**:
A. **Remove entirely** (Recommended for MVP)
B. **Implement basic profile** (add to Phase 3)

**Recommended Solution (A)**:
Remove profile button from both desktop and mobile nav until user authentication is implemented.

**Files to modify**:
- `App.tsx` lines 172, 250-255

**Implementation**:
- Delete desktop profile button (line 172)
- Delete mobile profile button (lines 250-255)
- Update grid from `grid-cols-4` to `grid-cols-3` (line 222)

---

### 1.3 Improve Calendar-Journal Integration
**Problem**: Journal entries are saved but not viewable from calendar view. Clicking completed days just shows alert.

**Solution**:
Add "View Journal Entry" functionality to calendar clicks.

**Files to modify**:
- `App.tsx` line 145-151
- `CalendarView.tsx` (pass journal entries as prop)
- `JournalView.tsx` (add ability to view specific day's entry)

**Implementation**:
1. Pass `journalEntries` to `CalendarView` component
2. When clicking a completed day, find associated journal entry
3. Navigate to journal view with day pre-selected
4. Filter journal history to show selected day's entry highlighted

---

## Phase 2: Supabase Backend Setup

### 2.1 Supabase Project Initialization

**Tasks**:
1. Create Supabase project
2. Set up database schema
3. Configure Row Level Security (RLS)
4. Generate API keys

**Database Schema**:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  current_day INTEGER DEFAULT 1,
  unlocked_days INTEGER DEFAULT 1,
  completed_days INTEGER[] DEFAULT '{}',
  failed_days INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Fast sessions table (track individual fasting sessions)
CREATE TABLE public.fast_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  target_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_hours INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  paused_at TIMESTAMP WITH TIME ZONE,
  total_paused_time BIGINT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  failed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  mood TEXT,
  symptoms TEXT,
  pre_fast_meal TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_fast_sessions_user_id ON public.fast_sessions(user_id);
CREATE INDEX idx_fast_sessions_active ON public.fast_sessions(user_id, is_active);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_day ON public.journal_entries(user_id, day);
```

**Row Level Security (RLS) Policies**:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fast_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Fast sessions policies
CREATE POLICY "Users can view own fast sessions"
  ON public.fast_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fast sessions"
  ON public.fast_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fast sessions"
  ON public.fast_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);
```

**Triggers for updated_at**:

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fast_sessions_updated_at BEFORE UPDATE ON public.fast_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2.2 Install Supabase Client

**Dependencies to install**:
```bash
npm install @supabase/supabase-js
```

**Files to create**:
- `lib/supabase.ts` - Supabase client configuration
- `lib/hooks/useSupabase.ts` - React hooks for Supabase operations
- `lib/hooks/useAuth.ts` - Authentication hooks
- `lib/hooks/useProgress.ts` - Progress data hooks
- `lib/hooks/useFastSession.ts` - Fast session hooks
- `lib/hooks/useJournal.ts` - Journal entry hooks

---

### 2.3 Create Supabase Client Configuration

**File**: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (generated from Supabase)
export type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgressDB = {
  id: string;
  user_id: string;
  current_day: number;
  unlocked_days: number;
  completed_days: number[];
  failed_days: number[];
  created_at: string;
  updated_at: string;
};

export type FastSessionDB = {
  id: string;
  user_id: string;
  day: number;
  start_time: string;
  target_end_time: string;
  actual_end_time: string | null;
  duration_hours: number;
  is_active: boolean;
  is_paused: boolean;
  paused_at: string | null;
  total_paused_time: number;
  completed: boolean;
  failed: boolean;
  created_at: string;
  updated_at: string;
};

export type JournalEntryDB = {
  id: string;
  user_id: string;
  day: number;
  date: string;
  mood: string | null;
  symptoms: string | null;
  pre_fast_meal: string | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};
```

---

### 2.4 Environment Configuration

**File**: `.env.local` (create new)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Update**: `.gitignore`
- Already configured to ignore `*.local` files (line 13)

**Update**: `vite.config.ts`
- Remove GEMINI_API_KEY references (not currently used)
- Ensure VITE_ prefixed env vars are automatically available

---

## Phase 3: Authentication Implementation

### 3.1 Create Authentication Context

**File**: `contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            username,
          },
        ]);

      if (profileError) throw profileError;

      // Initialize user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .insert([
          {
            user_id: data.user.id,
            current_day: 1,
            unlocked_days: 1,
            completed_days: [],
            failed_days: [],
          },
        ]);

      if (progressError) throw progressError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

### 3.2 Create Auth Components

**Files to create**:
- `components/AuthModal.tsx` - Login/Signup modal
- `components/ProtectedRoute.tsx` - Route wrapper for authenticated users

**File**: `components/AuthModal.tsx`

```typescript
import React, { useState } from 'react';
import { User, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-950 border-2 border-rust max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl text-rust uppercase mb-2">
            {mode === 'signin' ? 'Enter Fastlandz' : 'Join The Wasteland'}
          </h2>
          <p className="text-stone-500 text-sm">
            {mode === 'signin' ? 'Resume your survival' : 'Begin your journey'}
          </p>
        </div>

        {error && (
          <div className="bg-blood/20 border border-blood text-blood p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-stone-500 text-xs uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-stone-600" />
                <input
                  type="text"
                  required
                  className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="survivor_001"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-500 text-xs uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-600" />
              <input
                type="email"
                required
                className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-500 text-xs uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-600" />
              <input
                type="password"
                required
                className="w-full bg-stone-900 border border-stone-700 text-white p-3 pl-10 focus:border-rust outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rust hover:bg-orange-600 text-black font-display uppercase py-3 tracking-wider disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-stone-500 text-sm hover:text-rust"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### 3.3 Update App.tsx for Authentication

**Changes**:
1. Wrap app with `AuthProvider`
2. Show auth modal if not authenticated
3. Add sign out button to header
4. Implement Profile view with user info

---

## Phase 4: Data Migration & Sync

### 4.1 Create Migration Utility

**Purpose**: Migrate existing localStorage data to Supabase when user first logs in.

**File**: `lib/migration.ts`

```typescript
import { supabase } from './supabase';
import { UserProgress, JournalEntry } from '../types';

export const migrateLocalDataToSupabase = async (userId: string) => {
  try {
    // Migrate progress
    const localProgress = localStorage.getItem('fastlandz_progress');
    if (localProgress) {
      const progress: UserProgress = JSON.parse(localProgress);
      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          current_day: progress.currentDay,
          unlocked_days: progress.unlockedDays,
          completed_days: progress.completedDays,
          failed_days: progress.failedDays,
        });
    }

    // Migrate journal entries
    const localJournal = localStorage.getItem('fastlandz_journal');
    if (localJournal) {
      const entries: JournalEntry[] = JSON.parse(localJournal);
      const journalData = entries.map((entry) => ({
        user_id: userId,
        day: entry.day,
        date: entry.date,
        mood: entry.mood,
        symptoms: entry.symptoms,
        pre_fast_meal: entry.preFastMeal,
        notes: entry.notes,
        completed: entry.completed,
      }));

      if (journalData.length > 0) {
        await supabase.from('journal_entries').insert(journalData);
      }
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('fastlandz_progress');
    localStorage.removeItem('fastlandz_journal');
    localStorage.removeItem('fastlandz_faststate');

    console.log('Data migrated successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
```

---

### 4.2 Create Custom Hooks for Data Operations

**File**: `lib/hooks/useProgress.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { UserProgress } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setProgress({
          currentDay: data.current_day,
          unlockedDays: data.unlocked_days,
          completedDays: data.completed_days,
          failedDays: data.failed_days,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updatedProgress: Partial<UserProgress>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          current_day: updatedProgress.currentDay,
          unlocked_days: updatedProgress.unlockedDays,
          completed_days: updatedProgress.completedDays,
          failed_days: updatedProgress.failedDays,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProgress((prev) => ({ ...prev!, ...updatedProgress }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { progress, loading, error, updateProgress, refetch: fetchProgress };
};
```

**Similar hooks needed**:
- `lib/hooks/useFastSession.ts` - Manage active fast sessions
- `lib/hooks/useJournal.ts` - Manage journal entries

---

## Phase 5: Additional Features & Improvements

### 5.1 Data Export Functionality

**Purpose**: Allow users to export their progress and journal as JSON or PDF.

**File**: `components/ExportData.tsx`

**Features**:
- Export as JSON
- Export as PDF (using jsPDF library)
- Email export (via Supabase Edge Functions)

---

### 5.2 Error Handling & Validation

**Improvements**:
1. Add form validation for all inputs
2. Handle network errors gracefully
3. Show loading states for all async operations
4. Add retry logic for failed requests
5. Implement offline mode detection

**File**: `lib/errorHandling.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any): string => {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  if (error.message?.includes('network')) {
    return 'Network error. Check your connection and try again.';
  }

  if (error.code === 'PGRST116') {
    return 'Data not found. Please refresh and try again.';
  }

  return 'Something went wrong. Please try again.';
};
```

---

### 5.3 Accessibility Improvements

**Tasks**:
1. Add ARIA labels to all interactive elements
2. Ensure keyboard navigation works throughout
3. Add focus indicators for keyboard users
4. Improve color contrast for text readability
5. Add screen reader announcements for timer updates

**Files to modify**:
- All component files
- Add new `lib/accessibility.ts` for utilities

---

### 5.4 Analytics & Insights

**Features**:
- Stats dashboard showing:
  - Total fasting hours completed
  - Longest fast
  - Success rate
  - Streak counter
  - Weekly/monthly charts
- Achievement system (badges for milestones)

**New component**: `components/StatsView.tsx`

---

### 5.5 Notifications & Reminders

**Implementation**:
1. Browser push notifications (when timer completes)
2. Email reminders (via Supabase Edge Functions)
3. Daily challenge notifications

**File**: `lib/notifications.ts`

```typescript
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/badge.png',
    });
  }
};
```

---

## Phase 6: Testing & Deployment

### 6.1 Testing Strategy

**Unit Tests** (Vitest):
- Test custom hooks
- Test utility functions
- Test error handling

**Integration Tests**:
- Test authentication flow
- Test data sync between localStorage and Supabase
- Test timer accuracy

**E2E Tests** (Playwright):
- Test complete user journey
- Test fast start/pause/resume/complete flow
- Test journal entry creation

---

### 6.2 Performance Optimization

**Tasks**:
1. Implement React.memo for expensive components
2. Add lazy loading for routes
3. Optimize bundle size
4. Add service worker for offline support
5. Implement data caching strategy

---

### 6.3 Deployment

**Platforms**:
- **Frontend**: Vercel or Netlify
- **Backend**: Supabase (already hosted)

**Environment Variables** (Production):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Build command**:
```bash
npm run build
```

---

## Implementation Timeline Estimate

### Phase 1: Bug Fixes (2-3 hours)
- Timer fix: 1 hour
- Profile removal: 15 minutes
- Calendar-journal integration: 1.5 hours

### Phase 2: Supabase Setup (2-3 hours)
- Database schema: 1 hour
- RLS policies: 1 hour
- Client setup: 1 hour

### Phase 3: Authentication (4-5 hours)
- Auth context: 2 hours
- Auth UI components: 2 hours
- Integration: 1 hour

### Phase 4: Data Migration (3-4 hours)
- Migration utility: 1 hour
- Custom hooks: 2 hours
- Testing: 1 hour

### Phase 5: Additional Features (8-10 hours)
- Data export: 2 hours
- Error handling: 2 hours
- Accessibility: 2 hours
- Analytics: 3 hours
- Notifications: 1 hour

### Phase 6: Testing & Deployment (4-5 hours)
- Testing: 3 hours
- Optimization: 1 hour
- Deployment: 1 hour

**Total Estimate**: 23-30 hours

---

## Priority Order for MVP Launch

### Must Have (P0):
1. Fix timer pause/resume bug
2. Supabase setup and schema
3. Authentication implementation
4. Data sync (replace localStorage with Supabase)
5. Migration utility for existing users

### Should Have (P1):
6. Remove/hide profile feature
7. Calendar-journal integration
8. Error handling improvements
9. Data export functionality

### Nice to Have (P2):
10. Analytics dashboard
11. Accessibility improvements
12. Push notifications
13. Performance optimizations

---

## Files to Create

```
New Files:
├── lib/
│   ├── supabase.ts
│   ├── migration.ts
│   ├── errorHandling.ts
│   ├── notifications.ts
│   └── hooks/
│       ├── useProgress.ts
│       ├── useFastSession.ts
│       └── useJournal.ts
├── contexts/
│   └── AuthContext.tsx
├── components/
│   ├── AuthModal.tsx
│   ├── ExportData.tsx
│   └── StatsView.tsx
└── .env.local
```

## Files to Modify

```
Modified Files:
├── App.tsx (major refactor for auth + Supabase)
├── TimerDisplay.tsx (fix pause/resume)
├── CalendarView.tsx (journal integration)
├── JournalView.tsx (view specific entries)
├── types.ts (add DB types)
├── package.json (add dependencies)
├── vite.config.ts (clean up env vars)
└── index.tsx (wrap with AuthProvider)
```

---

## Dependencies to Add

```json
{
  "@supabase/supabase-js": "^2.x.x",
  "jspdf": "^2.x.x" (for PDF export),
  "date-fns": "^3.x.x" (for date formatting),
  "recharts": "^2.x.x" (for analytics charts - optional)
}
```

---

## Questions for Clarification

1. **Authentication**: Do you want social login (Google, GitHub) or just email/password?
2. **Profile**: Should we implement a full profile page or keep it minimal (just username/email)?
3. **Export**: Do you want PDF export, or is JSON sufficient for MVP?
4. **Analytics**: Is a stats dashboard important for MVP, or can it wait for v2?
5. **Notifications**: Browser notifications only, or also email via Supabase Edge Functions?
6. **Offline Mode**: Should the app work offline with local data sync when back online?

---

## Next Steps

1. Review and approve this plan
2. Answer clarification questions above
3. Create Supabase project and share credentials
4. Begin Phase 1 (bug fixes) while setting up Supabase
5. Implement phases sequentially or identify parallel work streams

---

**End of Implementation Plan**
