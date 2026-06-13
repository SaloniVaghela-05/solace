'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated successfully! 🌻')
      router.push('/dashboard')
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
            Reset password
          </h2>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
            <div className="relative">
              <input 
                className="input pr-10" 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                placeholder="Min. 6 characters" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2" 
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
            <input 
              className="input" 
              type={showPassword ? 'text' : 'password'} 
              required 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Re-enter password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary w-full justify-center py-3" 
            style={{ borderRadius: '12px', fontSize: '0.9rem' }}
          >
            {loading ? 'Updating…' : 'Save Password ☀️'}
          </button>
        </form>
      </div>
    </div>
  )
}
