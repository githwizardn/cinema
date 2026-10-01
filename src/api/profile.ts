import { api } from './client'
import type { User } from './types'

export interface UpdateProfilePayload {
  fullName: string
  mobileNumber: string
  dateOfBirth: string
  preferredVenueId?: number | null
  avatar?: File | null
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const formData = new FormData()
  formData.append('fullName', payload.fullName)
  formData.append('mobileNumber', payload.mobileNumber)
  formData.append('dateOfBirth', payload.dateOfBirth)

  if (payload.preferredVenueId) {
    formData.append('preferredVenueId', String(payload.preferredVenueId))
  }
  if (payload.avatar) {
    formData.append('avatar', payload.avatar)
  }

  const { data } = await api.put<{ data: User }>('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}