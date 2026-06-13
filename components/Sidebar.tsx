'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', emoji: '📂' },
  { href: '/dashboard/tasks', label: 'Tasks', emoji: '☑️' },
  { href: '/dashboard/habits', label: 'Habits', emoji: '📈' },
  { href: '/dashboard/finance', label: 'Finance', emoji: '💰' },
  { href: '/dashboard/goals', label: 'Goals', emoji: '🎯' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', emoji: '💳' },
  { href: '/dashboard/insights', label: 'Insights', emoji: '✨' },
  { href: '/dashboard/about', label: 'About', emoji: '👋' },
]

// Extracted inner content to avoid repeating it for both desktop and mobile views
function SidebarContent({ pathname, handleLogout, onLinkClick }: { pathname: string, handleLogout: () => void, onLinkClick?: () => void }) {
  return (
    <>
      {/* Brand */}
      <div
        className="px-5 py-5 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          ☀️
        </div>
        <div>
          <p
            className="text-sm font-bold leading-none"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Solace
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Curated for Clarity, Designed for Calm
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, emoji }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              )}
              style={
                isActive
                  ? {
                    background: 'var(--accent-light)',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    border: '1px solid var(--accent-warm)',
                  }
                  : {
                    color: 'var(--text-secondary)',
                    border: '1px solid transparent',
                  }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--surface-2)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <span className="text-base w-5 text-center">{emoji}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2 shrink-0 pt-2">
        <div
          className="px-3 py-3 rounded-xl italic text-xs leading-relaxed hidden sm:block"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-light)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
          }}
        >
          "Radiate like the morning sun."
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fae8e4'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = ''
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <span className="text-base text-center w-5">🚪</span>
          Sign out
        </button>
      </div>
    </>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('See you soon 🌅')
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      {/* 1. Mobile Header (Only visible on small screens) */}
      <header
        className="md:hidden flex items-center justify-between px-5 pl-4 py-3 sticky top-0 z-30 shrink-0"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            🌻
          </div>
          <p className="font-bold text-[15px] leading-none" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Solace
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg active:scale-95 transition-transform"
          style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 2. Mobile Overlay Menu (Slide in) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Sliding panel */}
          <aside
            className="w-[260px] h-full relative flex flex-col shadow-2xl animate-in slide-in-from-left-full duration-300"
            style={{
              background: 'var(--bg)',
              borderRight: '1px solid var(--border-light)'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full z-10 hover:bg-black/5 active:scale-95 transition-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>

            <SidebarContent
              pathname={pathname}
              handleLogout={handleLogout}
              onLinkClick={() => setIsOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* 3. Desktop Sidebar (Only visible on medium+ screens) */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 shrink-0"
        style={{
          width: '230px',
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid var(--border-light)',
        }}
      >
        <SidebarContent pathname={pathname} handleLogout={handleLogout} />
      </aside>
    </>
  )
}
