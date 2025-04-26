import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBxbHFcKNtvEJBJELDWUURZSmMrVilYL0E",
  authDomain: "projectbudgetingapp.firebaseapp.com",
  projectId: "projectbudgetingapp",
  storageBucket: "projectbudgetingapp.firebasestorage.app",
  messagingSenderId: "612429025341",
  appId: "1:612429025341:web:5a6bc28f3baee211fe9a54"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app) 