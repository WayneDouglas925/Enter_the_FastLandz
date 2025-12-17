export type ViewState = 'LANDING' | 'CHALLENGE' | 'TIMER' | 'CALENDAR' | 'JOURNAL';

export interface ChallengeData {
  day: number;
  title: string;
  fastHours: number;
  behavior: string;
  movement: string;
  shortBlurb: string;
  lessonTitle: string;
  lessonContent: string;
  bonusTip: string;
  notesPrompt: string;
}

export interface FastState {
  isActive: boolean;
  startTime: number | null; // Timestamp
  targetEndTime: number | null; // Timestamp
  durationHours: number;
  isPaused: boolean;
  pausedAt: number | null;
  totalPausedTime: number; // In milliseconds
  sessionId?: string; // Supabase ID
}

export interface JournalEntry {
  day: number;
  date: string;
  mood: string;
  symptoms: string;
  preFastMeal: string;
  notes: string;
  completed: boolean;
}

export interface UserProgress {
  currentDay: number; // 1-7
  unlockedDays: number;
  completedDays: number[];
  failedDays: number[];
}