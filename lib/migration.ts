import { supabase } from './supabase';
import { UserProgress, JournalEntry, FastState } from '../types';

export interface MigrationResult {
  success: boolean;
  progressMigrated: boolean;
  journalEntriesMigrated: number;
  fastSessionMigrated: boolean;
  errors: string[];
}

/**
 * Migrates all localStorage data to Supabase for a user
 * This should be called once after user signs in for the first time
 */
export const migrateLocalDataToSupabase = async (
  userId: string
): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    progressMigrated: false,
    journalEntriesMigrated: 0,
    fastSessionMigrated: false,
    errors: [],
  };

  if (!supabase) {
    result.success = false;
    result.errors.push('Supabase is not configured');
    return result;
  }

  try {
    // 1. Migrate Progress
    const localProgress = localStorage.getItem('fastlandz_progress');
    if (localProgress) {
      try {
        const progress: UserProgress = JSON.parse(localProgress);

        // Check if progress already exists
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (!existingProgress) {
          // Only migrate if no progress exists
          const { error } = await supabase.from('user_progress').insert({
            user_id: userId,
            current_day: progress.currentDay,
            unlocked_days: progress.unlockedDays,
            completed_days: progress.completedDays,
            failed_days: progress.failedDays,
          });

          if (error) throw new Error(`Progress migration failed: ${error.message}`);
          result.progressMigrated = true;
        } else {
          // Update existing progress if local is more advanced
          const { error } = await supabase
            .from('user_progress')
            .update({
              current_day: progress.currentDay,
              unlocked_days: progress.unlockedDays,
              completed_days: progress.completedDays,
              failed_days: progress.failedDays,
            })
            .eq('user_id', userId);

          if (error) throw new Error(`Progress update failed: ${error.message}`);
          result.progressMigrated = true;
        }
      } catch (err: any) {
        result.errors.push(`Progress migration error: ${err.message}`);
      }
    }

    // 2. Migrate Journal Entries
    const localJournal = localStorage.getItem('fastlandz_journal');
    if (localJournal) {
      try {
        const entries: JournalEntry[] = JSON.parse(localJournal);

        // Check which entries already exist
        const { data: existingEntries } = await supabase
          .from('journal_entries')
          .select('day')
          .eq('user_id', userId);

        const existingDays = new Set(existingEntries?.map((e) => e.day) || []);

        // Only migrate entries that don't exist
        const entriesToMigrate = entries.filter((entry) => !existingDays.has(entry.day));

        if (entriesToMigrate.length > 0) {
          const journalData = entriesToMigrate.map((entry) => ({
            user_id: userId,
            day: entry.day,
            date: entry.date,
            mood: entry.mood,
            symptoms: entry.symptoms,
            pre_fast_meal: entry.preFastMeal,
            notes: entry.notes,
            completed: entry.completed,
          }));

          const { error } = await supabase.from('journal_entries').insert(journalData);

          if (error) throw new Error(`Journal migration failed: ${error.message}`);
          result.journalEntriesMigrated = entriesToMigrate.length;
        }
      } catch (err: any) {
        result.errors.push(`Journal migration error: ${err.message}`);
      }
    }

    // 3. Migrate Active Fast Session
    const localFastState = localStorage.getItem('fastlandz_faststate');
    if (localFastState) {
      try {
        const fastState: FastState = JSON.parse(localFastState);

        // Only migrate if there's an active fast
        if (fastState.isActive && fastState.startTime && fastState.targetEndTime) {
          // Check if there's already an active session
          const { data: activeSessions } = await supabase
            .from('fast_sessions')
            .select('id')
            .eq('user_id', userId)
            .eq('is_active', true);

          if (!activeSessions || activeSessions.length === 0) {
            const { error } = await supabase.from('fast_sessions').insert({
              user_id: userId,
              day: 1, // Default, may not be accurate
              start_time: new Date(fastState.startTime).toISOString(),
              target_end_time: new Date(fastState.targetEndTime).toISOString(),
              duration_hours: fastState.durationHours,
              is_active: true,
              is_paused: fastState.isPaused,
              paused_at: fastState.pausedAt
                ? new Date(fastState.pausedAt).toISOString()
                : null,
              total_paused_time: fastState.totalPausedTime,
            });

            if (error)
              throw new Error(`Fast session migration failed: ${error.message}`);
            result.fastSessionMigrated = true;
          }
        }
      } catch (err: any) {
        result.errors.push(`Fast session migration error: ${err.message}`);
      }
    }

    // 4. Clear localStorage after successful migration (only if no errors)
    if (result.errors.length === 0) {
      localStorage.removeItem('fastlandz_progress');
      localStorage.removeItem('fastlandz_journal');
      localStorage.removeItem('fastlandz_faststate');

      // Set migration flag
      localStorage.setItem('fastlandz_migrated', 'true');
    } else {
      result.success = false;
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Migration failed: ${error.message}`);
    return result;
  }
};

/**
 * Checks if data has already been migrated for this user
 */
export const hasBeenMigrated = (): boolean => {
  return localStorage.getItem('fastlandz_migrated') === 'true';
};

/**
 * Checks if there's any local data that needs migration
 */
export const hasLocalData = (): boolean => {
  return !!(
    localStorage.getItem('fastlandz_progress') ||
    localStorage.getItem('fastlandz_journal') ||
    localStorage.getItem('fastlandz_faststate')
  );
};

/**
 * Reset migration flag (useful for testing)
 */
export const resetMigrationFlag = (): void => {
  localStorage.removeItem('fastlandz_migrated');
};
