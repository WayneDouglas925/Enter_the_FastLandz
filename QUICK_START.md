# Fastlandz - Quick Start Guide 🚀

## 5-Minute Setup

### Option A: With Supabase (Recommended for production)

```bash
# 1. Create Supabase project at https://supabase.com
# 2. Run supabase_schema.sql in SQL Editor
# 3. Copy .env.local.example to .env.local
cp .env.local.example .env.local

# 4. Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=your_key_here

# 5. Start the app
npm run dev
```

Open http://localhost:3000 and sign up!

### Option B: Without Supabase (LocalStorage mode)

```bash
# Just run the app - no setup needed!
npm run dev
```

Open http://localhost:3000 and start using it immediately. Data will be saved to localStorage.

## Enable Google OAuth (Optional)

1. **Create Google OAuth App**:
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

2. **Add to Supabase**:
   - Go to Authentication > Providers > Google
   - Paste Client ID and Secret
   - Save

3. **Test**: Click "Sign in with Google" button

## What You Get

✅ **Immediately Available** (no Supabase):
- Fasting timer with pause/resume
- 7-day challenge tracking
- Journal entries
- Basic stats
- Works completely offline

✅ **With Supabase**:
- Everything above PLUS:
- Google OAuth login
- Cloud sync across devices
- Full analytics dashboard
- Profile settings
- Data export
- Real-time updates

## Common Issues

### "Module not found: @supabase/supabase-js"
```bash
npm install
```

### "Missing environment variables"
Either create `.env.local` with Supabase credentials, or ignore it to use localStorage mode.

### Google OAuth not working
Make sure redirect URI in Google Console exactly matches the one from Supabase settings.

## Next Steps

1. **Read**: `IMPLEMENTATION_COMPLETE.md` for full feature list
2. **Setup**: Follow `SUPABASE_SETUP.md` for detailed database setup
3. **Deploy**: Push to Vercel/Netlify with environment variables

## Support

- Documentation: See `IMPLEMENTATION_PLAN.md`
- Supabase Issues: Check https://supabase.com/docs
- Code: All files are well-commented

---

**That's it! You're ready to go.** 🎉
