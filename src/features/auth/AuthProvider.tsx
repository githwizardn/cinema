import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from './authStore'
import { getMe } from '../../api/auth'
import { tokenStorage } from '../../lib/storage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearAuth } = useAuthStore()

  // Boot-ზე: თუ token გვაქვს localStorage-ში → /me გამოძახება
  useEffect(() => {
    const token = tokenStorage.get()
    if (!token) return

    getMe()
      .then((user) => setUser(user))
      .catch(() => clearAuth())
  }, [setUser, clearAuth])

  return <>{children}</>
}