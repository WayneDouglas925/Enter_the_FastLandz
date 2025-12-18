-- Migration: add function to atomically add a completed difficulty
-- Adds function `add_completed_difficulty` that appends a difficulty
-- to the `completed_difficulties` TEXT[] only if not already present and
-- updates `easy_mode_completed_at` (or a generic last_completed_at if preferred).

CREATE OR REPLACE FUNCTION public.add_completed_difficulty(
  p_user_id uuid,
  p_diff text
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.user_progress
  SET
    easy_mode_completed_at = CASE
      WHEN p_diff = 'easy' THEN now()
      ELSE easy_mode_completed_at
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

-- Grant execute to anon (optional) if you want public RPC access
-- GRANT EXECUTE ON FUNCTION public.add_completed_difficulty(uuid, text) TO anon;
