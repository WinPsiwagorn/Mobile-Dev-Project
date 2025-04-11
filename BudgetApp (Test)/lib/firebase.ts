import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDqhAt5XllsfGcFnzHOzXDaiEtPq0Cz_zE",
  authDomain: "ww-8082d.firebaseapp.com",
  projectId: "ww-8082d",
  storageBucket: "ww-8082d.appspot.com",
  messagingSenderId: "410780487079",
  appId: "1:410780487079:android:94e073a8d57c862048fa82",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Enable offline persistence for Firestore
// This will cache data locally and sync when online
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firestore persistence failed: Multiple tabs open')
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Firestore persistence not supported by this browser')
    }
  })

export { app, auth, db, storage }
