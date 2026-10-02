import { useNavigate } from 'react-router-dom'
import type { Movie } from '../../api/types'

interface MovieCardProps {
  movie: Movie
  variant?: 'now-playing' | 'coming-soon'
}

export function MovieCard({ movie, variant = 'now-playing' }: MovieCardProps) {
  const isComingSoon = variant === 'coming-soon'
  const navigate = useNavigate()

  const goToMovie = () => {
    navigate(`/movies/${movie.slug}`)
  }

  return (
    <div
      onClick={goToMovie}
      className="group relative flex flex-col cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToMovie()
        }
      }}
    >
      {/* Poster */}
      <div className="relative aspect-2/3 rounded-card overflow-hidden bg-bg-surface">
        <img
          src={movie.posterUrl ?? ''}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Age rating badge — top left */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-bg-base/80 backdrop-blur-sm rounded text-badge font-bold text-txt-primary">
          {movie.ageRating.code}
        </div>

        {/* Coming Soon badge — top right */}
        {isComingSoon && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-primary rounded text-badge font-bold text-white">
            COMING SOON
          </div>
        )}
      </div>

      {/* Info below poster */}
      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-card font-extrabold text-txt-primary line-clamp-1 mb-1">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 text-body-sm text-txt-secondary mb-2">
          <span>{movie.ageRating.code}</span>
          <span className="text-txt-muted">·</span>
          <span>{movie.runtimeMinutes} min</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          {isComingSoon ? (
            <>
              <span className="text-body-sm text-txt-secondary">
                {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: POST /movies/{slug}/notify — interrupted action
                  navigate(`/movies/${movie.slug}`)
                }}
                className="px-3 py-1.5 border border-bg-elevated hover:border-txt-secondary rounded-input text-body-sm font-semibold text-txt-primary transition-colors flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Notify Me
              </button>
            </>
          ) : (
            <>
              <span className="text-body-sm text-txt-secondary">
                From <span className="text-txt-primary font-bold">₾{movie.fromPrice}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToMovie()
                }}
                className="px-3 py-1.5 bg-primary hover:bg-primary-hover rounded-input text-body-sm font-bold text-white transition-colors"
              >
                Buy Ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}