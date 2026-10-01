import { useFilterOptions } from './hooks/useFilterOptions'

function App() {
  const { data, isLoading, isError, error } = useFilterOptions()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <p className="text-txt-secondary">Loading filter options...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">Error!</p>
          <p className="text-txt-secondary mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base text-txt-primary p-8">
      <h1 className="text-4xl font-extrabold mb-8">
        KINO <span className="text-primary">XII</span> — API Test
      </h1>

      <div className="space-y-6">
        <div className="bg-bg-surface p-6 rounded-card">
          <h2 className="text-2xl font-bold mb-4">Venues ({data?.venues.length})</h2>
          <ul className="space-y-2">
            {data?.venues.map((venue) => (
              <li key={venue.id} className="text-txt-secondary">
                <span className="text-txt-primary font-semibold">{venue.name}</span>
                {' — '}
                {venue.city}
                {' — '}
                <span className="text-xs">{venue.formats.length} formats</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-bg-surface p-6 rounded-card">
          <h2 className="text-2xl font-bold mb-4">Formats ({data?.formats.length})</h2>
          <div className="flex flex-wrap gap-2">
            {data?.formats.map((format) => (
              <span
                key={format.id}
                className="px-3 py-1 bg-bg-elevated rounded-input text-sm"
              >
                {format.name} {format.priceUplift > 0 && `+₾${format.priceUplift}`}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-bg-surface p-6 rounded-card">
          <h2 className="text-2xl font-bold mb-4">Rules</h2>
          <p className="text-txt-secondary">
            Max seats per order: <span className="text-primary font-bold">{data?.maxSeatsPerOrder}</span>
          </p>
          <p className="text-txt-secondary">
            Hold duration: <span className="text-primary font-bold">{data?.holdMinutes} minutes</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App