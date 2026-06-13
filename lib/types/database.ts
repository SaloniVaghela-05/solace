export interface Habit {
  id: string
  name: string
  description: string
  frequency: string
  target_count: number
  streak: number
  completedToday?: boolean
}

export interface HabitLog {
  habit_id: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  expense_date: string
  payment_method: string
  user_id: string
}

export interface Income {
  id: string
  amount: number
  source: string
  description: string
  income_date: string
  is_recurring: boolean
  user_id: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  entry_date: string
  user_id: string
}

export type Transaction = (Expense & { type: 'expense'; date: string }) | (Income & { type: 'income'; date: string })
