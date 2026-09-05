# 💸 SpendWise - Production Personal Expense Tracker

SpendWise is a complete, modern, multi-user personal finance and expense tracking web application. Built with React 18, Vite, Tailwind CSS, Recharts, Lucide React, and Supabase (PostgreSQL, Authentication with Google OAuth & Row Level Security).

---

## 🌟 Key Features

- **🔒 Multi-User Isolation via Database RLS**: Complete data isolation using Supabase Row Level Security (RLS). Every logged-in user can strictly only view, insert, update, and delete their own financial records.
- **🔐 Flexible Authentication**: Supports both Email/Password registration & login as well as **Google OAuth 2.0 ("Continue with Google")**.
- **📊 Real-time Dashboard**:
  - Total Balance, Current Month Income & Expenses with % change comparisons vs previous period.
  - Monthly Budget Tracking with visual progress bar and alert thresholds (<80% green, 80-99% orange, ≥100% red).
  - Spending Trend area chart (7D, 30D, 3M, 6M, 1Y filters).
  - Category spending donut chart.
  - Recent transactions activity list.
  - Quick action buttons (+ Add Expense, + Add Income, View Transactions, View Reports).
- **💸 Transaction Management**:
  - Filter transactions by Search term, Type (Expense/Income), Category, and Date Preset (This Week, This Month, This Year, Custom Date Range).
  - Sort by Newest, Oldest, Highest Amount, Lowest Amount.
  - Add, Edit, and Delete transactions with modal dialogs and toast notifications.
  - Responsive desktop table and mobile-friendly card layout.
  - **Export to CSV**: One-click transaction export for authenticated users.
- **📈 Advanced Analytics & Reports**:
  - **Weekly Report**: Monday–Sunday daily breakdown bar chart, average daily expense, highest & lowest spending days.
  - **Monthly Report**: Month picker with previous/next controls, monthly expense trend chart, category breakdown pie chart, income vs expense grouped bar chart.
  - **Yearly Report**: Year picker, 12-month expense vs income bar chart, monthly breakdown stats.
- **🏷️ Custom Category Management**: Pre-loaded default expense & income categories, with ability to create custom categories with icon pickers.
- **👤 Profile Settings**: Manage avatar, full name, currency preference (INR ₹, USD $, EUR €, GBP £, etc.), monthly budget limit, and account metadata.
- **🌙 Dark / Light Mode**: Seamless theme toggling with `localStorage` persistence and theme-aware charts.

---

## 🚀 Tech Stack

- **Frontend Framework**: React.js (v18) + Vite
- **Styling**: Tailwind CSS (v4) + Custom CSS Glassmorphism
- **Routing**: React Router (v6)
- **Charts & Analytics**: Recharts
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email & Password + Google OAuth 2.0)
- **Security**: PostgreSQL Row Level Security (RLS) policies

---

## 📁 Folder Structure

```
Expense/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── README.md
├── supabase_migration.sql     # Database schema, trigger & RLS policies
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   ├── supabase.js        # Supabase client initializer
    │   ├── utils.js           # Currency/date formatters, percentage & CSV export helper
    │   └── constants.js       # Default categories, icons map, currencies
    ├── context/
    │   ├── AuthContext.jsx    # Auth session state & user profile synchronization
    │   └── ThemeContext.jsx   # Dark / Light theme provider
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useTransactions.js # Transaction CRUD operations
    │   ├── useCategories.js   # User & default categories management
    │   ├── useProfile.js      # User profile updates
    │   └── useDashboard.js    # Metric aggregations & budget calculations
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.jsx  # Page container with sidebar, topbar, mobile nav
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── MobileNav.jsx  # Mobile bottom navigation bar
    │   ├── common/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Modal.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── Toast.jsx
    │   │   ├── Skeleton.jsx
    │   │   └── EmptyState.jsx
    │   ├── dashboard/
    │   │   ├── SummaryCard.jsx
    │   │   ├── BudgetProgress.jsx
    │   │   ├── QuickActions.jsx
    │   │   └── RecentTransactions.jsx
    │   ├── transactions/
    │   │   ├── TransactionFormModal.jsx
    │   │   ├── TransactionTable.jsx
    │   │   └── TransactionFilters.jsx
    │   ├── charts/
    │   │   ├── SpendingTrendChart.jsx
    │   │   ├── CategoryPieChart.jsx
    │   │   ├── IncomeExpenseChart.jsx
    │   │   └── WeeklyBarChart.jsx
    │   └── categories/
    │       └── CategoryModal.jsx
    └── pages/
        ├── Login.jsx
        ├── Signup.jsx
        ├── Dashboard.jsx
        ├── Transactions.jsx
        ├── WeeklyReport.jsx
        ├── MonthlyReport.jsx
        ├── YearlyReport.jsx
        ├── Categories.jsx
        └── Profile.jsx
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- A free account on [Supabase.com](https://supabase.com)

### 2. Database Migration in Supabase
1. Log into your **Supabase Dashboard** and create a new project.
2. Go to the **SQL Editor** tab in Supabase.
3. Copy the entire contents of the [`supabase_migration.sql`](file:///d:/Projects/Expense/supabase_migration.sql) file provided in this repository.
4. Paste into the SQL Editor and click **RUN**.
5. This script creates the `profiles`, `categories`, and `transactions` tables, sets up automatic user initialization triggers, creates performance indexes, and enforces strict RLS policies.

### 3. Google OAuth Setup in Supabase
To enable **"Continue with Google"**:
1. Go to the **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com/)).
2. Create a new project and configure the **OAuth consent screen**.
3. Go to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
4. Select **Web application** as Application type.
5. In **Authorized redirect URIs**, add your Supabase Callback URL found in Supabase Dashboard (**Authentication** -> **Providers** -> **Google** -> **Callback URL (for OAuth)**).
6. Copy the generated **Client ID** and **Client Secret**.
7. In **Supabase Dashboard**, go to **Authentication** -> **Providers** -> **Google**.
8. Paste your Google **Client ID** and **Client Secret**, check **Enable Google provider**, and click **Save**.

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Local Development
Run the following commands in terminal:

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚢 Production Deployment (Vercel)

1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically build and publish your application.

---

## 🛡️ Row Level Security (RLS) Model

Security is enforced at the database level so no client can query or tamper with another user's financial records:

- `profiles`: `auth.uid() = id`
- `categories`: `auth.uid() = user_id`
- `transactions`: `auth.uid() = user_id`

Even if a malicious user inspects network requests or alters URL params, Supabase PostgreSQL automatically rejects access to records where `user_id != auth.uid()`.
