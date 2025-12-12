# Supabase Setup Guide for Fastlandz

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New Project"
5. Fill in:
   - **Project name**: `fastlandz` (or your preferred name)
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project" and wait 2-3 minutes for setup

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `supabase_schema.sql` from this project
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click "Run" (or press `Ctrl+Enter`)
7. You should see "Success. No rows returned" message

This will create:
- 4 tables (profiles, user_progress, fast_sessions, journal_entries)
- Row Level Security policies
- Indexes for performance
- Triggers for automatic timestamps
- Auto-signup function

## Step 3: Enable Google OAuth (Optional but Recommended)

1. In Supabase dashboard, go to "Authentication" > "Providers"
2. Find "Google" in the list and click to expand
3. Toggle "Enable Sign in with Google" to ON
4. You'll need to create a Google OAuth App:

### Creating Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure consent screen if prompted:
   - User Type: External
   - App name: Fastlandz
   - User support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Fastlandz
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (Get this URL from the Supabase Google provider settings)
7. Copy the **Client ID** and **Client Secret**
8. Paste them into your Supabase Google provider settings
9. Click "Save"

## Step 4: Get Your API Keys

1. In Supabase dashboard, go to "Project Settings" (gear icon at bottom left)
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon public** key: A long JWT token starting with `eyJ...`

## Step 5: Configure Your Local Environment

1. In your project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **NEVER commit `.env.local` to git!** (It's already in `.gitignore`)

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console (F12)
3. You should see no Supabase connection errors
4. Try signing up with a test account
5. Check your Supabase dashboard under "Authentication" > "Users" to see the new user

## Step 7: Verify Database Setup

In Supabase SQL Editor, run:

```sql
-- Check if all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Should show: profiles, user_progress, fast_sessions, journal_entries
```

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- All should show rowsecurity = true
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in your project root
- Make sure the variables start with `VITE_` prefix
- Restart your dev server after changing env variables

### "Invalid API key"
- Double-check you copied the **anon public** key, not the service_role key
- Make sure there are no extra spaces or quotes in the `.env.local` file

### "Row level security policy violation"
- Make sure you ran the complete `supabase_schema.sql` file
- Check that RLS policies were created: Go to "Database" > "Policies" in Supabase

### Google OAuth not working
- Make sure the redirect URI in Google Console exactly matches the one from Supabase
- Wait a few minutes after saving Google credentials in Supabase
- Clear browser cache and cookies

## Next Steps

After completing the setup:
1. The app will automatically use Supabase for authentication
2. All user data will be stored in Supabase instead of localStorage
3. Existing localStorage data will be migrated on first login
4. You can view/manage users in the Supabase dashboard

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables to your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Update Google OAuth redirect URIs to include your production domain:
   ```
   https://your-app.vercel.app/
   ```

3. Consider enabling email confirmation in Supabase:
   - Go to Authentication > Settings
   - Enable "Email Confirmations"
