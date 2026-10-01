import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()
  const isSessions = location.pathname.startsWith('/sessions')

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface border-b border-bg-elevated">
      <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center gap-8">
        {/* ლოგო */}
        <Link to="/" className="flex items-center gap-1 text-xl font-extrabold shrink-0">
          <span className="text-txt-primary">KINO</span>
          <span className="text-primary">XII</span>
        </Link>

        {/* Sessions ბმული */}
        <Link
          to="/sessions"
          className={`text-xs font-semibold tracking-wider transition-colors shrink-0 ${
            isSessions ? 'text-primary' : 'text-txt-secondary hover:text-txt-primary'
          }`}
        >
          SESSIONS
        </Link>

        {/* Search bar — ცენტრში */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search films and live events"
              className="w-full bg-bg-base border border-bg-elevated rounded-full pl-11 pr-4 py-2.5 text-sm text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Auth ღილაკები — guest state */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-colors">
            Sign Up
          </button>
          <button className="px-5 py-2 bg-white hover:bg-gray-200 text-bg-base text-xs font-bold rounded-full transition-colors">
            Log In
          </button>
        </div>
      </div>
    </nav>
  )
}