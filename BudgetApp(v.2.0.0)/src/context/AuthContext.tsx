"use client"

import React, { createContext, useState, useEffect } from "react"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth"
import { User } from "../types/user"
import { auth } from "../config/firebase"
import { LocalStorage } from "../utils/LocalStorage"
import { STORAGE_KEYS } from "../constants/storageKeys"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Clear all local storage data
  const clearLocalData = async () => {
    try {
      await LocalStorage.clearAll()
    } catch (error) {
      console.error('Error clearing local data:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Clear local data if the user ID has changed
        const localUserData = await LocalStorage.getData(STORAGE_KEYS.USER_DATA)
        if (localUserData && localUserData.id !== firebaseUser.uid) {
          await clearLocalData()
        }

        // Create new user data
        const newUserData = {
          id: firebaseUser.uid,
          displayName: localUserData?.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          photoURL: null,
          location: '',
          subscription: null
        }

        // Save new user data
        await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, newUserData)
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: newUserData.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Clear any existing data
      await clearLocalData()
      
      // Store new user data
      const userData = {
        id: userCredential.user.uid,
        displayName: name,
        email: userCredential.user.email || '',
        photoURL: null,
        location: '',
        subscription: null
      }
      await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, userData)
      
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: name,
      })
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Clear any existing data
      await clearLocalData()
      
      // Get or create user data
      const localUserData = await LocalStorage.getData(STORAGE_KEYS.USER_DATA)
      const userData = {
        id: userCredential.user.uid,
        displayName: localUserData?.displayName || userCredential.user.email?.split('@')[0] || '',
        email: userCredential.user.email || '',
        photoURL: null,
        location: '',
        subscription: null
      }
      
      // Save user data
      await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, userData)
      
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userData.displayName,
      })
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await clearLocalData()
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
