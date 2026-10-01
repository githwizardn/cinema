import { api } from './client'
import type { SeatMap, SeatHold, Order, Session } from './types'

export async function getSession(sessionId: number): Promise<Session> {
  const { data } = await api.get<{ data: Session }>(`/sessions/${sessionId}`)
  return data.data
}

export async function getSessionSeats(sessionId: number): Promise<SeatMap> {
  const { data } = await api.get<{ data: SeatMap }>(`/sessions/${sessionId}/seats`)
  return data.data
}

export interface HoldSeatPayload {
  seatId: number
  ticketType: string
}

export async function holdSeats(
  sessionId: number,
  seats: HoldSeatPayload[]
): Promise<SeatHold> {
  const { data } = await api.post<{ data: SeatHold }>(
    `/sessions/${sessionId}/holds`,
    { seats }
  )
  return data.data
}

export async function releaseHold(holdId: string): Promise<void> {
  await api.delete(`/holds/${holdId}`)
}

export interface PayOrderPayload {
  holdId: string
  fullName: string
  email: string
  mobileNumber: string
  cardNumber: string
  expiry: string
  cvv: string
}

export async function payOrder(payload: PayOrderPayload): Promise<Order> {
  const { data } = await api.post<{ data: Order }>('/orders', payload)
  return data.data
}