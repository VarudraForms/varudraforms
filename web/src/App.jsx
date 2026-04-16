import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuditorView from './pages/AuditorView.jsx'
import HomeGate from './pages/HomeGate.jsx'
import Login from './pages/Login.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import SupervisorHome from './pages/SupervisorHome.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute roles={['supervisor']}>
              <SupervisorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auditor"
          element={
            <ProtectedRoute roles={['auditor', 'ca']}>
              <AuditorView />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
