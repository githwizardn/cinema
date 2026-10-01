import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { SessionsPage } from './pages/SessionsPage'
import { AuthModals } from './features/auth/AuthModals'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Route>
      </Routes>
      {/* Auth modals ყოველ გვერდზე ხელმისაწვდომია */}
      <AuthModals />
    </BrowserRouter>
  )
}

export default App