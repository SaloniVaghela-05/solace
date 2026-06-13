
# ☀️ Solace

> **Your data, your rhythm, your peace.**
>
> Solace is an all-in-one personal productivity platform that brings task management, habit tracking, budget monitoring, and journaling into a single, beautiful workspace. Built with a clean, zen aesthetic, it eliminates the need for multiple disconnected apps by providing one central place to organize your daily routines, track life goals, and reflect on personal growth.

🚀 **Live Website:** [solace.salonii.me](https://solace.salonii.me)

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

## ✨ Core Feature Design

### 📂 Central Dashboard & Insights
The main screen pulls summary data from all your tasks, habits, and financial entries to give you a quick snapshot of your day. An insights calculator runs through this data to show helpful alerts, like warning you about overdue tasks or pointing out your top expense category.

### ☑️ Smooth Task & Habit Tracking
When you check off a task or habit, the interface updates instantly without making you wait for a slow page reload. Progress rings update live as you complete your goals for the day.

### 💰 Finance & Subscriptions
All money values are formatted to the Indian Rupee (`en-IN`) standard. If you add subscriptions with different billing cycles (like weekly or yearly), the app automatically calculates exactly how much they cost you on a normalized monthly basis.

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
