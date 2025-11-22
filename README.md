# Expense Go - Personal Finance Management

A personal finance management application for tracking income, expenses, and financial planning.

## Features

- 🔐 **Authentication System** - Secure login with Supabase Auth
- 💰 **Initial Balance Setup** - Set your starting balance
- 📅 **Recurring Transactions** - Manage monthly income/expenses (salary, rent, installments)
- 💸 **One-Time Transactions** - Record one-time transactions
- 📊 **Monthly Summary** - View monthly income/expense summary with cumulative balance
- 📈 **Dashboard** - Overview of your finances in one view

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Styling**: TailwindCSS v4
- **Routing**: Vue Router
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite

## Project Structure

```
src/
├── features/              # Feature-based structure
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard
│   ├── initial-balance/  # Initial balance setup
│   ├── recurring-transactions/
│   ├── one-time-transactions/
│   └── monthly-summary/
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   ├── composables/      # Vue composables
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── router/              # Vue Router configuration
└── supabase/            # Supabase client
```

## Installation

### 1. Install Dependencies

```bash
yarn install
```

### 2. Setup Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run migrations in `supabase/migrations/` via SQL Editor

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Project

```bash
yarn dev
```

## Database Schema

### Tables

1. **categories** - Income/expense categories
2. **initial_balance** - Starting balance
3. **recurring_transactions** - Recurring transactions
4. **one_time_transactions** - One-time transactions

### Security

- Row Level Security (RLS) enabled for data security
- Each user can only access their own data

## Features Detail

### 1. Login/Register
- Sign up and login with Email/Password
- Default categories auto-created after registration

### 2. Initial Balance
- Set your initial balance on first use
- Used as baseline for balance calculations

### 3. Recurring Transactions
- Add/Edit/Delete recurring transactions
- Set start month and end month (or leave empty for ongoing)
- Suitable for: salary, rent, utilities, installments

### 4. One-Time Transactions
- Add/Edit/Delete one-time transactions
- Record with specific date
- Suitable for: daily expenses, one-time income

### 5. Monthly Summary
- Monthly summary view
- Separate recurring/one-time income and expenses
- Calculate net balance and cumulative balance per month
- Filter by date range

### 6. Dashboard
- Current month financial overview
- 6-month trend chart
- Recent transactions
- Quick actions

## Soft Delete

The system uses soft delete (`is_deleted = true`) instead of actual deletion to maintain data history and database integrity.

## Build

```bash
yarn build
```

## License

MIT
