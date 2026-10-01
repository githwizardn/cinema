import { api } from './client'
import type { FilterOptions, Movie, MovieDetail } from './types'

// ============ FILTER OPTIONS ============
// Boot-ზე ერთხელ იტვირთება და cache-ში რჩება
export async function getFilterOptions(): Promise<FilterOptions> {
  const { data } = await api.get<{ data: FilterOptions }>('/filter-options')
  return data.data
}

// ============ NOW PLAYING ============
export async function getNowPlaying(limit?: number): Promise<Movie[]> {
  const { data } = await api.get<{ data: Movie[] }>('/movies/now-playing', {
    params: limit ? { limit } : undefined,
  })
  return data.data
}

// ============ COMING SOON ============
export async function getComingSoon(limit?: number): Promise<Movie[]> {
  const { data } = await api.get<{ data: Movie[] }>('/movies/coming-soon', {
    params: limit ? { limit } : undefined,
  })
  return data.data
}

// ============ FEATURED (Hero) ============
export async function getFeatured(): Promise<Movie[]> {
  const { data } = await api.get<{ data: Movie[] }>('/movies/featured')
  return data.data
}

// ============ MOVIE DETAIL ============
export async function getMovie(slug: string): Promise<MovieDetail> {
  const { data } = await api.get<{ data: MovieDetail }>(`/movies/${slug}`)
  return data.data
}

// ============ SEARCH ============
export async function searchMovies(q: string): Promise<Movie[]> {
  if (!q.trim()) return []
  const { data } = await api.get<{ data: Movie[] }>('/search', {
    params: { q },
  })
  return data.data
}

// ============ NOTIFY ME ============
export async function notifyMe(slug: string): Promise<void> {
  await api.post(`/movies/${slug}/notify`)
}