'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Expense, Income } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import toast from 'react-hot-toast'

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Bills', 'Other']
const INCOME_SOURCES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
const CHART_COLORS = ['#c67b5c', '#7a9e6e', '#c4924a', '#b85c5c', '#9a9e7a', '#a0b8c8', '#d4956a', '#9a8c82']

function parseAmount(value: string): number | null {
  const amount = parseFloat(value)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return amount
}

export default function FinancePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [showAdd, setShowAdd] = useState<'expense' | 'income' | null>(null)
  const [loading, setLoading] = useState(true)
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: '',
  })
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: 'Salary',
    description: '',
    income_date: new Date().toISOString().split('T')[0],
    is_recurring: false,
  })
  const supabase = createClient()

  const monthStart = new Date().toISOString().slice(0, 7) + '-01'

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const [{ data: e, error: expenseError }, { data: i, error: incomeError }] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', user.id).gte('expense_date', monthStart).order('expense_date', { ascending: false }),
      supabase.from('income').select('*').eq('user_id', user.id).gte('income_date', monthStart).order('income_date', { ascending: false }),
    ])

    if (expenseError || incomeError) {
      toast.error('Could not load finance data')
      setLoading(false)
      return
    }

    setExpenses(e || [])
    setIncome(i || [])
    setLoading(false)
  }, [supabase, monthStart])

  useEffect(() => { fetchData() }, [fetchData])

  const addExpense = async () => {
    const amount = parseAmount(expenseForm.amount)
    if (amount === null) { toast.error('Enter a valid amount'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in again'); return }

    const { error } = await supabase.from('expenses').insert({
      ...expenseForm,
      amount,
      user_id: user.id,
    })

    if (error) { toast.error('Failed to add expense'); return }

    toast.success('Expense added')
    setShowAdd(null)
    setExpenseForm({ amount: '', category: 'Food', description: '', expense_date: new Date().toISOString().split('T')[0], payment_method: '' })
    fetchData()
  }

  const addIncome = async () => {
    const amount = parseAmount(incomeForm.amount)
    if (amount === null) { toast.error('Enter a valid amount'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in again'); return }

    const { error } = await supabase.from('income').insert({
      ...incomeForm,
      amount,
      user_id: user.id,
    })

    if (error) { toast.error('Failed to add income'); return }

    toast.success('Income added')
    setShowAdd(null)
    setIncomeForm({ amount: '', source: 'Salary', description: '', income_date: new Date().toISOString().split('T')[0], is_recurring: false })
    fetchData()
  }

  const totalIncome = useMemo(() => income.reduce((s, i) => s + Number(i.amount), 0), [income])
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses])
  const balance = totalIncome - totalExpenses

  const categoryData = useMemo(
    () => Object.entries(
      expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
        return acc
      }, {})
    ).map(([name, value]) => ({ name, value })),
    [expenses]
  )

  const last7DaysData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const date = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      const dayExpense = expenses
        .filter(e => e.expense_date === date)
        .reduce((s, e) => s + Number(e.amount), 0)
      days.push({ date: label, amount: dayExpense })
    }
    return days
  }, [expenses])

  const transactions = useMemo(
    () => [
      ...expenses.map(e => ({ ...e, type: 'expense' as const, date: e.expense_date })),
      ...income.map(i => ({ ...i, type: 'income' as const, date: i.income_date })),
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20),
    [expenses, income]
  )

  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Finance"
        subtitle={monthLabel}
        actions={
          <>
            <button type="button" onClick={() => setShowAdd('income')} className="btn btn-ghost text-success" style={{ borderColor: 'var(--border)' }}>
              <TrendingUp className="w-4 h-4" /> Income
            </button>
            <button type="button" onClick={() => setShowAdd('expense')} className="btn btn-primary">
              <TrendingDown className="w-4 h-4" /> Expense
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in stagger-2">
        {[
          { label: 'Income', value: totalIncome, colorClass: 'text-success', bgClass: 'bg-success-soft', icon: TrendingUp },
          { label: 'Expenses', value: totalExpenses, colorClass: 'text-danger', bgClass: 'bg-danger-soft', icon: TrendingDown },
          { label: 'Balance', value: balance, colorClass: balance >= 0 ? 'text-success' : 'text-danger', bgClass: balance >= 0 ? 'bg-accent-soft' : 'bg-danger-soft', icon: DollarSign },
        ].map(({ label, value, colorClass, bgClass, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bgClass}`}>
                <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <p className={`text-xl font-bold ${colorClass}`} style={{ letterSpacing: '-0.02em' }}>
              {formatCurrency(Math.abs(value))}
            </p>
          </div>
        ))}
      </div>

      {showAdd === 'expense' && (
        <div className="glass-card p-5 animate-in">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Add Expense</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" type="number" min="0" step="0.01" placeholder="Amount (₹) *" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} autoFocus />
              <select className="input" value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Description" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} />
              <input className="input" type="date" value={expenseForm.expense_date} onChange={e => setExpenseForm({ ...expenseForm, expense_date: e.target.value })} />
            </div>
            <input className="input" placeholder="Payment method (UPI, Cash, Card…)" value={expenseForm.payment_method} onChange={e => setExpenseForm({ ...expenseForm, payment_method: e.target.value })} />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={addExpense} className="btn btn-primary">Save</button>
              <button type="button" onClick={() => setShowAdd(null)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAdd === 'income' && (
        <div className="glass-card p-5 animate-in">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Add Income</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" type="number" min="0" step="0.01" placeholder="Amount (₹) *" value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })} autoFocus />
              <select className="input" value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })}>
                {INCOME_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Description" value={incomeForm.description} onChange={e => setIncomeForm({ ...incomeForm, description: e.target.value })} />
              <input className="input" type="date" value={incomeForm.income_date} onChange={e => setIncomeForm({ ...incomeForm, income_date: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={addIncome} className="btn btn-primary">Save</button>
              <button type="button" onClick={() => setShowAdd(null)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 animate-in stagger-3">
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No expenses this month</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Daily Spend (Last 7 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7DaysData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip formatter={(v: number) => formatCurrency(Number(v))} />
              <Bar dataKey="amount" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card animate-in stagger-4">
        <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Transactions This Month</h3>
        {loading ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-2xl mb-2">💰</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No transactions this month</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Track income and expenses to see them here</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {transactions.map((t) => (
              <div key={`${t.type}-${t.id}`} className="flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${t.type === 'income' ? 'bg-success-soft' : 'bg-danger-soft'}`}>
                    {t.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {t.description || ('category' in t ? t.category : t.source)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {'category' in t && t.category && <span className="ml-1">· {t.category}</span>}
                      {'payment_method' in t && t.payment_method && <span className="ml-1">· {t.payment_method}</span>}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-semibold shrink-0 ml-3 ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
