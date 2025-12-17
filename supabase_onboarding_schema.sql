-- Add to your Supabase SQL Editor after running the main schema
-- This adds lead capture and onboarding tracking

-- =====================================================
-- WAITLIST / LEADS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.waitlist_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing_page',
  referral_code TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'pending', -- pending, invited, converted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist_leads(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist_leads(status);

-- Enable RLS
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- No read access for regular users (admin only)
-- Allow inserts for anyone (lead capture)
DROP POLICY IF EXISTS "Anyone can submit to waitlist" ON public.waitlist_leads;
CREATE POLICY "Anyone can submit to waitlist"
  ON public.waitlist_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =====================================================
-- ADD ONBOARDING FIELDS TO PROFILES
-- =====================================================

-- Add columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB,
ADD COLUMN IF NOT EXISTS test_group TEXT DEFAULT 'mvp_cohort_1';

-- =====================================================
-- FUNCTIONS FOR LEAD CAPTURE
-- =====================================================

-- Function to capture a lead and optionally convert to user
CREATE OR REPLACE FUNCTION public.capture_lead(
  p_email TEXT,
  p_source TEXT DEFAULT 'landing_page',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to mark lead as converted when they sign up
CREATE OR REPLACE FUNCTION public.mark_lead_converted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.waitlist_leads
  SET status = 'converted'
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-convert leads when user signs up
DROP TRIGGER IF EXISTS on_user_created_convert_lead ON public.profiles;
CREATE TRIGGER on_user_created_convert_lead
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_lead_converted();

-- =====================================================
-- ANALYTICS VIEW (Optional)
-- =====================================================

DROP VIEW IF EXISTS public.waitlist_stats;
CREATE OR REPLACE VIEW public.waitlist_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM public.waitlist_leads;
