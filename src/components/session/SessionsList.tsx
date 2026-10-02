import { Link } from 'react-router-dom'
import { useSessions } from '../../hooks/useSessions'
import { useFilterOptions } from '../../hooks/useFilterOptions'
import { useUrlFilters } from '../../hooks/useUrlFilters'
import { SessionCard } from './SessionCard'
import { Pagination } from './Pagination'

export function SessionsList() {
  const { filters, updateFilters } = useUrlFilters()
  const { data: filterOptions } = useFilterOptions()

  const { data, isLoading, isError, error, refetch } = useSessions({
    venues: filters.venues,
    formats: filters.formats,
    languages: filters.languages,
    bands: filters.bands,
    date: filters.date ?? undefined,
    sort: filters.sort,
    page: filters.page,
  })

  const sorts = filterOptions?.sorts ?? []

  return (
    <div>
      {/* Header: sort dropdown + counter */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="text-body-sm text-txt-secondary">
          {isLoading
            ? 'Loading sessions...'
            : data
            ? `Showing ${data.meta.totalSessions} ${
                data.meta.totalSessions === 1 ? 'session' : 'sessions'
              }`
            : '—'}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-body-sm text-txt-muted hidden sm:block">
            Sort by:
          </label>
          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-bg-surface border border-bg-elevated rounded-input px-3 py-2 text-body-sm text-txt-primary focus:outline-none focus:border-primary cursor-pointer"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-16 bg-bg-surface rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-bg-surface rounded animate-pulse" />
                  <div className="h-3 w-24 bg-bg-surface rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-28 bg-bg-surface rounded-card animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center py-16 bg-bg-surface rounded-card border border-error/30">
          <p className="text-h3 font-bold text-error mb-2">
            Could not load sessions
          </p>
          <p className="text-body text-txt-secondary mb-6">
            {error?.message ?? 'Unknown error'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-input transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && data && data.data.length === 0 && (
        <div className="text-center py-16 bg-bg-surface rounded-card border border-bg-elevated">
          <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-h3 font-bold text-txt-primary mb-2">No sessions found</p>
          <p className="text-body text-txt-secondary">
            Try changing your filters or date.
          </p>
        </div>
      )}

      {/* Sessions grouped by film */}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="space-y-10">
            {data.data.map((group) => (
              <div key={group.movie.id}>
                {/* Movie header */}
                <div className="flex items-start gap-4 mb-4">
                  <Link
                    to={`/movies/${group.movie.slug}`}
                    className="w-12 shrink-0"
                  >
                    <div className="aspect-2/3 rounded-input overflow-hidden bg-bg-base">
                      <img
                        src={group.movie.posterUrl ?? ''}
                        alt={group.movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/movies/${group.movie.slug}`}
                      className="text-card font-extrabold text-txt-primary hover:text-primary transition-colors truncate block"
                    >
                      {group.movie.title}
                    </Link>
                    <div className="flex items-center gap-2 text-body-sm text-txt-secondary mt-1">
                      <span className="px-1.5 py-0.5 border border-txt-muted rounded text-badge">
                        {group.movie.ageRating.code}
                      </span>
                      <span>{group.movie.runtimeMinutes} min</span>
                    </div>
                  </div>
                </div>

                {/* Sessions grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {group.sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={data.meta.currentPage}
            lastPage={data.meta.lastPage}
            onPageChange={(p) => updateFilters({ page: p })}
          />
        </>
      )}
    </div>
  )
}