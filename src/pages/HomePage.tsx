import { useFeatured, useNowPlaying, useComingSoon } from '../hooks/useMovies'
import { HeroCarousel } from '../components/movie/HeroCarousel'

export function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeatured()
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlaying(6)
  const { data: comingSoon, isLoading: comingSoonLoading } = useComingSoon(4)

  return (
    <div>
      {featuredLoading && (
        <div className="w-full h-[620px] bg-bg-surface animate-pulse" />
      )}
      {featured && <HeroCarousel movies={featured} />}

      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 font-extrabold text-txt-primary">NOW PLAYING</h2>
          <a href="/sessions" className="text-body-sm text-txt-secondary hover:text-txt-primary transition-colors">
            See All →
          </a>
        </div>

        {nowPlayingLoading ? (
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-bg-surface rounded-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {nowPlaying?.map((movie) => (
              <div key={movie.id} className="aspect-[2/3] bg-bg-surface rounded-card overflow-hidden">
                <img
                  src={movie.posterUrl ?? ''}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <h2 className="text-h2 font-extrabold text-txt-primary mb-6">COMING SOON</h2>

        {comingSoonLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-bg-surface rounded-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {comingSoon?.map((movie) => (
              <div key={movie.id} className="aspect-[2/3] bg-bg-surface rounded-card overflow-hidden">
                <img
                  src={movie.posterUrl ?? ''}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}