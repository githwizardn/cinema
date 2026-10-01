import { useQuery } from '@tanstack/react-query'
import { getFeatured, getNowPlaying, getComingSoon } from '../api/catalogue'

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