import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTickets, refundOrder, type TicketsFilter } from '../api/tickets'

export function useTickets(filter: TicketsFilter) {
  return useQuery({
    queryKey: ['tickets', filter],
    queryFn: () => getTickets(filter),
  })
}

export function useRefundOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reference: string) => refundOrder(reference),
    onSuccess: () => {
      // Refetch both tabs — the order moves from upcoming → past
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}