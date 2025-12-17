# FastLandz MVP Flow Update

## Summary
The landing page has been separated from the app onboarding experience to better support email capture for tester recruitment and provide a clearer user journey.

## New User Flow

### 1. Public Landing Page (`/`)
**Component:** `PublicLandingPage.tsx`

**Purpose:** Email capture and tester recruitment

**Features:**
- Hero section with email capture form
- Saves emails to `waitlist_leads` table in Supabase
- Shows "You're on the list!" message after submission
- Explains what testers will experience
- Highlights why beta testing is valuable
- "Member Login" button in header for existing users

**CTA Flow:**
- User submits email → Saved to waitlist
- User clicks "Join Waitlist" or "Member Login" → Opens auth modal

---

### 2. Authentication Modal
**Component:** `AuthModal.tsx`

**Updated Behavior:**
- **Sign Up:** After successful signup → Redirects to `/welcome`
- **Sign In:** After successful login → Redirects to `/app`
- Supports both email/password and Google OAuth

---

### 3. Welcome Page (`/welcome`)
**Component:** `WelcomePage.tsx`

**Purpose:** Introduce new users to the app

**Features:**
- Welcome message and overview
- Explains the 7-day protocol structure
- Shows key features:
  - Progressive Challenge
  - Fasting Timer
  - Mission Map (Calendar)
  - Daily Lessons
- Lists important protocol rules
- Medical disclaimer
- "Continue to Setup" button → Goes to `/onboarding`

**Access:** Protected route (requires authentication)

---

### 4. Onboarding (`/onboarding`)
**Component:** `Onboarding.tsx` (existing, now integrated into flow)

**Purpose:** Personalize user experience

**Features:**
- Step 1: Select goals (weight loss, mental clarity, energy, health)
- Step 2: Experience level (beginner, some experience, regular faster)
- Step 3: Enable notifications and confirm understanding
- Saves data to `profiles.onboarding_data` in Supabase
- Marks `onboarding_completed = true`

**After Completion:** Redirects to `/app`

**Access:** Protected route (requires authentication)

---

### 5. Main App (`/app`)
**Purpose:** Core application experience

**Features:**
- Challenge view (current day)
- Timer display (active fasting)
- Calendar view (7-day map)
- Journal view (daily reflections)

**Access:** Protected route (requires authentication + completed onboarding)

**Onboarding Check:** If user hasn't completed onboarding, automatically redirects to `/welcome`

---

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                      NEW USER JOURNEY                        │
└─────────────────────────────────────────────────────────────┘

1. User visits site
   ↓
2. Lands on PUBLIC LANDING PAGE (/)
   - Reads about the protocol
   - Submits email to waitlist
   - Email saved to waitlist_leads table
   ↓
3. Clicks "Member Login" or "Join Waitlist"
   ↓
4. AUTH MODAL opens
   - User signs up (email/password or Google)
   ↓
5. Redirects to WELCOME PAGE (/welcome)
   - Learns about app features
   - Understands protocol structure
   - Clicks "Continue to Setup"
   ↓
6. Redirects to ONBOARDING (/onboarding)
   - Selects goals
   - Sets experience level
   - Enables notifications
   - Data saved to profile
   ↓
7. Redirects to MAIN APP (/app)
   - Starts Day 1 challenge
   - Full app access


┌─────────────────────────────────────────────────────────────┐
│                   RETURNING USER JOURNEY                     │
└─────────────────────────────────────────────────────────────┘

1. User visits site
   ↓
2. Lands on PUBLIC LANDING PAGE (/)
   ↓
3. Clicks "Member Login"
   ↓
4. AUTH MODAL opens
   - User signs in
   ↓
5. Redirects to MAIN APP (/app)
   - Continues from last checkpoint
```

---

## Routing Structure

### Public Routes
- `/` - Landing page (email capture)

### Protected Routes (require authentication)
- `/welcome` - Welcome/intro page
- `/onboarding` - 3-step setup
- `/app` - Main application

### Route Guards
- All protected routes check for authentication
- `/app` redirects to `/welcome` if onboarding not completed
- Unauthenticated users redirected to `/`

---

## Technical Changes

### Files Created
1. `components/PublicLandingPage.tsx` - New email-focused landing page
2. `components/WelcomePage.tsx` - New welcome/intro page
3. `MVP_FLOW_UPDATE.md` - This documentation

### Files Modified
1. `index.tsx` - Added `BrowserRouter` wrapper
2. `App.tsx` - Complete rewrite with React Router
   - Added Routes and protected route logic
   - Integrated all new pages
   - Maintained existing app functionality
3. `AuthModal.tsx` - Added navigation after auth
   - Sign up → `/welcome`
   - Sign in → `/app`

### Dependencies Added
- `react-router-dom` - Client-side routing

---

## Key Features

### Landing Page
- **Email Collection:** Saves to `waitlist_leads` table
- **Duplicate Handling:** Silently ignores duplicate emails
- **Metadata Tracking:** Stores timestamp and user agent
- **Tester Focus:** Emphasizes MVP testing and early access
- **Clear CTAs:** Multiple paths to signup

### Welcome Page
- **Educational:** Explains protocol before commitment
- **Feature Preview:** Shows what users will get
- **Rule Clarity:** Sets expectations upfront
- **Medical Disclaimer:** Covers liability
- **Smooth Transition:** Natural flow to onboarding

### Onboarding Integration
- **Seamless:** Part of signup flow, not a blocker
- **Data Collection:** Stores preferences for future personalization
- **One-Time:** Only shown on first login
- **Required:** Must complete to access app

---

## Database Tables Used

### `waitlist_leads`
Stores email captures from landing page
- `email` (unique)
- `source` ('landing_page')
- `status` (pending → converted on signup)
- `metadata` (JSON with timestamp, user_agent)

### `profiles`
Extended user profile data
- `id` (FK to auth.users)
- `email`
- `username`
- `onboarding_completed` (boolean)
- `onboarding_data` (JSON with goals, experience, notifications)

---

## Testing Checklist

### New User Flow
- [ ] Visit `/` - See landing page
- [ ] Submit email - Saved to waitlist
- [ ] Click "Join Waitlist" - Auth modal opens
- [ ] Sign up - Redirected to `/welcome`
- [ ] View welcome page - See features explained
- [ ] Click "Continue to Setup" - Go to `/onboarding`
- [ ] Complete onboarding - Redirected to `/app`
- [ ] Access main app - See Day 1 challenge

### Returning User Flow
- [ ] Visit `/` - See landing page
- [ ] Click "Member Login" - Auth modal opens
- [ ] Sign in - Redirected to `/app`
- [ ] Access main app - See current progress

### Edge Cases
- [ ] Try to access `/app` without auth - Redirected to `/`
- [ ] Try to access `/welcome` without auth - Redirected to `/`
- [ ] Try to access `/app` without completing onboarding - Redirected to `/welcome`
- [ ] Sign out from app - Redirected to `/`
- [ ] Submit duplicate email to waitlist - No error shown

---

## Running the App

```bash
cd Enter_the_FastLandz
npm install
npm run dev
```

Server runs at: `http://localhost:3000`

---

## Next Steps

1. Test the complete flow with Supabase configured
2. Verify email capture is working
3. Test both signup and signin flows
4. Ensure onboarding data is saved correctly
5. Confirm redirects work as expected
6. Test on mobile devices
7. Verify protected routes block unauthenticated access

---

## Notes

- The old `LandingPage.tsx` is still present but no longer used
- All existing app functionality remains intact
- LocalStorage persistence still works
- Supabase is optional but recommended for multi-device support
- The separation allows for independent A/B testing of landing page vs app experience
