import { FilterSidebar } from '../components/session/FilterSidebar'
import { SessionsList } from '../components/session/SessionsList'

export function SessionsPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-8 py-8">
      {/* Page header */}
      <h1 className="text-h2 font-extrabold text-txt-primary mb-8">Sessions</h1>

      {/* Layout: sticky sidebar + list */}
      <div className="flex gap-8 items-start">
        <aside className="w-64 shrink-0 sticky top-24">
          <FilterSidebar />
        </aside>

        <main className="flex-1 min-w-0">
          <SessionsList />
        </main>
      </div>
    </div>
  )
}