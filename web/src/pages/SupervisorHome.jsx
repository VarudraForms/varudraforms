import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useAuth } from '../hooks/useAuth.js'

export default function SupervisorHome() {
  const { user, profile } = useAuth()

  async function handleSignOut() {
    if (auth) await signOut(auth)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Supervisor</h1>
      <p className="mt-2 text-slate-600">
        {user?.email} · shed: {profile?.shed ?? '—'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="text-blue-600 underline" to="/">
          Home
        </Link>
        <button
          type="button"
          className="text-slate-600 underline"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
