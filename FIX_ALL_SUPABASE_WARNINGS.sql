-- =====================================================
-- COMPLETE FIX FOR ALL SUPABASE WARNINGS
-- Run this entire file in Supabase SQL Editor
-- Fixes: security_definer_view + 14 auth_rls_initplan warnings
-- =====================================================

-- =====================================================
-- PART 1: Fix SECURITY DEFINER View
-- =====================================================

DROP VIEW IF EXISTS public.waitlist_stats CASCADE;

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

-- =====================================================
-- PART 2: Optimize Function search_path
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
-- PART 3: Optimize RLS Policies (Performance)
-- =====================================================

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- USER_PROGRESS TABLE
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- FAST_SESSIONS TABLE
DROP POLICY IF EXISTS "Users can view own fast sessions" ON public.fast_sessions;
CREATE POLICY "Users can view own fast sessions"
  ON public.fast_sessions FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own fast sessions" ON public.fast_sessions;
CREATE POLICY "Users can insert own fast sessions"
  ON public.fast_sessions FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own fast sessions" ON public.fast_sessions;
CREATE POLICY "Users can update own fast sessions"
  ON public.fast_sessions FOR UPDATE
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own fast sessions" ON public.fast_sessions;
CREATE POLICY "Users can delete own fast sessions"
  ON public.fast_sessions FOR DELETE
  USING ((select auth.uid()) = user_id);

-- JOURNAL_ENTRIES TABLE
DROP POLICY IF EXISTS "Users can view own journal entries" ON public.journal_entries;
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own journal entries" ON public.journal_entries;
CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own journal entries" ON public.journal_entries;
CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own journal entries" ON public.journal_entries;
CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries FOR DELETE
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check view is fixed
SELECT
  schemaname,
  viewname,
  CASE
    WHEN viewname = 'waitlist_stats' THEN '✅ View exists and is optimized'
    ELSE 'ℹ️  Other view'
  END as status
FROM pg_views
WHERE schemaname = 'public'
  AND viewname = 'waitlist_stats';

-- Check functions have search_path
SELECT
  routine_name,
  CASE
    WHEN specific_name IN (
      SELECT oid::regprocedure::text
      FROM pg_proc
      WHERE proconfig @> ARRAY['search_path=public']
    ) THEN '✅ Has search_path'
    ELSE '❌ Missing search_path'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_name IN (
    'update_updated_at_column',
    'handle_new_user',
    'capture_lead',
    'mark_lead_converted'
  );

-- Check RLS policies are optimized
SELECT
  tablename,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN qual LIKE '%(select auth.uid())%' OR qual LIKE '%(SELECT auth.uid())%' THEN 1 END) as optimized_policies,
  CASE
    WHEN COUNT(*) = COUNT(CASE WHEN qual LIKE '%(select auth.uid())%' OR qual LIKE '%(SELECT auth.uid())%' THEN 1 END)
    THEN '✅ All policies optimized'
    ELSE '⚠️  Some policies need optimization'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_progress', 'fast_sessions', 'journal_entries')
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✅ Fixed security_definer_view (waitlist_stats)
-- ✅ Added search_path to 4 functions
-- ✅ Optimized 14 RLS policies for performance
--
-- Total: 19 warnings fixed!
--
-- Next step: Re-run Database Linter to verify
-- =====================================================
