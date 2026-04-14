import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseReady } from '../firebase.js'
import { useAuth } from '../hooks/useAuth.js'
import { pathForRole } from '../lib/rolePaths.js'

export default function Login() {
  const navigate = useNavigate()
  const { user, role, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (loading) {
    return <p className="p-6 text-center text-slate-600">Loading…</p>
  }

  if (user && role) {
    return <Navigate to={pathForRole(role)} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!isFirebaseReady() || !auth) {
      setError('Firebase is not configured. Check web/.env.local.')
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign-in failed')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-600">
        <Link className="text-blue-600 underline" to="/">
          ← Home
        </Link>
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
           {user && !role ? (
        <p className="mt-4 text-sm text-amber-800">
          Signed in, but no Firestore profile at{' '}
          <code className="text-xs">{`users/${user.uid}`}</code>. Add{' '}
          <code className="text-xs">role</code>, <code className="text-xs">tenantId</code>,
          etc. in Firebase Console.
        </p>
      ) : null}
    </div>
  )
}
