'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Habit, HabitLog } from '@/lib/types/database'
import PageHeader from '@/components/PageHeader'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const HABIT_EMOJIS = ['🧘', '📚', '💧', '🏃', '🌱', '✍️', '🎵', '🛏️', '🥗', '☀️']
const RING_C = 125.6
const HABIT_RING_C = 100.5

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [toggling, setToggling] = useState<Set<string>>(new Set())
  const [form, setForm] = useState({ name: '', description: '', frequency: 'daily', target_count: 1 })
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const fetchHabits = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const [{ data: habitsData, error: habitsError }, { data: logs, error: logsError }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at'),
      supabase.from('habit_logs').select('habit_id').eq('user_id', user.id).eq('completed_date', today),
    ])

    if (habitsError || logsError) {
      toast.error('Could not load habits')
      setLoading(false)
      return
    }

    const completedIds = new Set((logs || []).map((l: HabitLog) => l.habit_id))
    setHabits((habitsData || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      description: h.description,
      frequency: h.target_frequency || 'daily',
      target_count: 1,
      streak: 0,
      completedToday: completedIds.has(h.id)
    })))
    setLoading(false)
  }, [supabase, today])

  useEffect(() => { fetchHabits() }, [fetchHabits])

  const toggleHabit = async (habit: Habit) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setToggling(prev => new Set([...prev, habit.id]))

    const { error } = habit.completedToday
      ? await supabase.from('habit_logs').delete()
          .eq('habit_id', habit.id).eq('user_id', user.id).eq('completed_date', today)
      : await supabase.from('habit_logs').insert({ habit_id: habit.id, user_id: user.id, completed_date: today })

    if (error) {
      toast.error('Could not update habit')
    } else if (!habit.completedToday) {
      toast.success('Habit tended 🌱')
    }

    setTimeout(() => {
      setToggling(prev => { const n = new Set(prev); n.delete(habit.id); return n })
      fetchHabits()
    }, 400)
  }

  const addHabit = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in again'); return }

    const { error } = await supabase.from('habits').insert({
      name: form.name,
      description: form.description,
      target_frequency: form.frequency,
      user_id: user.id,
      is_active: true,
    })

    if (error) {
      toast.error('Could not create habit')
      return
    }

    toast.success('New habit planted 🌿')
    setShowAdd(false)
    setForm({ name: '', description: '', frequency: 'daily', target_count: 1 })
    fetchHabits()
  }

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').update({ is_active: false }).eq('id', id)
    if (error) {
      toast.error('Could not remove habit')
      return
    }
    toast.success('Habit removed')
    fetchHabits()
  }

  const doneTodayCount = habits.filter(h => h.completedToday).length
  const totalCount = habits.length
  const pct = totalCount > 0 ? Math.round((doneTodayCount / totalCount) * 100) : 0
  const summaryOffset = RING_C - (pct / 100) * RING_C

  return (
    <div className="space-y-7 pb-8">
      <PageHeader title="Habits" quote="One step at a time.">
        <div className="summary-card mt-5 p-4 flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--accent)' }}>
              Today&apos;s Focus
            </p>
            <p className="text-lg font-medium mt-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {doneTodayCount} of {totalCount} Completed
            </p>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
              <circle cx="24" cy="24" r="20" fill="transparent" stroke="var(--border)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20" fill="transparent"
                stroke="var(--accent)" strokeWidth="4"
                strokeDasharray={RING_C}
                strokeDashoffset={summaryOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
              />
            </svg>
            <span className="absolute text-[9px] font-bold" style={{ color: 'var(--accent)' }}>{pct}%</span>
          </div>
        </div>
      </PageHeader>

      <section className="space-y-3 animate-in stagger-2">
        {loading && (
          <div className="glass-card text-center py-10">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your habits…</p>
          </div>
        )}

        {!loading && habits.length === 0 && (
          <div className="glass-card p-10 text-center">
            <p className="text-3xl mb-3">🌱</p>
            <p className="font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              No habits planted yet
            </p>
            <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>
              Start small — even one habit changes everything
            </p>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Plant First Habit
            </button>
          </div>
        )}

        {habits.map((habit, i) => {
          const emoji = HABIT_EMOJIS[i % HABIT_EMOJIS.length]
          const done = habit.completedToday
          const isToggling = toggling.has(habit.id)
          const habitOffset = done ? 0 : HABIT_RING_C

          return (
            <div
              key={habit.id}
              role="button"
              tabIndex={0}
              className="group flex items-center justify-between p-4 cursor-pointer transition-all duration-200"
              style={{
                background: done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(6px)',
                borderRadius: 'var(--radius-lg)',
                border: done ? '1px solid var(--accent-warm)' : '1px solid rgba(255,255,255,0.90)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={() => !isToggling && toggleHabit(habit)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !isToggling && toggleHabit(habit) } }}
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
                  <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                    <circle cx="22" cy="22" r="16" fill="transparent" stroke="var(--border)" strokeWidth="3" />
                    <circle
                      cx="22" cy="22" r="16" fill="transparent"
                      stroke="var(--accent)" strokeWidth="3"
                      strokeDasharray={HABIT_RING_C}
                      strokeDashoffset={isToggling ? HABIT_RING_C / 2 : habitOffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {done
                      ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--accent-light)', animation: isToggling ? 'popSuccess 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' : 'none' }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" aria-hidden>
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      )
                      : <span className="text-sm">{emoji}</span>}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>
                    {habit.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {habit.description || habit.frequency}
                    {habit.streak > 0 && ` • 🔥 ${habit.streak} day streak`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {done && (
                  <svg className="w-5 h-5" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" aria-hidden>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${habit.name}`}
                  onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all text-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      {showAdd && (
        <div className="glass-card p-5 animate-in">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Plant a New Habit
          </h3>
          <div className="space-y-3">
            <input className="input" placeholder="Habit name *" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
            <input className="input" placeholder="Description (optional)" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <select className="input" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={addHabit} className="btn btn-primary">Plant Habit 🌱</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {!showAdd && habits.length > 0 && (
        <div className="flex justify-center pt-2 animate-in stagger-4">
          <button type="button" onClick={() => setShowAdd(true)} className="btn btn-primary px-8 py-4 rounded-2xl text-base">
            <Plus className="w-5 h-5" />
            Add New Habit
          </button>
        </div>
      )}
    </div>
  )
}
