import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMovie, useMovieSessions } from '../hooks/useMovies'
import { useAuthStore, useAuthModal, usePendingAction } from '../features/auth/authStore'
import { useBookingStore } from '../features/booking/bookingStore'
import { useNotify } from '../hooks/useNotify'
import { addRecentlyViewed } from '../hooks/useRecentlyViewed'
import type { MovieSessionsGroup } from '../api/catalogue'

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated, user } = useAuthStore()
  const { openLogin } = useAuthModal()
  const { setPendingAction } = usePendingAction()
  const { open } = useBookingStore()
  const notifyMutation = useNotify()
  const [userSelectedDate, setUserSelectedDate] = useState<string | null>(null)

  const { data: movie, isLoading: movieLoading, isError: movieError } = useMovie(slug!)

  // 🎯 Derived state — no effect needed
  const selectedDate = userSelectedDate ?? movie?.availableDates[0] ?? null

  const { data: sessionGroups, isLoading: sessionsLoading } = useMovieSessions(
    slug!,
    selectedDate ?? undefined
  )

  // Track as recently viewed
  useEffect(() => {
    if (movie) {
      addRecentlyViewed(movie)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.slug])

  if (movieLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <div className="w-full h-96 bg-bg-surface rounded-card animate-pulse" />
      </div>
    )
  }

  if (movieError || !movie) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12 text-center">
        <p className="text-error text-h3 font-bold mb-4">Movie not found</p>
        <Link to="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    )
  }

  // 🔞 Age restriction
  const isAgeRestricted =
    isAuthenticated &&
    user?.age !== null &&
    user?.age !== undefined &&
    user.age < movie.ageRating.minAge

  const handleSessionClick = (sessionId: number) => {
    if (!isAuthenticated) {
      setPendingAction(() => () => open(sessionId))
      openLogin()
      return
    }
    if (isAgeRestricted) return
    open(sessionId)
  }

  const handleNotify = () => {
    if (!isAuthenticated) {
      setPendingAction(() => () => notifyMutation.mutate(movie.slug))
      openLogin()
      return
    }
    notifyMutation.mutate(movie.slug)
  }

  // Date picker — first 7 days
  const dates = movie.availableDates.slice(0, 7)

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative w-full h-100 overflow-hidden">
        <img
          src={movie.backdropUrl ?? ''}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg-base via-bg-base/70 to-bg-base/40" />
      </div>

      {/* Movie info — overlapping poster */}
      <div className="max-w-[1600px] mx-auto px-8 -mt-48 relative">
        <div className="flex gap-8">
          {/* Poster */}
          <div className="w-64 shrink-0">
            <div className="aspect-2/3 rounded-card overflow-hidden border-4 border-bg-base bg-bg-surface">
              <img
                src={movie.posterUrl ?? ''}
                alt={movie.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-40">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 border border-txt-muted rounded text-badge font-bold text-txt-primary">
                {movie.ageRating.code}
              </span>
              <span className="text-body-sm text-txt-secondary">
                {movie.runtimeMinutes} min
              </span>
              <span className="text-txt-muted">•</span>
              <span className="text-body-sm text-txt-secondary">
                {movie.genres.map((g) => g.name).join(', ')}
              </span>
            </div>

            <h1 className="text-hero font-extrabold text-txt-primary mb-4">
              {movie.title}
            </h1>

            <p className="text-body text-txt-secondary mb-6 max-w-2xl">
              {movie.synopsis}
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 max-w-2xl">
              {movie.director && (
                <div>
                  <span className="text-body-sm text-txt-muted">Director: </span>
                  <span className="text-body-sm text-txt-primary">{movie.director}</span>
                </div>
              )}
              {movie.cast && (
                <div>
                  <span className="text-body-sm text-txt-muted">Cast: </span>
                  <span className="text-body-sm text-txt-primary">{movie.cast}</span>
                </div>
              )}
              <div>
                <span className="text-body-sm text-txt-muted">Release: </span>
                <span className="text-body-sm text-txt-primary">
                  {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-body-sm text-txt-muted">Formats: </span>
                <span className="text-body-sm text-txt-primary">
                  {movie.formats.map((f) => f.name).join(' · ')}
                </span>
              </div>
            </div>

            {/* Age rating description tooltip */}
            <div className="px-3 py-2 rounded-input bg-bg-surface border border-bg-elevated max-w-2xl">
              <p className="text-body-sm text-txt-secondary">
                <span className="text-txt-primary font-semibold">{movie.ageRating.code}:</span>{' '}
                {movie.ageRating.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions section */}
      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <h2 className="text-h2 font-extrabold text-txt-primary mb-6">
          {movie.isComingSoon ? 'Coming Soon' : 'Sessions'}
        </h2>

        {/* Coming Soon — Notify Me */}
        {movie.isComingSoon ? (
          <div className="text-center py-16 bg-bg-surface rounded-card border border-bg-elevated max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-h3 font-bold text-txt-primary mb-2">
              Not yet in cinemas
            </p>
            <p className="text-body text-txt-secondary mb-6">
              Releases {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <button
              type="button"
              onClick={handleNotify}
              disabled={notifyMutation.isPending}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-input transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {notifyMutation.isPending ? 'Subscribing...' : 'Notify Me'}
            </button>
          </div>
        ) : (
          <>
            {/* Age restriction banner */}
            {isAgeRestricted && (
              <div className="px-4 py-3 rounded-input bg-error-tint border border-error mb-6">
                <p className="text-body-sm text-error">
                  This film is rated {movie.ageRating.code}. You cannot buy tickets for it with this
                  account.
                </p>
              </div>
            )}

            {/* Date picker */}
            {dates.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                {dates.map((date) => {
                  const d = new Date(date)
                  const isActive = date === selectedDate
                  return (
                    <button
                      key={date}
                      onClick={() => setUserSelectedDate(date)}
                      className={`shrink-0 px-5 py-3 rounded-input border text-center transition-colors ${
                        isActive
                          ? 'bg-primary border-primary text-white'
                          : 'bg-bg-surface border-bg-elevated text-txt-secondary hover:border-txt-secondary'
                      }`}
                    >
                      <div className="text-badge font-bold uppercase tracking-widest">
                        {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </div>
                      <div className="text-h3 font-extrabold mt-1">{d.getDate()}</div>
                      <div className="text-body-sm">
                        {d.toLocaleDateString('en-GB', { month: 'short' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-body text-txt-secondary mb-8">
                No sessions scheduled for this film.
              </p>
            )}

            {/* Sessions grouped by venue */}
            {sessionsLoading ? (
              <div className="space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-6 w-48 bg-bg-surface rounded animate-pulse mb-4" />
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="h-24 bg-bg-surface rounded-card animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : sessionGroups && sessionGroups.length > 0 ? (
              <div className="space-y-8">
                {sessionGroups.map((group: MovieSessionsGroup) => (
                  <div key={group.venue.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-h3 font-extrabold text-txt-primary">
                        {group.venue.name}
                      </h3>
                      <span className="text-body-sm text-txt-secondary">{group.venue.city}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {group.sessions.map((session) => {
                        const disabled = session.isSoldOut || isAgeRestricted
                        return (
                          <button
                            key={session.id}
                            onClick={() => handleSessionClick(session.id)}
                            disabled={disabled}
                            className={`p-4 rounded-card border text-left transition-colors ${
                              disabled
                                ? 'bg-bg-surface border-bg-elevated opacity-50 cursor-not-allowed'
                                : 'bg-bg-surface border-bg-elevated hover:border-primary'
                            }`}
                          >
                            <div className="text-h3 font-extrabold text-txt-primary mb-2">
                              {session.time}
                            </div>
                            <div className="text-body-sm text-txt-secondary mb-1">
                              {session.format.name} · {session.language.name}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-body-sm font-bold text-txt-primary">
                                ₾{session.price}
                              </span>
                              <span className="text-body-sm text-txt-muted">
                                {session.isSoldOut ? 'Sold out' : `${session.seatsLeft} seats`}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-bg-surface rounded-card border border-bg-elevated">
                <p className="text-h3 font-bold text-txt-primary mb-2">No sessions</p>
                <p className="text-body text-txt-secondary">
                  No sessions available for this date.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}