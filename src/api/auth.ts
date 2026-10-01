import { api } from './client'
import type { User } from './types'

export interface AuthResponse {
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse }>('/login', { email, password })
  return data.data
}

export async function register(formData: FormData): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse }>('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ data: User }>('/me')
  return data.data
}