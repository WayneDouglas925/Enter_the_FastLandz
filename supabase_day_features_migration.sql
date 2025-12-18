-- Migration: Add day-specific feature data storage
-- This allows us to save state for special day features like water tracking, checkboxes, etc.
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ADD DAY FEATURES COLUMN TO JOURNAL ENTRIES
-- =====================================================

-- Add JSONB column to store day-specific feature data
ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS day_features JSONB DEFAULT '{}'::jsonb;

-- Add comment to document the structure
COMMENT ON COLUMN public.journal_entries.day_features IS
'Stores day-specific feature data in JSON format:
Day 3: {"waterCups": [true, false, true, ...]}
Day 4: {"snackZones": {"morning": true, "afternoon": false, ...}, "confession": "text"}
Day 5: {"protocol": "low-carb", "mealPlan": "text"}
Day 7: {"battleLog": "text"}';

-- Create an index on the JSONB column for faster queries
CREATE INDEX IF NOT EXISTS idx_journal_day_features
ON public.journal_entries USING gin(day_features);

-- =====================================================
-- 2. ADD DIFFICULTY LEVEL SUPPORT (FOR FUTURE)
-- =====================================================

-- Add difficulty level to user_progress for Easy/Intermediate/Hard modes
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'easy';

-- Add constraint to ensure valid difficulty levels
ALTER TABLE public.user_progress
ADD CONSTRAINT valid_difficulty_level
CHECK (difficulty_level IN ('easy', 'intermediate', 'hard', 'extreme'));

-- Track completed difficulty levels
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS completed_difficulties TEXT[] DEFAULT '{}';

-- =====================================================
-- 3. ADD VICTORY/COMPLETION TRACKING
-- =====================================================

-- Add column to track when Easy Mode was completed
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS easy_mode_completed_at TIMESTAMP WITH TIME ZONE;

-- Add column to track intermediate mode completion
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS intermediate_mode_completed_at TIMESTAMP WITH TIME ZONE;

-- Add column to track hard mode completion
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS hard_mode_completed_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 4. ADD ONBOARDING TRACKING
-- =====================================================

-- Add onboarding completion flag to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add onboarding data (stores the 3-step responses)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.profiles.onboarding_data IS
'Stores onboarding responses:
{
  "experience": "beginner|intermediate|advanced",
  "goal": "weight_loss|health|discipline|longevity",
  "commitment": "casual|serious|all_in"
}';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- View updated schema
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'journal_entries'
ORDER BY ordinal_position;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_progress'
ORDER BY ordinal_position;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- DONE! Your database now supports day-specific features
-- =====================================================
