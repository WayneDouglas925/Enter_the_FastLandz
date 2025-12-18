import { supabase } from './supabase';

// Type definitions for day-specific features
export interface Day3Features {
  waterCups: boolean[]; // 8 cups
}

export interface Day4Features {
  snackZones: {
    noMorningSnack: boolean;
    noAfternoonSnack: boolean;
    noEveningSnack: boolean;
    noLateNightSnack: boolean;
  };
  confession?: string;
}

export interface Day5Features {
  protocol: 'zero-carb' | 'low-carb' | 'moderate-carb' | null;
  mealPlan?: string;
}

export interface Day7Features {
  battleLog?: string;
}

export type DayFeaturesData =
  | Day3Features
  | Day4Features
  | Day5Features
  | Day7Features
  | Record<string, never>;

/**
 * Save day-specific feature data to the database
 */
export async function saveDayFeatures(
  userId: string,
  day: number,
  features: DayFeaturesData
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not initialized' };
  }

  try {
    // Find existing journal entry for this day
    const { data: existingEntry } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('day', day)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { error } = await supabase
        .from('journal_entries')
        .update({ day_features: features })
        .eq('id', existingEntry.id);

      if (error) throw error;
    } else {
      // Create new journal entry with features
      const { error } = await supabase.from('journal_entries').insert({
        user_id: userId,
        day,
        date: new Date().toISOString(),
        day_features: features,
        completed: false,
      });

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving day features:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Load day-specific feature data from the database
 */
export async function loadDayFeatures(
  userId: string,
  day: number
): Promise<{ data: DayFeaturesData | null; error?: string }> {
  if (!supabase) {
    return { data: null, error: 'Supabase not initialized' };
  }

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('day_features')
      .eq('user_id', userId)
      .eq('day', day)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine
      throw error;
    }

    return { data: data?.day_features || null };
  } catch (error) {
    console.error('Error loading day features:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mark Easy Mode as completed
 */
export async function markEasyModeComplete(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not initialized' };
  }

  try {
    // Call server-side function that atomically appends 'easy' to completed_difficulties
    // and sets easy_mode_completed_at (server time via now()).
    const { data: rpcData, error: rpcError } = await supabase.rpc('add_completed_difficulty', {
      p_user_id: userId,
      p_diff: 'easy',
    });

    if (rpcError) throw rpcError;

    return { success: true };
  } catch (error) {
    console.error('Error marking easy mode complete:', error);
    const message =
      error instanceof Error
        ? error.message
        : error && (error as any).message
        ? (error as any).message
        : 'Unknown error';

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Check if Easy Mode is completed
 */
export async function isEasyModeComplete(
  userId: string
): Promise<{ completed: boolean; error?: string }> {
  if (!supabase) {
    return { completed: false, error: 'Supabase not initialized' };
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('easy_mode_completed_at')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return { completed: !!data?.easy_mode_completed_at };
  } catch (error) {
    console.error('Error checking easy mode completion:', error);
    return {
      completed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
