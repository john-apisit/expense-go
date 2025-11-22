# Expense Go - Setup Guide

Detailed installation and configuration guide

## 1. Setup Supabase Project

### Create a New Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or Login
3. Click "New Project"
4. Fill in the information:
   - Name: expense-go (or your preference)
   - Database Password: Create a strong password (save it for later use)
   - Region: Choose closest to you (Singapore recommended for Asia)
5. Click "Create new project" (wait for project to be ready)

### Run Database Migrations

1. Go to "SQL Editor" menu in your Supabase project
2. Click "New query"
3. Copy entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" (or Ctrl/Cmd + Enter)
6. If successful, you'll see "Success. No rows returned"

7. Repeat for `supabase/migrations/002_seed_categories.sql`

### Verify Tables

1. Go to "Table Editor" menu
2. You should see all tables:
   - categories
   - initial_balance
   - recurring_transactions
   - one_time_transactions

### Enable Email Auth

1. Go to "Authentication" > "Providers"
2. Verify "Email" is enabled
3. (Optional) Disable "Confirm email" for easier testing (development only)

### Get API Keys

1. Go to "Settings" > "API"
2. Copy:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public key** (VITE_SUPABASE_ANON_KEY)

## 2. Setup Local Project

### Install Dependencies

```bash
yarn install
```

### Create .env File

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Replace with your actual API keys from Supabase

### Verify .gitignore

Ensure `.env` is in `.gitignore` (should not be committed to git)

## 3. Run the Project

```bash
yarn dev
```

Open browser at `http://localhost:5173` (or displayed port)

## 4. Test the Application

### Register

1. Click "Don't have an account? Sign up"
2. Enter Email and Password (minimum 6 characters)
3. Click "Sign Up"
4. If Email Confirmation is enabled:
   - Check your email and click verification link
   - Return and login
5. If Email Confirmation is disabled:
   - You'll be logged in automatically

### Setup Initial Balance

1. First screen will be "Set Initial Balance"
2. Enter your current balance (e.g., 10000)
3. Click "Save"
4. You'll be redirected to Dashboard

### Test Features

1. **Dashboard** - View overview
2. **Recurring Transactions** - Add recurring items (e.g., salary, rent)
3. **One-Time Transactions** - Add one-time items (e.g., shopping)
4. **Monthly Summary** - View monthly summary

## 5. Verify Data in Supabase

### Table Editor

Go to "Table Editor" to view saved data:

- `categories` - Should have default categories
- `initial_balance` - Should have your initial balance
- `recurring_transactions` - Added recurring transactions
- `one_time_transactions` - Added one-time transactions

### Authentication

Go to "Authentication" > "Users" to view registered users

## 6. Troubleshooting

### Cannot Login

- Verify `.env` has correct values
- Verify Email Auth is enabled
- Check Console (F12) for error messages

### Cannot See Data

- Verify RLS Policies were created (in migrations)
- Check Console for errors
- Go to Table Editor to verify data exists

### Migration Failed

- Check SQL syntax
- Try running migration in sections
- Verify no duplicate tables exist (drop table if necessary)

### Build Error

```bash
# Delete node_modules and reinstall
rm -rf node_modules
yarn install

# Clear cache
rm -rf dist
yarn dev
```

## 7. Production Deployment

### Build

```bash
yarn build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set Environment Variables in Vercel Dashboard

### Deploy to Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify init`
3. Set Environment Variables in Netlify Dashboard

### Environment Variables (Production)

Don't forget to add Environment Variables in your hosting platform:

```
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-key
```

## 8. Ongoing Maintenance

### Backup Data

Supabase has Auto Backup, but you should also:
- Export important data periodically (Table Editor > Export to CSV)
- Or use `pg_dump` for full backup

### Update Schema

If you need to add/modify schema:
1. Write new migration SQL
2. Run via SQL Editor
3. Update TypeScript types in `src/shared/types/database.ts`

### Add Categories

Users can:
- Use provided default categories
- Create new categories (requires category management UI)

## 9. Tips & Best Practices

### Security

- Don't commit `.env` to git
- Use RLS policies for all tables
- Validate input on both Frontend and Backend

### Performance

- Use appropriate indexes (already included in migrations)
- Cache data that doesn't change often
- Use pagination for large datasets

### Development

- Use TypeScript fully
- Write components with Composition API
- Separate logic into composables

## Having Issues?

If you encounter problems during installation:

1. Check Console (F12 > Console)
2. Check Network tab for API errors
3. Check Supabase logs (Dashboard > Logs)
4. Try creating a new project if necessary

## Next Steps (Optional)

- Add category management UI
- Add data export functionality (CSV/PDF)
- Add interactive charts (Chart.js, Recharts)
- Add Dark mode
- Create Mobile app with Capacitor
- Add notifications (bills due soon)

---

Enjoy using Expense Go! 🎉
