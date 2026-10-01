import { useFeatured, useNowPlaying, useComingSoon } from '../hooks/useMovies'
import { HeroCarousel } from '../components/movie/HeroCarousel'
import { MovieCard } from '../components/movie/MovieCard'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeatured()
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlaying(6)
  const { data: comingSoon, isLoading: comingSoonLoading } = useComingSoon(4)

  return (
    <div>
      {featuredLoading && (
        <div className="w-full h-155 bg-bg-surface animate-pulse" />
      )}
      {featured && <HeroCarousel movies={featured} />}

      {/* Now Playing */}
      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 font-extrabold text-txt-primary">NOW PLAYING</h2>
          <Link
            to="/sessions"
            className="text-body-sm text-txt-secondary hover:text-txt-primary transition-colors"
          >
            See All →
          </Link>
        </div>

        {nowPlayingLoading ? (
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-2/3 bg-bg-surface rounded-card animate-pulse" />
                <div className="h-4 bg-bg-surface rounded animate-pulse" />
                <div className="h-3 bg-bg-surface rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {nowPlaying?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="now-playing" />
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <h2 className="text-h2 font-extrabold text-txt-primary mb-6">COMING SOON</h2>

        {comingSoonLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-2/3 bg-bg-surface rounded-card animate-pulse" />
                <div className="h-4 bg-bg-surface rounded animate-pulse" />
                <div className="h-3 bg-bg-surface rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {comingSoon?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="coming-soon" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}