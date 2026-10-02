import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { SessionsPage } from './pages/SessionsPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { AuthModals } from './features/auth/AuthModals'
import { BookingModal } from './components/booking/BookingModal'
import { useAuthStore, useAuthModal, usePendingAction } from './features/auth/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const { openLogin } = useAuthModal()
  const { setPendingAction } = usePendingAction()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      // 🎯 Store pending action — navigate to this path after login
      const path = location.pathname + location.search
      setPendingAction(() => () => {
        window.history.pushState({}, '', path)
        window.dispatchEvent(new PopStateEvent('popstate'))
      })
      openLogin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/movies/:slug" element={<MovieDetailPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <AuthModals />
      <BookingModal />
    </BrowserRouter>
  )
}

export default App