import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSession,
  getSessionSeats,
  holdSeats,
  payOrder,
  releaseHold,
} from '../api/booking'
import { isConflictError } from '../api/client'
import { useBookingStore } from '../features/booking/bookingStore'
import type { ApiError } from '../api/types'

export function useSession(sessionId: number | null) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useSessionSeats(sessionId: number | null) {
  return useQuery({
    queryKey: ['seats', sessionId],
    queryFn: () => getSessionSeats(sessionId!),
    enabled: !!sessionId,
  })
}

export function useHoldSeats() {
  const queryClient = useQueryClient()
  const { sessionId, selectedSeats, setHold, setStep } = useBookingStore()

  return useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error('No session selected')
      return holdSeats(
        sessionId,
        selectedSeats.map((s) => ({ seatId: s.seatId, ticketType: s.ticketType }))
      )
    },
    onSuccess: (data) => {
      setHold(data.holdId, data.expiresAt, data.subtotal)
      setStep(2)
    },
    onError: (err) => {
      const error = err as ApiError
      if (isConflictError(error)) {
        // 409 — contested seats — remove them from selection, keep rest
        const codesToRemove = error.contested ?? []
        const remaining = useBookingStore
          .getState()
          .selectedSeats.filter((s) => !codesToRemove.includes(s.code))
        useBookingStore.setState({ selectedSeats: remaining })
        // Refetch seat map
        queryClient.invalidateQueries({ queryKey: ['seats', sessionId] })
      }
    },
  })
}

export function usePayOrder() {
  const queryClient = useQueryClient()
  const { sessionId, setOrder, setStep } = useBookingStore()

  return useMutation({
    mutationFn: payOrder,
    onSuccess: (order) => {
      // ✅ ახლა მთლიანი order object-ს ვინახავთ
      setOrder(order)
      setStep(3)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['seats', sessionId] })
    },
  })
}

export function useReleaseHold() {
  return useMutation({ mutationFn: releaseHold })
}