-- =====================================================
-- QUICK FIX: Remove SECURITY DEFINER from waitlist_stats view
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop the existing view completely
DROP VIEW IF EXISTS public.waitlist_stats CASCADE;

-- Recreate the view WITHOUT security definer
-- By default, views use SECURITY INVOKER which is safer
CREATE VIEW public.waitlist_stats
WITH (security_invoker=true)
AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM public.waitlist_leads;

-- Verify the fix
SELECT
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND viewname = 'waitlist_stats';

-- If you see the view listed above, the fix worked! ✅
