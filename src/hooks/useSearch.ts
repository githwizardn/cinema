import { useQuery } from '@tanstack/react-query'
import { searchMovies } from '../api/catalogue'
import { useEffect, useState } from 'react'

// Simple debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function useSearch(query: string) {
  const debounced = useDebounce(query.trim(), 300)

  return useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchMovies(debounced),
    enabled: debounced.length > 0,
    staleTime: 60 * 1000,
  })
}