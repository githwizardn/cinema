import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore, useAuthModal } from '../../features/auth/authStore'
import { logout } from '../../api/auth'
import { SearchBar } from './SearchBar'

export function Navbar() {
  const location = useLocation()
  const isSessions = location.pathname.startsWith('/sessions')
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { openLogin, openRegister } = useAuthModal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore
    }
    clearAuth()
    setDropdownOpen(false)
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface border-b border-bg-elevated">
      <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-extrabold shrink-0">
          <span className="text-txt-primary">KINO</span>
          <span className="text-primary">XII</span>
        </Link>

        {/* Sessions link */}
        <Link
          to="/sessions"
          className={`text-xs font-semibold tracking-wider transition-colors shrink-0 ${
            isSessions ? 'text-primary' : 'text-txt-secondary hover:text-txt-primary'
          }`}
        >
          SESSIONS
        </Link>

        {/* Search bar — extracted component */}
        <SearchBar />

        {/* Auth state */}
        {isAuthenticated ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-bg-elevated transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="text-sm font-semibold text-txt-primary">
                {user?.fullName ?? user?.username}
              </span>
              {user && !user.profileComplete && (
                <span className="w-2 h-2 rounded-full bg-warning" title="Profile incomplete" />
              )}
              {user?.profileComplete && (
                <span className="w-2 h-2 rounded-full bg-success" title="Profile complete" />
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-txt-secondary">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface border border-bg-elevated rounded-card shadow-2xl overflow-hidden">
                {user && !user.profileComplete && (
                  <div className="px-4 py-3 border-b border-bg-elevated bg-warning/10">
                    <p className="text-xs font-bold text-warning mb-1">Profile Incomplete</p>
                    <p className="text-xs text-txt-secondary">
                      Please complete your profile to enable booking.
                    </p>
                  </div>
                )}
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-txt-primary hover:bg-bg-elevated transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Profile
                </Link>
                <Link
                  to="/profile?tab=upcoming"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-txt-primary hover:bg-bg-elevated transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4z" />
                  </svg>
                  My Tickets
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-bg-elevated transition-colors text-left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openRegister}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={openLogin}
              className="px-5 py-2 bg-white hover:bg-gray-200 text-bg-base text-xs font-bold rounded-full transition-colors"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}