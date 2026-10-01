import { create } from 'zustand'
import type { User } from '../../api/types'
import { tokenStorage } from '../../lib/storage'

// ============ MODAL STATE ============
type AuthModalType = 'login' | 'register' | null

interface AuthModalState {
  openModal: AuthModalType
  openLogin: () => void
  openRegister: () => void
  closeModal: () => void
  switchModal: () => void
}

export const useAuthModal = create<AuthModalState>((set) => ({
  openModal: null,
  openLogin: () => set({ openModal: 'login' }),
  openRegister: () => set({ openModal: 'register' }),
  closeModal: () => set({ openModal: null }),
  switchModal: () =>
    set((state) => ({
      openModal: state.openModal === 'login' ? 'register' : 'login',
    })),
}))

// ============ AUTH STATE ============
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuth: (user, token) => {
    tokenStorage.set(token)
    set({ user, isAuthenticated: true })
  },
  clearAuth: () => {
    tokenStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))

// ============ PENDING ACTION (interrupted action) ============
// როცა user არაავტორიზებულია და აჭერს დაცულ ღილაკს (მაგ. Select Seats),
// ვინახავთ მოქმედებას რომ ავტორიზაციის შემდეგ გავუშვათ.
interface PendingActionStore {
  pendingAction: (() => void) | null
  setPendingAction: (action: () => void) => void
  runPendingAction: () => void
  clearPendingAction: () => void
}

export const usePendingAction = create<PendingActionStore>((set, get) => ({
  pendingAction: null,
  setPendingAction: (action) => set({ pendingAction: action }),
  runPendingAction: () => {
    const action = get().pendingAction
    if (action) {
      action()
      set({ pendingAction: null })
    }
  },
  clearPendingAction: () => set({ pendingAction: null }),
}))