-- This migration adds a function to atomically add a completed difficulty to user_progress.

-- Migration: add function to atomically add a completed difficulty
-- Adds function `add_completed_difficulty` that appends a difficulty
-- to the `completed_difficulties` TEXT[] only if not already present and
-- updates `easy_mode_completed_at` (or a generic last_completed_at if preferred).

CREATE OR REPLACE FUNCTION public.add_completed_difficulty(
  p_user_id uuid,
  p_diff text,
  p_completed_at timestamp with time zone DEFAULT now()
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.user_progress
  SET
    easy_mode_completed_at = CASE
      WHEN p_diff = 'easy' AND easy_mode_completed_at IS NULL THEN p_completed_at
      ELSE easy_mode_completed_at -- Keep existing value if not 'easy' or already set
    END,
    intermediate_mode_completed_at = CASE
      WHEN p_diff = 'intermediate' THEN p_completed_at
      ELSE intermediate_mode_completed_at
    END,
    hard_mode_completed_at = CASE
      WHEN p_diff = 'hard' THEN p_completed_at
      ELSE hard_mode_completed_at
    END,
    completed_difficulties = (
      CASE
        WHEN completed_difficulties IS NULL THEN ARRAY[p_diff]
        WHEN p_diff = ANY(completed_difficulties) THEN completed_difficulties
        ELSE array_append(completed_difficulties, p_diff)
      END
    )
  WHERE user_id = p_user_id;
END;
$$;
-- Add SECURITY DEFINER and search_path for safety and performance
ALTER FUNCTION public.add_completed_difficulty(uuid, text, timestamp with time zone) SET search_path = public;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.add_completed_difficulty(uuid, text, timestamp with time zone) TO authenticated;

-- Verification (optional)
-- SELECT proname, proowner, prosecdef, provolatile, proconfig FROM pg_proc WHERE proname = 'add_completed_difficulty';
