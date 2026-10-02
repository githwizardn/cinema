import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearch } from '../../hooks/useSearch'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: results, isLoading } = useSearch(query)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (slug: string) => {
    navigate(`/movies/${slug}`)
    setQuery('')
    setIsOpen(false)
  }

  const showEmpty = isOpen && query.trim().length === 0
  const showNoResults =
    isOpen && query.trim().length > 0 && !isLoading && results && results.length === 0
  const showResults = isOpen && query.trim().length > 0 && results && results.length > 0

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search films and live events"
          className="w-full bg-bg-base border border-bg-elevated rounded-full pl-11 pr-10 py-2.5 text-sm text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-primary transition-colors"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-primary transition-colors p-1"
            aria-label="Clear"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (showEmpty || showResults || showNoResults || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-bg-elevated rounded-modal shadow-2xl overflow-hidden z-50">
          {/* Empty state */}
          {showEmpty && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
                  <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-body-sm font-bold text-txt-primary mb-1">
                What do you want to watch?
              </p>
              <p className="text-body-sm text-txt-secondary mb-4">
                Search by title, director or cast
              </p>
              <Link
                to="/sessions"
                onClick={() => setIsOpen(false)}
                className="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-white text-body-sm font-bold rounded-full transition-colors"
              >
                Browse all sessions
              </Link>
            </div>
          )}

          {/* Loading */}
          {isLoading && query.trim().length > 0 && (
            <div className="p-3 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="w-10 h-14 bg-bg-base rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-bg-base rounded animate-pulse" />
                    <div className="h-2 w-20 bg-bg-base rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {showResults && !isLoading && (
            <div>
              <div className="px-4 py-3 border-b border-bg-elevated flex items-center justify-between">
                <span className="text-badge font-bold text-txt-muted uppercase tracking-widest">
                  Films & Events
                </span>
                <span className="text-badge text-txt-muted">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {results.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie.slug)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors text-left"
                  >
                    <div className="w-10 shrink-0">
                      <div className="aspect-2/3 rounded overflow-hidden bg-bg-base">
                        <img
                          src={movie.posterUrl ?? ''}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-txt-primary truncate">
                        {movie.title}
                      </p>
                      <p className="text-body-sm text-txt-muted">
                        Film · {movie.ageRating.code} · {movie.runtimeMinutes} min
                      </p>
                    </div>
                    <div className="text-body-sm text-txt-secondary shrink-0">
                      {movie.isComingSoon ? (
                        <span className="text-warning font-semibold">Coming Soon</span>
                      ) : (
                        <>
                          from <span className="text-txt-primary font-bold">₾{movie.fromPrice}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-body-sm font-bold text-txt-primary mb-1">
                No results for "{query}"
              </p>
              <p className="text-body-sm text-txt-secondary mb-4">
                Check the spelling or try another film or live event.
              </p>
              <Link
                to="/sessions"
                onClick={() => setIsOpen(false)}
                className="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-white text-body-sm font-bold rounded-full transition-colors"
              >
                Browse all sessions
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}