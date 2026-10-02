import { Link } from 'react-router-dom'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'

export function RecentlyViewed() {
  const items = useRecentlyViewed()

  // Hide section entirely if nothing viewed yet
  if (items.length === 0) return null

  return (
    <section className="max-w-[1600px] mx-auto px-8 pt-12">
      <h2 className="text-h2 font-extrabold text-txt-primary mb-6">
        RECENTLY VIEWED
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
        {items.map((movie) => (
          <Link
            key={movie.slug}
            to={`/movies/${movie.slug}`}
            className="group flex items-center gap-3 shrink-0 bg-bg-surface hover:bg-bg-elevated border border-bg-elevated rounded-card p-2 pr-5 transition-colors w-64"
          >
            <div className="w-12 shrink-0">
              <div className="aspect-2/3 rounded overflow-hidden bg-bg-base">
                <img
                  src={movie.posterUrl ?? ''}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-bold text-txt-primary truncate">
                {movie.title}
              </p>
              <p className="text-body-sm text-txt-muted mt-0.5">
                {movie.ageRating.code} · {movie.runtimeMinutes} min
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}