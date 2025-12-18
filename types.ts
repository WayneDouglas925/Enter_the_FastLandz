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
  // Image paths (optional)
  heroImage?: string;       // Main challenge image
  timerImage?: string;      // Timer background image
  iconImage?: string;       // Small icon/badge
  // Day-specific metadata
  timerTitle?: string;      // e.g., "The Wasteland Trek"
  difficulty?: string;       // e.g., "Hard", "Moderate"
  statusIndicator?: string;  // e.g., "Ketosis", "Deep Ketosis", "Fat Burning"
  subtitle?: string;         // Additional subtitle text
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