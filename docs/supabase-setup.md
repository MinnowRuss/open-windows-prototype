# Supabase Setup Guide — Open Windows Member App

**Version**: 1.0
**Date**: February 27, 2026
**Reference schema**: `docs/schema.sql`
**Reference seed data**: `docs/seed.sql`

This guide walks through setting up the Supabase backend for the Open Windows Member App from scratch. Follow every step in order.

---

## Overview

Supabase gives us:
- **PostgreSQL database** — stores all patient data
- **Auth** — handles email/password login and session management
- **Row Level Security (RLS)** — ensures patients can only see their own data
- **REST & Realtime APIs** — auto-generated from the database schema

---

## Part 1 — Create Your Supabase Project

### Step 1: Create an Account

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign in with GitHub (recommended) or create an email account

### Step 2: Create a New Project

1. From the Supabase dashboard, click **New project**
2. Fill in the details:
   - **Organization**: Create or select your org (e.g. "Open Windows")
   - **Name**: `open-windows-member-app`
   - **Database Password**: Generate a strong password and **save it somewhere safe** (you'll need it later)
   - **Region**: Choose the region closest to your users (e.g. `US East (N. Virginia)`)
   - **Plan**: Free tier is fine for development; upgrade before pilot launch
3. Click **Create new project**
4. Wait 1–2 minutes for the project to provision

> ⚠️ **Save your database password now.** Supabase won't show it again.

---

## Part 2 — Apply the Database Schema

### Step 3: Open the SQL Editor

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**

### Step 4: Run the Schema

1. Open the file `docs/schema.sql` from this repository
2. Copy the **entire contents** of that file
3. Paste it into the SQL Editor
4. Click **Run** (or press `Cmd + Enter`)

You should see: `Success. No rows returned`

This creates all 7 tables:
- `profiles` (extends Supabase Auth users)
- `patients`
- `medications`
- `care_plans`
- `care_team_members`
- `messages`
- `educational_content`
- `appointments`

It also creates:
- Row Level Security policies on every table
- Indexes for query performance
- `updated_at` triggers on medications and care plans

### Step 5: Verify the Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should see all 8 tables listed
3. Click on `patients` — confirm it has columns: `id`, `user_id`, `first_name`, `last_name`, `dob`, etc.

---

## Part 3 — Configure Authentication

### Step 6: Set Auth Settings

1. Go to **Authentication** → **Providers** in the left sidebar
2. Confirm **Email** provider is enabled (it is by default)
3. Go to **Authentication** → **Configuration** → **Auth Settings**
4. Set the following:

| Setting | Value | Reason |
|---------|-------|--------|
| **Site URL** | `http://localhost:5173` (dev) | Where to redirect after email confirmation |
| **JWT Expiry** | `2592000` (30 days in seconds) | Long sessions for elderly patients |
| **Enable email confirmations** | Off (for now) | Simplifies pilot onboarding; turn on for production |
| **Minimum password length** | `8` | Basic security |

5. Click **Save**

> 📝 **Note**: You'll update the Site URL to your production Vercel URL before pilot launch.

### Step 7: Create the Pilot Test User (Margaret Chen)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: `margaret@test.openwindows.app`
   - **Password**: `TestPatient2026!`
   - **Auto Confirm User**: ✓ checked
4. Click **Create user**
5. **Copy the user's UUID** — you'll need it in the next step

---

## Part 4 — Seed Test Data

### Step 8: Add Margaret Chen's Patient Record

1. Go back to **SQL Editor** → **New query**
2. Open `docs/seed.sql` from this repository
3. **Before running it**, find this line near the top:
   ```sql
   -- REPLACE THIS with Margaret Chen's actual user UUID from Step 7
   \set margaret_user_id 'PASTE-UUID-HERE'
   ```
4. Replace `PASTE-UUID-HERE` with the UUID you copied in Step 7
5. Copy the full contents of `seed.sql` and paste into the SQL Editor
6. Click **Run**

You should see: `Success. No rows returned`

This populates:
- Margaret Chen's patient profile
- 6 medications (with mix of statuses)
- Full care plan with 7 goals and advance directive
- 6 care team members
- 9 messages
- 6 educational articles
- 3 upcoming appointments

### Step 9: Verify the Seed Data

1. Go to **Table Editor** → `patients`
2. You should see one row: Margaret Chen
3. Go to `medications` — you should see 6 rows
4. Go to `messages` — you should see 9 rows

---

## Part 5 — Get Your API Credentials

### Step 10: Find Your Project Keys

1. Go to **Project Settings** (gear icon) → **API**
2. You'll see two important values:

| Key | What It Is | Where It Goes |
|-----|-----------|---------------|
| **Project URL** | Your Supabase endpoint | `VITE_SUPABASE_URL` in `.env.local` |
| **anon/public key** | Safe to expose in frontend | `VITE_SUPABASE_ANON_KEY` in `.env.local` |

> ⚠️ **Never expose the `service_role` key in the frontend.** It bypasses all RLS and has full database access. Keep it server-side only.

### Step 11: Create Your Environment File

1. In the project root (same folder as `package.json`), create a file called `.env.local`
2. Add the following (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Confirm `.env.local` is in `.gitignore` (it is — we added it during setup)

> ✅ **Never commit `.env.local` to Git.** It contains credentials.

---

## Part 6 — Connect the App to Supabase

### Step 12: Install the Supabase Client

Run this in Terminal from the project folder:

```bash
npm install @supabase/supabase-js
```

### Step 13: Create the Supabase Client

Create a new file at `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})
```

### Step 14: Update the Auth Context

When you're ready to switch from mock data to real Supabase auth, update `src/context/AuthContext.jsx`. Replace the mock `login` function with:

```js
import { supabase } from '../lib/supabase'

const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return { success: true, user: data.user }
}

const logout = async () => {
  await supabase.auth.signOut()
  setUser(null)
}
```

---

## Part 7 — Row Level Security Verification

### Step 15: Test That RLS Is Working

This is critical. RLS ensures patients can ONLY see their own data.

1. Go to **SQL Editor** → **New query**
2. Run this test (it should return 0 rows because no role is set):

```sql
-- This simulates an unauthenticated request — should return nothing
SELECT * FROM patients;
```

3. If it returns rows, RLS is not enabled. Run:
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
```

4. Repeat for all tables: `medications`, `care_plans`, `care_team_members`, `messages`, `appointments`

> ✅ The `schema.sql` file already enables RLS on all tables. This step is just to verify.

---

## Part 8 — Before Pilot Launch Checklist

### Step 16: Production Readiness

Before onboarding real patients, complete these steps:

#### Security
- [ ] Confirm Supabase project is on a **paid plan** (required for HIPAA BAA)
- [ ] Sign a **Business Associate Agreement (BAA)** with Supabase
  - Go to: Supabase Dashboard → Organization Settings → HIPAA
- [ ] Rotate all API keys after development phase
- [ ] Enable **email confirmation** in Auth settings
- [ ] Set **Site URL** to production Vercel URL
- [ ] Enable **audit logging** (Supabase Pro plan)

#### Database
- [ ] Enable **Point-in-Time Recovery** (Supabase Pro) for backups
- [ ] Review and test all RLS policies with real user accounts
- [ ] Confirm no sensitive data is in Supabase dashboard logs
- [ ] Set up a staging environment (separate Supabase project)

#### Auth
- [ ] Test password reset flow end-to-end
- [ ] Confirm 30-day session expiry works correctly
- [ ] Test that logged-out users cannot access any data

#### Data
- [ ] Remove all seed/test data before real patient onboarding
- [ ] Create a data import script for real patient records
- [ ] Confirm patient data deletion is possible (right to erasure)

---

## Troubleshooting

### "JWT expired" errors
- Increase JWT expiry in Auth settings (we set 30 days — confirm it saved)
- Check that `autoRefreshToken: true` is set in the Supabase client

### "Row not found" when querying
- Usually an RLS issue. The user's UUID doesn't match the `user_id` on the patient record.
- Verify the patient row has the correct `user_id` (the Auth user's UUID)

### Can't log in after seeding
- Confirm the user was created with "Auto Confirm User" checked
- Try resetting the password via Authentication → Users → Reset password

### Schema errors when running `schema.sql`
- Run it in sections if needed — start with `CREATE TABLE profiles`, then each subsequent table
- If a table already exists, drop it first: `DROP TABLE IF EXISTS tablename CASCADE;`

### Slow queries
- All tables have indexes on `patient_id` and `user_id` — check they exist:
  ```sql
  SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
  ```

---

## Quick Reference

| URL | Purpose |
|-----|---------|
| `https://supabase.com/dashboard` | Supabase dashboard |
| `https://your-ref.supabase.co` | Your project API |
| `http://localhost:5173` | Local dev app |

| File | Purpose |
|------|---------|
| `docs/schema.sql` | Full database schema with RLS |
| `docs/seed.sql` | Margaret Chen test data |
| `src/lib/supabase.js` | Supabase client (create in Step 13) |
| `.env.local` | Your credentials (never commit) |

| Credential | Where to Find |
|-----------|--------------|
| Project URL | Settings → API → Project URL |
| Anon key | Settings → API → Project API keys → anon/public |
| DB password | Saved from Step 2 (not recoverable) |

---

*Open Windows Member App — Supabase Setup Guide v1.0*
*Keep this document updated as the project evolves.*
