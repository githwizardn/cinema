import { useState, useEffect } from 'react'
import type { Movie } from '../api/types'

const STORAGE_KEY = 'kino_recently_viewed'
const MAX_ITEMS = 6

// Store only what we need to render the row — small payload
export interface RecentlyViewedMovie {
  id: number
  slug: string
  title: string
  posterUrl: string | null
  ageRating: Movie['ageRating']
  runtimeMinutes: number
  fromPrice: number
  isComingSoon: boolean
}

function read(): RecentlyViewedMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function write(items: RecentlyViewedMovie[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore (private mode, quota exceeded)
  }
}

export function addRecentlyViewed(movie: Movie) {
  const current = read()
  const filtered = current.filter((m) => m.slug !== movie.slug)
  const entry: RecentlyViewedMovie = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    ageRating: movie.ageRating,
    runtimeMinutes: movie.runtimeMinutes,
    fromPrice: movie.fromPrice,
    isComingSoon: movie.isComingSoon,
  }
  const next = [entry, ...filtered].slice(0, MAX_ITEMS)
  write(next)
}

export function useRecentlyViewed(): RecentlyViewedMovie[] {
  const [items, setItems] = useState<RecentlyViewedMovie[]>([])

  useEffect(() => {
    setItems(read())
  }, [])

  return items
}