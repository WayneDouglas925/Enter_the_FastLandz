# FastLandz Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. Fix Supabase Security Issues

Run the `SECURITY_FIXES.sql` file in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `SECURITY_FIXES.sql`
4. Click **Run**
5. Verify fixes by running the Database Linter again

**What it fixes:**
- ✅ Removes SECURITY DEFINER from waitlist_stats view
- ✅ Adds search_path to all functions (prevents security vulnerabilities)
- ✅ Protects against schema injection attacks

---

### 2. Verify Database Schema

Make sure both schema files have been run:

1. **First:** Run `supabase_schema.sql` (main schema)
2. **Second:** Run `supabase_onboarding_schema.sql` (adds waitlist + onboarding fields)

**Important:** The `onboarding_completed` field is required for the app to work correctly!

---

### 3. Configure Supabase Auth

#### A. Enable Email/Password Authentication
1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. ✅ **Enable email confirmations** (recommended)
4. Set **Site URL** to your production domain (e.g., `https://fastlandz.vercel.app`)

#### B. Enable Google OAuth (Optional)
1. Go to **Authentication > Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Add **Authorized redirect URLs**:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project-*.vercel.app/auth/callback` (for preview deployments)
   - `http://localhost:3000/auth/callback` (for local development)

#### C. Configure URL Settings
1. Go to **Authentication > URL Configuration**
2. Set **Site URL**: `https://fastlandz.vercel.app` (your production URL)
3. Add **Redirect URLs**:
   - `https://fastlandz.vercel.app/**`
   - `https://your-project-*.vercel.app/**` (for preview deployments)
   - `http://localhost:3000/**` (for local development)

#### D. Enable Leaked Password Protection (Recommended)
1. Go to **Authentication > Providers > Email**
2. Scroll to **Password Requirements**
3. ✅ Enable **"Check against leaked passwords"**
4. This uses HaveIBeenPwned to prevent compromised passwords

---

### 4. Deploy to Vercel

#### A. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings

#### B. Configure Environment Variables
Add these in Vercel dashboard under **Settings > Environment Variables**:

```bash
# Required - Get these from Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT:**
- Add them to **Production**, **Preview**, and **Development** environments
- Never commit these to Git!
- The `.env` files are now properly ignored

#### C. Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Test your production URL

---

### 5. Post-Deployment Verification

#### Test Authentication Flow
1. ✅ Sign up with email/password
2. ✅ Check email for confirmation (if enabled)
3. ✅ Sign in
4. ✅ Test Google OAuth (if enabled)
5. ✅ Test sign out

#### Test App Features
1. ✅ Start a fast session
2. ✅ Pause/resume timer
3. ✅ Complete a challenge
4. ✅ Add journal entry
5. ✅ View calendar
6. ✅ Check offline mode (disconnect internet, make changes, reconnect)

#### Verify Supabase Linter
1. Go to **Database > Linter**
2. All security warnings should be resolved ✅
3. No errors should appear

---

## 🔧 Troubleshooting

### Issue: "Network Error" on Auth
**Solution:** Check that Supabase URL and Anon Key are correct in Vercel environment variables.

### Issue: Google OAuth Redirect Fails
**Solution:**
1. Add all Vercel URLs to Supabase redirect URLs
2. Include preview deployment URLs: `https://your-project-*.vercel.app/**`

### Issue: 404 on Page Refresh
**Solution:** The `vercel.json` file should fix this. If still happening:
1. Verify `vercel.json` exists in repo
2. Redeploy from Vercel dashboard

### Issue: "onboarding_completed" Column Missing
**Solution:** Run `supabase_onboarding_schema.sql` in Supabase SQL Editor

### Issue: Waitlist Emails Not Saving
**Solution:**
1. Verify RLS policy exists: "Anyone can submit to waitlist"
2. Check `waitlist_leads` table exists
3. Run `supabase_onboarding_schema.sql` if missing

---

## 📝 Development vs Production

### Local Development (.env.local)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Commands
```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---

## 🔐 Security Best Practices

### ✅ Implemented
- Row Level Security (RLS) on all tables
- SECURITY DEFINER functions have search_path set
- Environment variables properly prefixed with `VITE_`
- .env files are gitignored
- Security headers in vercel.json
- CSRF protection via Supabase Auth
- XSS protection (React escapes by default)

### 🔒 Recommended
- Enable leaked password protection in Supabase
- Use strong password requirements (8+ characters)
- Enable email confirmation for new signups
- Monitor Supabase Auth logs for suspicious activity
- Set up rate limiting (Supabase Pro feature)

---

## 📊 Monitoring

### Supabase Dashboard
- **Auth > Users**: Monitor signups and logins
- **Database > Tables**: View data and RLS policies
- **Database > Linter**: Check for security issues
- **Logs**: Monitor errors and queries

### Vercel Dashboard
- **Analytics**: Track page views and performance
- **Functions**: Monitor edge function logs (if added later)
- **Deployment Logs**: Debug build issues

---

## 🎯 Next Steps After Launch

1. **Set up analytics** (Google Analytics, Plausible, etc.)
2. **Monitor error logs** (Sentry, LogRocket, etc.)
3. **Enable Supabase email templates** (customize welcome emails)
4. **Add monitoring alerts** (Vercel notifications, Supabase webhooks)
5. **Set up backup strategy** (Supabase automatic backups on Pro plan)
6. **Implement rate limiting** (if experiencing abuse)
7. **Add terms of service and privacy policy** pages

---

## ✅ All Fixes Applied

The following issues have been resolved:

### Database Security (Supabase)
- ✅ Fixed SECURITY DEFINER view warning
- ✅ Added search_path to all functions
- ✅ Proper RLS policies on all tables

### Deployment Configuration
- ✅ Created vercel.json for client-side routing
- ✅ Added security headers
- ✅ Configured build settings

### Code Quality
- ✅ Updated .gitignore to protect .env files
- ✅ Removed unused GEMINI_API_KEY
- ✅ Fixed setTimeout cleanup in AuthModal
- ✅ Fixed journal update queue bug

### Ready for Production! 🚀

