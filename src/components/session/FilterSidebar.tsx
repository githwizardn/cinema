import { useEffect } from 'react'
import { useFilterOptions } from '../../hooks/useFilterOptions'
import { useUrlFilters } from '../../hooks/useUrlFilters'

function Checkbox({
  checked,
  onChange,
  label,
  sublabel,
}: {
  checked: boolean
  onChange: () => void
  label: string
  sublabel?: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-start gap-3 py-1.5 w-full text-left group"
    >
      <span
        className={`mt-0.5 w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors ${
          checked
            ? 'bg-primary border-primary'
            : 'bg-transparent border-bg-elevated group-hover:border-txt-secondary'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-body-sm text-txt-primary font-semibold truncate">
          {label}
        </span>
        {sublabel && (
          <span className="block text-body-sm text-txt-muted">{sublabel}</span>
        )}
      </span>
    </button>
  )
}

export function FilterSidebar() {
  const { data: filterOptions, isLoading } = useFilterOptions()
  const { filters, updateFilters, clearFilters, activeCount } = useUrlFilters()

  // ⚡ Dynamic format filter — only show formats the selected venues have
  const availableFormats =
    filters.venues.length > 0 && filterOptions
      ? filterOptions.formats.filter((f) =>
          filters.venues.some((slug) =>
            filterOptions.venues
              .find((v) => v.slug === slug)
              ?.formats.some((vf) => vf.slug === f.slug)
          )
        )
      : filterOptions?.formats ?? []

  // Auto-drop selected formats that are no longer valid when venues change
  useEffect(() => {
    if (!filterOptions) return
    if (filters.venues.length === 0) return
    const validSlugs = availableFormats.map((f) => f.slug)
    const invalid = filters.formats.filter((f) => !validSlugs.includes(f))
    if (invalid.length > 0) {
      updateFilters({ formats: filters.formats.filter((f) => validSlugs.includes(f)) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.venues.join(',')])

  if (isLoading || !filterOptions) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-24 bg-bg-surface rounded animate-pulse" />
            <div className="h-3 w-32 bg-bg-surface rounded animate-pulse" />
            <div className="h-3 w-28 bg-bg-surface rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const selectedDate = filters.date ?? days[0].toISOString().split('T')[0]

  const toggle = (key: 'venues' | 'formats' | 'languages' | 'bands', value: string) => {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateFilters({ [key]: next })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h3 font-extrabold text-txt-primary">Filters</h2>
      </div>

      {/* Date */}
      <div>
        <h3 className="text-badge font-bold text-txt-secondary uppercase tracking-widest mb-3">
          Date
        </h3>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {days.map((d) => {
            const iso = d.toISOString().split('T')[0]
            const isActive = iso === selectedDate
            const isToday = d.toDateString() === today.toDateString()
            return (
              <button
                key={iso}
                onClick={() => updateFilters({ date: iso })}
                className={`shrink-0 w-12 py-2 rounded-input text-center transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-bg-surface text-txt-secondary hover:text-txt-primary'
                }`}
                title={isToday ? 'Today' : undefined}
              >
                <div className="text-badge font-bold uppercase tracking-wider">
                  {d.toLocaleDateString('en-GB', { weekday: 'short' })}
                </div>
                <div className="text-body font-extrabold leading-none my-1">
                  {d.getDate()}
                </div>
                <div className="text-badge uppercase">
                  {d.toLocaleDateString('en-GB', { month: 'short' })}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Venue */}
      <div>
        <h3 className="text-badge font-bold text-txt-secondary uppercase tracking-widest mb-2">
          Venue
        </h3>
        <div className="space-y-0.5">
          {filterOptions.venues.map((venue) => (
            <Checkbox
              key={venue.slug}
              checked={filters.venues.includes(venue.slug)}
              onChange={() => toggle('venues', venue.slug)}
              label={venue.name}
              sublabel={venue.city}
            />
          ))}
        </div>
      </div>

      {/* Format */}
      {availableFormats.length > 0 && (
        <div>
          <h3 className="text-badge font-bold text-txt-secondary uppercase tracking-widest mb-2">
            Format
          </h3>
          <div className="space-y-0.5">
            {availableFormats.map((format) => (
              <Checkbox
                key={format.slug}
                checked={filters.formats.includes(format.slug)}
                onChange={() => toggle('formats', format.slug)}
                label={format.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Language */}
      <div>
        <h3 className="text-badge font-bold text-txt-secondary uppercase tracking-widest mb-2">
          Language
        </h3>
        <div className="space-y-0.5">
          {filterOptions.languages.map((lang) => (
            <Checkbox
              key={lang.slug}
              checked={filters.languages.includes(lang.slug)}
              onChange={() => toggle('languages', lang.slug)}
              label={lang.name}
            />
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <h3 className="text-badge font-bold text-txt-secondary uppercase tracking-widest mb-2">
          Time of Day
        </h3>
        <div className="space-y-0.5">
          {filterOptions.timeBands.map((band) => (
            <Checkbox
              key={band.id}
              checked={filters.bands.includes(band.id)}
              onChange={() => toggle('bands', band.id)}
              label={band.label}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-bg-elevated">
        <button
          type="button"
          onClick={clearFilters}
          disabled={activeCount === 0}
          className="w-full py-2.5 rounded-input border border-bg-elevated hover:border-txt-secondary text-txt-primary font-bold text-body-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear All Filters
        </button>
        <p className="text-body-sm text-txt-muted text-center mt-3">
          {activeCount} {activeCount === 1 ? 'filter' : 'filters'} active
        </p>
      </div>
    </div>
  )
}