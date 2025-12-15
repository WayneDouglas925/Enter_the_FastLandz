# Onboarding & Lead Capture Setup

## What's New? 🎉

Your app now has:

1. **Lead Capture** - Landing page collects emails to waitlist before sign-up
2. **Onboarding Flow** - New users go through a 3-step personalization process
3. **Test Group Tracking** - All users are tagged as MVP cohort members
4. **Better User Journey** - Landing → Email Capture → Sign Up → Onboarding → App

## Setup Instructions

### Step 1: Run the New SQL Schema

1. Go to your Supabase dashboard → SQL Editor
2. Open the file `supabase_onboarding_schema.sql` from your project
3. Copy and paste the entire SQL into the editor
4. Click **Run** (Ctrl+Enter)

This will create:
- `waitlist_leads` table - stores email captures from landing page
- Onboarding fields on `profiles` table
- Auto-conversion trigger (marks leads as converted when they sign up)
- Analytics view for tracking leads

### Step 2: Test the Flow

1. Your dev server should already be running at http://localhost:3002
2. Go to the landing page
3. Enter an email in the waitlist form → Gets saved to Supabase
4. Click "Sign Up" in the auth modal → Creates account
5. Complete the 3-step onboarding → Saves preferences
6. Start using the app!

## New Features

### Landing Page
- ✅ Email capture before authentication
- ✅ All emails saved to `waitlist_leads` table
- ✅ "Member Login" button opens auth modal

### Onboarding (First-time users only)
- **Step 1:** Select goals (weight loss, clarity, energy, health)
- **Step 2:** Choose experience level (beginner, some, regular)
- **Step 3:** Set fasting window and notification preferences
- ✅ All data saved to user profile
- ✅ Only shows once per user

### Database Tables

#### `waitlist_leads`
```sql
- email (unique)
- source ('landing_page')
- status ('pending' → 'converted')
- metadata (JSON with timestamp, user agent)
- created_at
```

#### Updated `profiles`
```sql
- onboarding_completed (boolean)
- onboarding_data (JSON with goals, experience, preferences)
- test_group ('mvp_cohort_1')
```

## Analytics

You can check your lead stats in Supabase SQL Editor:

```sql
-- See waitlist stats
SELECT * FROM waitlist_stats;

-- View all leads
SELECT * FROM waitlist_leads ORDER BY created_at DESC;

-- See who completed onboarding
SELECT 
  email, 
  username,
  test_group,
  onboarding_completed,
  onboarding_data->>'goals' as goals,
  created_at
FROM profiles
WHERE onboarding_completed = true;
```

## User Journey Flow

```
Landing Page
    ↓
Email Capture (saved to waitlist_leads)
    ↓
Click "Join" / "Start Challenge"
    ↓
Auth Modal (Sign Up)
    ↓
Account Created (lead marked as 'converted')
    ↓
Onboarding (3 steps) - FIRST TIME ONLY
    ↓
Main App (Challenge/Calendar/Journal)
```

## What Happens When?

- **First visit:** Landing page visible to everyone
- **Email submit:** Saved to `waitlist_leads` with status='pending'
- **Sign up:** Creates profile, lead status changes to 'converted'
- **First login:** Onboarding appears (3 steps)
- **After onboarding:** Full app access, onboarding never shows again
- **Returning users:** Skip onboarding, go straight to app

## Next Steps

- [ ] Run `supabase_onboarding_schema.sql` in Supabase
- [ ] Test the complete flow
- [ ] Check the `waitlist_leads` table for captured emails
- [ ] Customize onboarding questions if needed
- [ ] Add more test groups as needed

## Customization Ideas

### Add More Onboarding Steps
Edit `components/Onboarding.tsx` and add step 4, 5, etc.

### Change Test Group Name
In `supabase_onboarding_schema.sql`, change:
```sql
test_group TEXT DEFAULT 'mvp_cohort_1'
```

### Track More Lead Data
Add fields to `waitlist_leads.metadata` JSON:
```typescript
metadata: {
  timestamp: new Date().toISOString(),
  user_agent: navigator.userAgent,
  referral_source: document.referrer,
  // Add your own fields
}
```

## Questions?

- Onboarding not showing? Check browser console for errors
- Leads not saving? Verify RLS policies in Supabase
- Want to reset onboarding? Set `onboarding_completed = false` in profiles table
