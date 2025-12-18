# Supabase Setup Guide for Easy Mode

## What You Need to Do

To support all the Easy Mode features (water tracking, snack checkboxes, carb protocol, battle log), you need to run a database migration in Supabase.

---

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Fastlandz project
3. Click on **SQL Editor** in the left sidebar

### 2. Run the Migration

1. Open the file: `supabase_day_features_migration.sql`
2. Copy the entire contents
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### 3. Verify It Worked

You should see output showing the updated schema. The migration adds:

**To `journal_entries` table:**
- `day_features` (JSONB) - Stores day-specific data like water cups, checkboxes, etc.

**To `user_progress` table:**
- `difficulty_level` (TEXT) - Tracks current difficulty (easy/intermediate/hard)
- `completed_difficulties` (TEXT[]) - Array of completed difficulty levels
- `easy_mode_completed_at` (TIMESTAMP) - When Easy Mode was finished
- `intermediate_mode_completed_at` (TIMESTAMP) - For future use
- `hard_mode_completed_at` (TIMESTAMP) - For future use

**To `profiles` table:**
- `onboarding_completed` (BOOLEAN) - Tracks onboarding completion
- `onboarding_data` (JSONB) - Stores onboarding responses

---

## What Gets Stored Where

### Day 3: Water Warrior
```json
{
  "waterCups": [true, false, true, false, true, true, false, false]
}
```

### Day 4: Snack Assassin
```json
{
  "snackZones": {
    "noMorningSnack": true,
    "noAfternoonSnack": true,
    "noEveningSnack": false,
    "noLateNightSnack": true
  },
  "confession": "I ate a cookie at 3pm but powered through the rest"
}
```

### Day 5: Carb Reckoning
```json
{
  "protocol": "low-carb",
  "mealPlan": "3 eggs, bacon, avocado, spinach, black coffee"
}
```

### Day 7: Boss Fight
```json
{
  "battleLog": "Hour 16 was brutal. Wanted to quit. But I remembered why I started..."
}
```

---

## How the App Uses This Data

The app uses the new helper functions in `lib/dayFeatures.ts`:

- `saveDayFeatures(userId, day, data)` - Saves feature data
- `loadDayFeatures(userId, day)` - Loads saved data
- `markEasyModeComplete(userId)` - Marks Easy Mode as done
- `isEasyModeComplete(userId)` - Checks if completed

**Server-side helper:**
- `add_completed_difficulty(p_user_id uuid, p_diff text)` — a Postgres function that atomically appends `p_diff` to `completed_difficulties` (if not present) and sets `easy_mode_completed_at` when `p_diff = 'easy'`.
- To apply it, run the SQL in `supabase_add_completed_difficulty_fn.sql` via the Supabase SQL Editor.
- The app calls it via RPC: `await supabase.rpc('add_completed_difficulty', { p_user_id: userId, p_diff: 'easy' })`.

These functions automatically:
- Create journal entries if they don't exist
- Update existing entries with new feature data
- Handle errors gracefully

---

## Testing the Migration

After running the migration, test it with these SQL queries:

### Check journal_entries table
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'journal_entries'
ORDER BY ordinal_position;
```

### Check user_progress table
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_progress'
ORDER BY ordinal_position;
```

You should see all the new columns listed!

---

## What Happens If You Don't Run It?

The app will still work, but:
- ❌ Day-specific features won't save state
- ❌ Water cups will reset every time
- ❌ Snack checkboxes won't persist
- ❌ Battle logs will be lost
- ❌ Victory screen won't know if Easy Mode is complete

---

## Questions?

If you encounter any errors:

1. **"column already exists"** - That's fine! It means part of the migration already ran. Continue with the rest.
2. **"permission denied"** - Make sure you're using the SQL Editor as the project owner.
3. **Any other error** - Copy the error message and let me know!

---

## Next Steps After Migration

Once the migration is complete, the app will automatically:
1. ✅ Save water cup clicks
2. ✅ Remember snack zone checkboxes
3. ✅ Store carb protocol selections
4. ✅ Save battle logs
5. ✅ Track Easy Mode completion
6. ✅ Unlock Intermediate Mode (when ready)

**You're all set!** 🎉
