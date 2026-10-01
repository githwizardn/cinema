import { create } from 'zustand'
import type { Order } from '../../api/types'

export type BookingStep = 1 | 2 | 3

export interface SelectedSeat {
  seatId: number
  code: string
  ticketType: string
}

interface BookingState {
  isOpen: boolean
  sessionId: number | null
  step: BookingStep
  selectedSeats: SelectedSeat[]
  holdId: string | null
  expiresAt: string | null
  subtotal: number
  order: Order | null

  open: (sessionId: number) => void
  close: () => void
  setStep: (step: BookingStep) => void
  toggleSeat: (seat: { seatId: number; code: string }) => void
  setSeatTicketType: (seatId: number, ticketType: string) => void
  clearSeats: () => void
  setHold: (holdId: string, expiresAt: string, subtotal: number) => void
  setOrder: (order: Order) => void
  reset: () => void
}

export const MAX_SEATS = 3

export const useBookingStore = create<BookingState>((set, get) => ({
  isOpen: false,
  sessionId: null,
  step: 1,
  selectedSeats: [],
  holdId: null,
  expiresAt: null,
  subtotal: 0,
  order: null,

  open: (sessionId) =>
    set({
      isOpen: true,
      sessionId,
      step: 1,
      selectedSeats: [],
      holdId: null,
      expiresAt: null,
      subtotal: 0,
      order: null,
    }),

  close: () => set({ isOpen: false }),

  setStep: (step) => set({ step }),

  toggleSeat: (seat) => {
    const { selectedSeats } = get()
    const existing = selectedSeats.find((s) => s.seatId === seat.seatId)
    if (existing) {
      set({ selectedSeats: selectedSeats.filter((s) => s.seatId !== seat.seatId) })
    } else {
      if (selectedSeats.length >= MAX_SEATS) return
      set({
        selectedSeats: [
          ...selectedSeats,
          { seatId: seat.seatId, code: seat.code, ticketType: 'adult' },
        ],
      })
    }
  },

  setSeatTicketType: (seatId, ticketType) => {
    set({
      selectedSeats: get().selectedSeats.map((s) =>
        s.seatId === seatId ? { ...s, ticketType } : s
      ),
    })
  },

  clearSeats: () => set({ selectedSeats: [] }),

  setHold: (holdId, expiresAt, subtotal) => set({ holdId, expiresAt, subtotal }),

  setOrder: (order) => set({ order }),

  reset: () =>
    set({
      isOpen: false,
      sessionId: null,
      step: 1,
      selectedSeats: [],
      holdId: null,
      expiresAt: null,
      subtotal: 0,
      order: null,
    }),
}))