import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Movie } from '../../api/types'

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()

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

  const goToMovie = () => {
    navigate(`/movies/${movie.slug}`)
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '620px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 🎯 Backdrop — clickable */}
      <div
        onClick={goToMovie}
        className="absolute inset-0 cursor-pointer"
      >
        <img
          src={movie.backdropUrl ?? ''}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(7,12,28,1) 0%, rgba(7,12,28,0.95) 25%, rgba(7,12,28,0.7) 55%, rgba(7,12,28,0.3) 100%)',
          }}
        />
      </div>

      {/* 🎯 Content — clickable */}
      <div
        onClick={goToMovie}
        className="relative h-full max-w-[1600px] mx-auto px-8 flex flex-col justify-center cursor-pointer"
      >
        <div className="max-w-xl">
          <div className="mb-4">
            <span className="text-xs font-bold tracking-widest" style={{ color: '#EC3013' }}>
              PREMIERE · WEEK 02 · 15 SEPT
            </span>
          </div>

          <h1 className="text-6xl font-black text-white mb-4 leading-tight">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 mb-6 text-sm" style={{ color: '#A9A9A9' }}>
            <span className="px-2 py-0.5 border rounded text-xs" style={{ borderColor: '#505261' }}>
              {movie.ageRating.code}
            </span>
            <span>{movie.runtimeMinutes} Min</span>
            <span style={{ color: '#505261' }}>•</span>
            <span>{movie.formats.map((f) => f.name).join(' · ')}</span>
          </div>

          <p className="text-sm mb-8 line-clamp-3" style={{ color: '#A9A9A9' }}>
            Watch this amazing film at Kino XII — a brand new cinema experience with the latest
            sound and picture technology.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToMovie()
              }}
              className="px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: '#EC3013', color: '#FFFFFF' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Buy Tickets
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/sessions')
              }}
              className="px-6 py-3 rounded-lg font-bold transition-colors hover:opacity-90"
              style={{ backgroundColor: '#FFFFFF', color: '#070C1C' }}
            >
              All Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Progress + arrows */}
      <div
        className="absolute bottom-8 left-8 right-8 max-w-[1600px] mx-auto flex items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-1 h-0.5 rounded-full overflow-hidden relative cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {i === current && (
                <div
                  className="absolute inset-0 animate-[progress_6s_linear]"
                  style={{ backgroundColor: '#EC3013' }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:opacity-80 cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors hover:opacity-80 cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
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