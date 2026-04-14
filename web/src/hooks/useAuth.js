import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseReady } from '../firebase.js'

/**
 * Tracks Firebase Auth user and `users/{uid}` profile (role, tenantId, etc.).
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseReady() || !auth || !db) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
        return
      }
      try {
        const snap = await getDoc(doc(db, 'users', u.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } catch {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const role = profile?.role ?? null

  return { user, profile, role, loading }
}
