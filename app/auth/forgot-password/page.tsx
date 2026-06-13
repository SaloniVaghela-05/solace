'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      })
      if (error) throw error
      toast.success('Password reset email sent! 🌻')
      setSubmitted(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-sm animate-in">
        <div className="flex items-center gap-2.5 mb-8">
          <span className="text-xl">🌻</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            Solace
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            Forgot password?
          </h2>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Enter your email address and we'll send you a recovery link.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                className="input" 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full justify-center py-3" 
              style={{ borderRadius: '12px', fontSize: '0.9rem' }}
            >
              {loading ? 'Sending link…' : 'Send reset link ✉️'}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl border mb-6 text-center" style={{ background: 'var(--surface-2)', borderColor: 'var(--border-light)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Check your inbox!</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We've sent a password reset link to <strong className="break-all">{email}</strong>. Please click the link to reset your password.
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Remember your password?{' '}
          <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
