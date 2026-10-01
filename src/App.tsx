import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { SessionsPage } from './pages/SessionsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App