import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ResumePage from './pages/ResumePage'
import MatchPage from './pages/MatchPage'
import ApplicationsPage from './pages/ApplicationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
