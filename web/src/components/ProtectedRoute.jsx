import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string[]} props.roles - allowed `users/{uid}.role` values
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, profile, role, loading } = useAuth()

  if (loading) {
    return <p className="p-6 text-center text-slate-600">Loading…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile || !role || !roles.includes(role)) {
    return <Navigate to="/login" replace />
  }

  return children
}
