# ☀️ Solace

> **Curated for Clarity, Designed for Calm**
>
> Solace is a personal productivity web application that harmonizes task management, habit tracking, financial monitoring, and journaling into a single, beautiful workspace. Built with a focus on zen aesthetics, it helps users organize their daily lives, maintain consistent routines, and reflect on their progress without the clutter of multiple disconnected apps.
>
> 🚀 **Live Demo:** [solace.salonii.me](https://solace.salonii.me)

---

## ✨ Features

### 📂 Central Dashboard
*   **Productivity Pulse:** A centralized overview displaying today's tasks remaining, habit completion rates, current monthly balance, and active goals.
*   **Financial Hero:** A prominent card highlighting monthly cash flow (Income vs Expenses) with an interactive spending progression bar.
*   **Quick Actions:** Launch tasks, habits, expenses, or journals with a single click.

### ☑️ Task Management
*   **Prioritized Action Items:** Set tasks with High, Medium, or Low priority badges.
*   **Date Tracking:** Schedule due dates for tasks to ensure nothing slips through the cracks.
*   **Recurring Tasks:** Set up recurring routines with custom recurrence patterns.
*   **Visual States:** Soft animations on completion, and clean filters to view pending or completed tasks.

### 📈 Habit Tracking
*   **Streak-Building Routines:** Set and maintain positive habits with custom target frequencies.
*   **Progress Visualization:** Check off daily logs, with immediate feedback through progress rings and percentage completion indicators.

### 💰 Finance Tracking
*   **Comprehensive Cash Flow:** Track both recurring/one-time income and daily expenses.
*   **Indian Rupee (₹) Localization:** Localized formatting (`en-IN`) for clear financial monitoring.
*   **Transaction Logs:** List and categorize your expenses to review where your money goes.

### 🎯 Goals & Milestones
*   **Long-term Focus:** Outline life goals and tag them with target dates.
*   **Granular Milestones:** Break down large goals into smaller, sequential milestones that can be completed individually.

### 💳 Subscription Management
*   **Active Subscriptions:** Monitor recurring services (weekly, monthly, yearly).
*   **Cost Calculator:** Automatically normalizes all billing cycles to a single, consolidated monthly expense rate so you know exactly what your recurring costs are.

### 📖 Journal
*   **Daily Reflection:** A private space to jot down thoughts, ideas, and reflections to improve mindfulness.

### ✨ Insights Engine
*   **Data Analysis:** Analyzes your habits, tasks, and spending data.
*   **Actionable Advice:** Generates dynamic alerts (e.g., reminding you of overdue tasks, evaluating habit consistency, and identifying your top spending category of the month).

---

## 🛠️ Technical Stack

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Library:** [React 19](https://react.dev/)
*   **Database & Auth:** [Supabase](https://supabase.com/) with `@supabase/ssr`
*   **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) & Vanilla CSS variables
*   **UI Primitives:** [Radix UI](https://www.radix-ui.com/) (Dialog, Select, Tabs)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Charts:** [Recharts](https://recharts.org/)

---

## ⚙️ Project Setup & Installation

Follow these steps to run Solace locally:

### 1. Clone the Repository
```bash
git clone https://github.com/SaloniVaghela-05/solace.git
cd solace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase
Solace relies on Supabase for authentication and database services.

#### Step A: Database Schema Setup
You need to create the required tables in your Supabase project. If you are starting fresh, ensure your tables use the following schema. If you already created tables using the legacy camelCase columns, execute the migration script provided:
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Paste and run the SQL instructions in [supabase_column_fix.sql](./supabase_column_fix.sql). This ensures:
    *   Tables are created or renamed correctly (e.g., `user_profiles`, `tasks`, `habits`, `habit_logs`, `expenses`, `income`, `goals`, `goal_milestones`, `subscriptions`, `journal_entries`, `insights`).
    *   RLS (Row Level Security) policies are properly set up so users can only access their own records.
    *   A database trigger automatically creates an entry in `user_profiles` when a new user signs up.

#### Step B: Environment Variables
Create a `.env.local` file in the root of your directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-reference.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> 💡 You can find these keys in the Supabase Dashboard under **Settings → API**.

#### Step C: Disable Email Confirmation (Optional for Local Development)
To sign up and test user flows immediately without setting up an SMTP provider:
1. Go to **Supabase Dashboard → Authentication → Providers → Email**.
2. Toggle off **Confirm email**.

---

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 File Structure

```
solace/
├── app/                  # Next.js App Router Pages
│   ├── auth/             # Authentication pages (Login, Signup)
│   ├── dashboard/        # Main dashboard and sub-features
│   │   ├── tasks/        # Task management page
│   │   ├── habits/       # Habit tracking page
│   │   ├── finance/      # Income and expense page
│   │   ├── goals/        # Long-term goals and milestones page
│   │   ├── journal/      # Daily journaling entries page
│   │   ├── subscriptions/# Subscription monitoring page
│   │   └── insights/     # Data-driven suggestions page
│   ├── globals.css       # Global styles & design system tokens
│   └── layout.tsx        # Base root layout wrapper
├── components/           # Reusable UI components
│   └── Sidebar.tsx       # Sidebar navigation layout
├── lib/                  # Helper utilities and database clients
│   ├── utils.ts          # Formatting & utility functions
│   └── supabase/         # Supabase client-side and server-side setup
├── middleware.ts         # Session guard & authentication redirect logic
├── supabase_column_fix.sql # Database migration script
└── package.json          # Project details & dependency management
```

---

## 📄 License

This project is open-source and licensed under the **MIT License**.
