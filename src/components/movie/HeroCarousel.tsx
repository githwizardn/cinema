import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Movie } from '../../api/types'

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || movies.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, movies.length])

  if (movies.length === 0) return null

  const movie = movies[current]
  const prev = () => setCurrent((c) => (c - 1 + movies.length) % movies.length)
  const next = () => setCurrent((c) => (c + 1) % movies.length)

  return (
    <div
      className="relative w-full h-[620px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl ?? ''}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-[1600px] mx-auto px-8 flex flex-col justify-center">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4 text-xs font-semibold tracking-wider">
            <span className="text-primary">PREMIERE · WEEK 02 · 15 SEPT</span>
          </div>

          <h1 className="text-6xl font-black text-txt-primary mb-4 leading-tight">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 mb-6 text-body-sm text-txt-secondary">
            <span className="px-2 py-0.5 border border-txt-muted rounded">
              {movie.ageRating.code}
            </span>
            <span>{movie.runtimeMinutes} Min</span>
            <span className="text-txt-muted">•</span>
            <span>{movie.formats.map((f) => f.name).join(' · ')}</span>
          </div>

          <p className="text-body text-txt-secondary mb-8 line-clamp-3">
            A king spends ten years fighting a war he already won, while monsters, gods and his
            own restlessness make sure the return takes longer than the going.
          </p>

          <div className="flex items-center gap-3">
            <Link
              to={`/movies/${movie.slug}`}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-btn font-bold rounded-input transition-colors inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Buy Tickets
            </Link>
            <Link
              to="/sessions"
              className="px-6 py-3 bg-white hover:bg-gray-200 text-bg-base text-btn font-bold rounded-input transition-colors"
            >
              All Sessions
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 max-w-[1600px] mx-auto flex items-center gap-6">
        <div className="flex-1 flex gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-1 h-0.5 bg-txt-muted/30 rounded-full overflow-hidden relative"
            >
              {i === current && (
                <div className="absolute inset-0 bg-primary animate-[progress_6s_linear]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-bg-surface hover:bg-bg-elevated flex items-center justify-center text-txt-primary transition-colors"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-bg-surface hover:bg-bg-elevated flex items-center justify-center text-txt-primary transition-colors"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}