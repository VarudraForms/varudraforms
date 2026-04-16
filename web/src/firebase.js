import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
} from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function hasRequiredConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

let app = null
if (hasRequiredConfig()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
}

function getOrInitFirestore(firebaseApp) {
  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    })
  } catch {
    return getFirestore(firebaseApp)
  }
}

export const auth = app ? getAuth(app) : null
export const db = app ? getOrInitFirestore(app) : null
export const storage = app ? getStorage(app) : null

const useEmulator =
  import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true'

if (useEmulator && app && auth && db && storage) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
    connectStorageEmulator(storage, '127.0.0.1', 9199)
  } catch {
    // Already connected in this session
  }
}

export function isFirebaseReady() {
  return app !== null
}
