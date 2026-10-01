import { api } from './client'
import type { Order } from './types'

export type TicketsFilter = 'upcoming' | 'past'

export async function getTickets(filter?: TicketsFilter): Promise<Order[]> {
  const { data } = await api.get<{ data: Order[] }>('/tickets', {
    params: filter ? { filter } : undefined,
  })
  return data.data
}

export async function refundOrder(reference: string): Promise<Order> {
  const { data } = await api.post<{ data: Order }>(
    `/orders/${reference}/refund`
  )
  return data.data
}