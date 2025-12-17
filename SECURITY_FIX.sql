-- =====================================================
-- FIX: Remove SECURITY DEFINER from waitlist_stats view
-- =====================================================
--
-- ISSUE: The view public.waitlist_stats was created with SECURITY DEFINER
-- which bypasses RLS and runs with the creator's privileges instead of
-- the querying user's privileges.
--
-- SECURITY RISK: Any user who can query this view could see aggregate
-- stats from all waitlist leads, even if RLS policies should restrict them.
--
-- =====================================================

-- Step 1: Drop the existing view
DROP VIEW IF EXISTS public.waitlist_stats;

-- Step 2: Recreate the view WITHOUT SECURITY DEFINER
-- This will run with the caller's privileges and respect RLS
CREATE VIEW public.waitlist_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM public.waitlist_leads;

-- Step 3: Grant access ONLY to service_role (admin access)
-- This ensures only your backend/admin can see the stats
REVOKE ALL ON public.waitlist_stats FROM anon, authenticated;
GRANT SELECT ON public.waitlist_stats TO service_role;

-- =====================================================
-- ALTERNATIVE APPROACH (if you need authenticated users to see stats)
-- =====================================================
-- If you want authenticated users to see their OWN stats only,
-- you could create a different view or function. Example:
--
-- CREATE OR REPLACE FUNCTION public.get_my_waitlist_status()
-- RETURNS TABLE (
--   email TEXT,
--   status TEXT,
--   created_at TIMESTAMPTZ
-- )
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER -- OK here because it's limited scope
-- AS $$
--   SELECT email, status, created_at
--   FROM public.waitlist_leads
--   WHERE email = auth.email(); -- Only shows current user's record
-- $$;
--
-- GRANT EXECUTE ON FUNCTION public.get_my_waitlist_status() TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after applying the fix to verify:

-- 1. Check view definition (should NOT have SECURITY DEFINER)
-- SELECT pg_get_viewdef('public.waitlist_stats'::regclass, true);

-- 2. Check permissions (only service_role should have access)
-- SELECT grantee, privilege_type
-- FROM information_schema.table_privileges
-- WHERE table_schema = 'public' AND table_name = 'waitlist_stats';

-- 3. Test as authenticated user (should be denied or empty)
-- SELECT * FROM public.waitlist_stats; -- As authenticated user

-- 4. Test as service_role (should work)
-- SELECT * FROM public.waitlist_stats; -- As service_role
