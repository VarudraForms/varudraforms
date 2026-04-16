import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { pathForRole } from '../lib/rolePaths.js'
import HomePage from './HomePage.jsx'

/** Public home, or send signed-in users to the right dashboard. */
export default function HomeGate() {
  const { user, profile, role, loading } = useAuth()

  if (loading) {
    return <p className="p-6 text-center text-slate-600">Loading…</p>
  }

  if (!user) {
    return <HomePage />
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <p className="text-slate-800">
          You are signed in, but there is no Firestore document at{' '}
          <code className="text-sm">{`users/${user.uid}`}</code>.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Create it in Firebase Console with fields like{' '}
          <code className="text-xs">role</code>, <code className="text-xs">tenantId</code>
          .
        </p>
      </div>
    )
  }

  if (role) {
    return <Navigate to={pathForRole(role)} replace />
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center text-slate-800">
      Profile exists but <code className="text-xs">role</code> is missing or unknown.
    </div>
  )
}
