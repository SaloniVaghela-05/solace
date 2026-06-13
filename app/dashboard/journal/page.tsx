'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { JournalEntry } from '@/lib/types/database'
import PageHeader from '@/components/PageHeader'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const MOODS = [
  { emoji: '😄', label: 'Great', value: 'great' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😔', label: 'Bad', value: 'bad' },
  { emoji: '😢', label: 'Awful', value: 'awful' },
] as const

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: 'good',
    entry_date: new Date().toISOString().split('T')[0],
  })
  const supabase = createClient()

  const fetchEntries = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (error) {
      toast.error('Could not load entries')
      setLoading(false)
      return
    }

    setEntries(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const addEntry = async () => {
    if (!form.content.trim()) { toast.error('Write something!'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please sign in again'); return }

    const { error } = await supabase.from('journal_entries').insert({ ...form, user_id: user.id })
    if (error) { toast.error('Failed to save'); return }

    toast.success('Entry saved 📔')
    setShowAdd(false)
    setForm({ title: '', content: '', mood: 'good', entry_date: new Date().toISOString().split('T')[0] })
    fetchEntries()
  }

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id)
    if (error) {
      toast.error('Could not delete entry')
      return
    }
    toast.success('Entry deleted')
    if (selectedEntry?.id === id) setSelectedEntry(null)
    fetchEntries()
  }

  const getMoodEmoji = (mood: string) => MOODS.find(m => m.value === mood)?.emoji || '🙂'

  const entryCountLabel = entries.length === 1 ? '1 entry' : `${entries.length} entries`

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Journal"
        subtitle={entryCountLabel}
        actions={
          <button type="button" onClick={() => { setShowAdd(true); setSelectedEntry(null) }} className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Entry
          </button>
        }
      />

      {showAdd && (
        <div className="glass-card p-5 animate-in">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <div className="space-y-3">
            <input className="input" placeholder="Title (optional)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm shrink-0" style={{ color: 'var(--text-secondary)' }}>Mood:</span>
              <div className="flex gap-2">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm({ ...form, mood: m.value })}
                    className="text-xl transition-all rounded-lg p-1"
                    style={{
                      opacity: form.mood === m.value ? 1 : 0.4,
                      transform: form.mood === m.value ? 'scale(1.2)' : 'scale(1)',
                      background: form.mood === m.value ? 'var(--accent-light)' : 'transparent',
                    }}
                    title={m.label}
                    aria-label={m.label}
                    aria-pressed={form.mood === m.value}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
              <input className="input ml-auto w-full sm:w-auto" type="date" value={form.entry_date} onChange={e => setForm({ ...form, entry_date: e.target.value })} />
            </div>
            <textarea
              className="input resize-none"
              placeholder="Write your thoughts… What happened today? How are you feeling? What are you grateful for?"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={6}
              autoFocus
            />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={addEntry} className="btn btn-primary">Save Entry</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedEntry ? (
        <div className="glass-card p-5 animate-in">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{getMoodEmoji(selectedEntry.mood)}</span>
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{selectedEntry.title || 'Journal Entry'}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(selectedEntry.entry_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => deleteEntry(selectedEntry.id)} className="btn btn-ghost text-danger" aria-label="Delete entry">
                <Trash2 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setSelectedEntry(null)} className="btn btn-ghost">← Back</button>
            </div>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{selectedEntry.content}</p>
        </div>
      ) : (
        <div className="space-y-3 animate-in stagger-2">
          {loading ? (
            <div className="glass-card text-center py-12">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading entries…</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="glass-card text-center py-12">
              <p className="text-2xl mb-2">📔</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>No journal entries yet</p>
              <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>Start writing your thoughts</p>
              <button type="button" onClick={() => setShowAdd(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" /> Write First Entry
              </button>
            </div>
          ) : entries.map((entry) => (
            <div
              key={entry.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedEntry(entry)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEntry(entry) } }}
              className="glass-card w-full text-left hover:shadow-md transition-shadow group cursor-pointer p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xl shrink-0 mt-0.5">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {entry.title || new Date(entry.entry_date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{entry.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.entry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <button
                    type="button"
                    aria-label="Delete entry"
                    onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all text-danger hover:bg-danger-soft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
