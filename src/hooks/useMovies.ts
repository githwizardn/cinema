import { useQuery } from '@tanstack/react-query'
import { getFeatured, getNowPlaying, getComingSoon, getMovie, getMovieSessions } from '../api/catalogue'

export function useFeatured() {
  return useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: getFeatured,
    staleTime: 5 * 60 * 1000,
  })
}

export function useNowPlaying(limit?: number) {
  return useQuery({
    queryKey: ['movies', 'now-playing', limit],
    queryFn: () => getNowPlaying(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useComingSoon(limit?: number) {
  return useQuery({
    queryKey: ['movies', 'coming-soon', limit],
    queryFn: () => getComingSoon(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMovie(slug: string) {
  return useQuery({
    queryKey: ['movies', slug],
    queryFn: () => getMovie(slug),
    enabled: !!slug,
  })
}

export function useMovieSessions(slug: string, date?: string) {
  return useQuery({
    queryKey: ['movies', slug, 'sessions', date],
    queryFn: () => getMovieSessions(slug, date),
    enabled: !!slug,
  })
}