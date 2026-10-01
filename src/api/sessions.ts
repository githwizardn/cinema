import { api } from './client'
import type { SessionsResponse } from './types'

export interface SessionsFilters {
  venues?: string[]
  formats?: string[]
  languages?: string[]
  bands?: string[]
  date?: string
  search?: string
  sort?: string
  page?: number
}

export async function getSessions(filters: SessionsFilters): Promise<SessionsResponse> {
  const params: Record<string, string | string[] | number> = {}

  if (filters.venues?.length) params['venues[]'] = filters.venues
  if (filters.formats?.length) params['formats[]'] = filters.formats
  if (filters.languages?.length) params['languages[]'] = filters.languages
  if (filters.bands?.length) params['bands[]'] = filters.bands
  if (filters.date) params.date = filters.date
  if (filters.search) params.search = filters.search
  if (filters.sort) params.sort = filters.sort
  if (filters.page) params.page = filters.page

  const { data } = await api.get<SessionsResponse>('/sessions', { params })
  return data
}