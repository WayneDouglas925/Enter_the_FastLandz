-- =====================================================
-- SUPABASE SECURITY FIXES
-- Run this in your Supabase SQL Editor to fix all security warnings
-- =====================================================

-- =====================================================
-- FIX 1: Remove SECURITY DEFINER from waitlist_stats view
-- ERROR: security_definer_view
-- =====================================================

-- Drop the old view
DROP VIEW IF EXISTS public.waitlist_stats;

-- Recreate without SECURITY DEFINER (will use SECURITY INVOKER by default)
CREATE VIEW public.waitlist_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM public.waitlist_leads;

-- Add RLS policy so only service_role can view this
-- (Regular users don't need access to analytics)
DROP POLICY IF EXISTS "Only service role can view waitlist stats" ON public.waitlist_leads;

-- =====================================================
-- FIX 2: Add search_path to update_updated_at_column function
-- WARN: function_search_path_mutable
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- FIX 3: Add search_path to handle_new_user function
-- WARN: function_search_path_mutable
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username');

  INSERT INTO public.user_progress (user_id, current_day, unlocked_days, completed_days, failed_days)
  VALUES (NEW.id, 1, 1, '{}', '{}');

  RETURN NEW;
END;
$$;

-- =====================================================
-- FIX 4: Add search_path to capture_lead function
-- WARN: function_search_path_mutable
-- =====================================================

CREATE OR REPLACE FUNCTION public.capture_lead(
  p_email TEXT,
  p_source TEXT DEFAULT 'landing_page',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead_id UUID;
BEGIN
  INSERT INTO public.waitlist_leads (email, source, metadata)
  VALUES (p_email, p_source, p_metadata)
  ON CONFLICT (email) DO UPDATE
    SET metadata = EXCLUDED.metadata,
        created_at = NOW()
  RETURNING id INTO v_lead_id;

  RETURN v_lead_id;
END;
$$;

-- =====================================================
-- FIX 5: Add search_path to mark_lead_converted function
-- WARN: function_search_path_mutable
-- =====================================================

CREATE OR REPLACE FUNCTION public.mark_lead_converted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.waitlist_leads
  SET status = 'converted'
  WHERE email = NEW.email;

  RETURN NEW;
END;
$$;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify fixes were applied
-- =====================================================

-- Check that all functions have search_path set
SELECT
  routine_name,
  routine_type,
  security_type,
  CASE
    WHEN proconfig IS NULL THEN 'NO SEARCH_PATH SET ❌'
    ELSE 'SEARCH_PATH SET ✅'
  END as search_path_status
FROM information_schema.routines
LEFT JOIN pg_proc ON proname = routine_name
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'update_updated_at_column',
    'handle_new_user',
    'capture_lead',
    'mark_lead_converted'
  );

-- Check that waitlist_stats view is not SECURITY DEFINER
SELECT
  table_name,
  CASE
    WHEN viewname IS NOT NULL THEN 'VIEW EXISTS ✅'
    ELSE 'VIEW MISSING ❌'
  END as status
FROM information_schema.views
LEFT JOIN pg_views ON views.table_name = pg_views.viewname
WHERE table_schema = 'public'
  AND table_name = 'waitlist_stats';

-- =====================================================
-- DONE!
-- All Supabase security warnings should now be resolved.
-- Re-run the Database Linter to verify.
-- =====================================================
