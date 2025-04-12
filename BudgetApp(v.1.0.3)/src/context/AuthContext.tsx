"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { LocalStorage, STORAGE_KEYS } from "../utils/storage"

// Simple function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  isLoading: boolean
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await LocalStorage.getData(STORAGE_KEYS.USER_DATA)
        if (storedUser) {
          setUser(storedUser)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if user already exists
      const users = await LocalStorage.getData(STORAGE_KEYS.USERS) || []
      const existingUser = users.find((u: User) => u.email === email)
      
      if (existingUser) {
        throw new Error("User with this email already exists")
      }

      // Create new user
      const newUser: User = {
        id: generateId(),
        email,
        displayName: name,
        createdAt: new Date().toISOString(),
      }

      // Save user to users list
      users.push(newUser)
      await LocalStorage.saveData(STORAGE_KEYS.USERS, users)

      // Save current user
      await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, newUser)
      setUser(newUser)

    } catch (error: any) {
      console.error("Error signing up:", error)
      setError(error.message || "An error occurred during sign up")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Get users list
      const users = await LocalStorage.getData(STORAGE_KEYS.USERS) || []
      const user = users.find((u: User) => u.email === email)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Save current user
      await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, user)
      setUser(user)

    } catch (error: any) {
      console.error("Error signing in:", error)
      setError(error.message || "Invalid email or password")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logOut = async () => {
    try {
      setIsLoading(true)
      await LocalStorage.removeData(STORAGE_KEYS.USER_DATA)
      setUser(null)
    } catch (error: any) {
      console.error("Error signing out:", error)
      setError(error.message || "An error occurred during sign out")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!user) {
        throw new Error("No user is currently signed in")
      }

      // Update user in users list
      const users = await LocalStorage.getData(STORAGE_KEYS.USERS) || []
      const updatedUsers = users.map((u: User) => {
        if (u.id === user.id) {
          return {
            ...u,
            ...data,
            updatedAt: new Date().toISOString(),
          }
        }
        return u
      })
      await LocalStorage.saveData(STORAGE_KEYS.USERS, updatedUsers)

      // Update current user
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      await LocalStorage.saveData(STORAGE_KEYS.USER_DATA, updatedUser)
      setUser(updatedUser)

    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        logOut,
        isLoading,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
