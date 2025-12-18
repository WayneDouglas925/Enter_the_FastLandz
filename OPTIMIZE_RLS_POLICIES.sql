-- =====================================================
-- OPTIMIZE RLS POLICIES FOR PERFORMANCE
-- Run this in Supabase SQL Editor
-- =====================================================
--
-- Issue: auth.uid() is being re-evaluated for each row
-- Fix: Wrap auth.uid() in a subquery: (select auth.uid())
-- This evaluates once per query instead of once per row
--
-- Impact: Significant performance improvement at scale
-- =====================================================

-- =====================================================
-- PROFILES TABLE - Optimize RLS Policies
-- =====================================================

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

-- =====================================================
-- USER_PROGRESS TABLE - Optimize RLS Policies
-- =====================================================

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

-- =====================================================
-- FAST_SESSIONS TABLE - Optimize RLS Policies
-- =====================================================

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

-- =====================================================
-- JOURNAL_ENTRIES TABLE - Optimize RLS Policies
-- =====================================================

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
-- VERIFICATION - Check policies are optimized
-- =====================================================

SELECT
  schemaname,
  tablename,
  policyname,
  CASE
    WHEN qual LIKE '%(select auth.uid())%' OR qual LIKE '%(SELECT auth.uid())%' THEN '✅ OPTIMIZED'
    WHEN qual LIKE '%auth.uid()%' THEN '❌ NOT OPTIMIZED'
    ELSE 'ℹ️  CHECK MANUALLY'
  END as optimization_status,
  qual as policy_definition
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_progress', 'fast_sessions', 'journal_entries')
ORDER BY tablename, policyname;

-- =====================================================
-- DONE!
-- All 14 RLS policies are now optimized for performance
-- Re-run Database Linter to verify warnings are gone
-- =====================================================
