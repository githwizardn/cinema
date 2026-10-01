import { useQuery } from '@tanstack/react-query'
import { getSessions, type SessionsFilters } from '../api/sessions'

export function useSessions(filters: SessionsFilters) {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => getSessions(filters),
    // 30 წამი — ხშირად არ იცვლება
    staleTime: 30 * 1000,
  })
}