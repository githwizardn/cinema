import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

export interface UrlFilters {
  venues: string[]
  formats: string[]
  languages: string[]
  bands: string[]
  date: string | null
  sort: string
  page: number
}

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: UrlFilters = useMemo(
    () => ({
      venues: searchParams.getAll('venues[]'),
      formats: searchParams.getAll('formats[]'),
      languages: searchParams.getAll('languages[]'),
      bands: searchParams.getAll('bands[]'),
      date: searchParams.get('date'),
      sort: searchParams.get('sort') ?? 'time_asc',
      page: parseInt(searchParams.get('page') ?? '1', 10),
    }),
    [searchParams]
  )

  // Update filters — ALWAYS resets page to 1 (unless explicitly setting page)
  const updateFilters = (patch: Partial<UrlFilters>) => {
    const next = new URLSearchParams()

    const merge = { ...filters, ...patch }

    merge.venues.forEach((v) => next.append('venues[]', v))
    merge.formats.forEach((f) => next.append('formats[]', f))
    merge.languages.forEach((l) => next.append('languages[]', l))
    merge.bands.forEach((b) => next.append('bands[]', b))

    if (merge.date) next.set('date', merge.date)
    if (merge.sort && merge.sort !== 'time_asc') next.set('sort', merge.sort)

    // Reset page to 1 unless caller explicitly set a page
    const page = patch.page !== undefined ? patch.page : 1
    if (page > 1) next.set('page', String(page))

    setSearchParams(next)
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    if (filters.date) next.set('date', filters.date)
    setSearchParams(next)
  }

  // Count active filters (excluding date, sort, page)
  const activeCount =
    filters.venues.length +
    filters.formats.length +
    filters.languages.length +
    filters.bands.length

  return {
    filters,
    updateFilters,
    clearFilters,
    activeCount,
  }
}