import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { SessionsPage } from './pages/SessionsPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { AuthModals } from './features/auth/AuthModals'
import { BookingModal } from './components/booking/BookingModal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/movies/:slug" element={<MovieDetailPage />} />
        </Route>
      </Routes>
      <AuthModals />
      <BookingModal />
    </BrowserRouter>
  )
}

export default App