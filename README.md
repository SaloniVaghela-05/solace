# ☀️ Solace

> **Curated for Clarity, Designed for Calm**
>
> Solace is a personal productivity web application that harmonizes task management, habit tracking, financial monitoring, and journaling into a single, beautiful workspace. Built with a focus on zen aesthetics, it helps users organize their daily lives, maintain consistent routines, and reflect on their progress without the clutter of multiple disconnected apps.
>
> 🚀 **Live Demo:** [solace.salonii.me](https://solace.salonii.me)

---

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

## 🏗️ How Solace is Structured

Solace is built as a fast, secure web application where the frontend user interface and the backend database communicate smoothly and securely in real time.

              ┌──────────────────────────────┐
              │      Next.js Frontend        │
              │   (User Interface & Pages)   │
              └──────────────┬───────────────┘
                             │
               Checks Login  │  Saves & Fetches
               Status        │  Data Safely
                             ▼
     ┌──────────────────────────────────────────────┐
     │               Supabase Backend               │
     │ ┌──────────────────┐  ┌────────────────────┐ │
     │ │ Secure User Logs │  │ PostgreSQL Database│ │
     │ │  & Auth System   │  │ (Private User Data)│ │
     │ └──────────────────┘  └────────────────────┘ │
     └──────────────────────────────────────────────┘


### 1. File & Folder Structure
The codebase is organized into clear, feature-based folders using the Next.js App Router format:


```

solace/
├── app/                  # Application Pages & Routes
│   ├── auth/             # Login and Signup pages
│   └── dashboard/        # Main app features (only accessible after logging in)
│       ├── tasks/        # Task creation, priority tags, and scheduling
│       ├── habits/       # Habit tracking checklists and progress rings
│       ├── finance/      # Income and expense tracking lists
│       ├── goals/        # Long-term goals and step-by-step milestones
│       ├── journal/      # Private daily thoughts and reflection log
│       ├── subscriptions/# Subscription tracking and cost math
│       └── insights/     # Automated stats, advice, and trends
│   ├── globals.css       # Global styling, fonts, and theme colors
│   └── layout.tsx        # Base layout shared across all pages
├── components/           # Reusable UI elements (like the navigation Sidebar)
├── lib/                  # Helper code and database setup
│   ├── utils.ts          # Math helpers, date, and currency formatters
│   └── supabase/         # Connections to the database and authentication links
└── middleware.ts         # Safety guard that redirects unlogged users to login page

```

### 2. Database Blueprint (PostgreSQL)
The database uses structured tables that link together securely. Every user only has access to their own rows:

* **`user_profiles`**: Stores basic user information, created automatically when someone signs up.
* **`tasks` & `habits`**: Keeps track of daily to-dos and recurring routines.
* **`habit_logs`**: Logs individual history days for habits to track streaks accurately.
* **`income` & `expenses`**: Financial tables that power the budget tracker.
* **`goals` & `goal_milestones`**: Links smaller milestones to a larger parent goal.
* **`subscriptions`**: Stores recurring bills to calculate monthly spending averages.

---

## 🛠️ The Tech Stack

* **Frontend Framework:** [Next.js](https://nextjs.org/) & [React 19](https://react.dev/) — For fast, smooth page transitions.
* **Backend & Security:** [Supabase](https://supabase.com/) — Handles user logins and database management.
* **Row Level Security (RLS):** Built-in database protection ensuring your personal notes, tasks, and budgets are strictly private to your account.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) — Keeps the interface clean, modern, and perfectly responsive on mobile devices.
* **UI Primitives:** [Radix UI](https://www.radix-ui.com/) — Powering accessible drop-downs, popups, and tabs.
* **Charts & Icons:** [Recharts](https://recharts.org/) and [Lucide React](https://lucide.dev/) — For data visuals and clean icons.

---

## 📄 Privacy & License

* **Security:** All data routes are protected by an automatic gatekeeper (`middleware.ts`). Only users with a valid login token can access application features or query the database.
* **License:** Distributed under the open-source **MIT License**.

```
