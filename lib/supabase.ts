import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using localStorage fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types (generated from Supabase schema)
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

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
