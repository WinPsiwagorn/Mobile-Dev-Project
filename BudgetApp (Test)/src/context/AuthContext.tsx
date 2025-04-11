"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

interface AuthContextType {
  user: any
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogleProvider: () => Promise<void>
  logOut: () => Promise<void>
  isLoading: boolean
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          console.log('Fetching user data from Firestore...');
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            console.log('User document exists, updating user state');
            setUser({ ...user, ...userDoc.data() });
          } else {
            // If user document doesn't exist, create it with basic info
            console.log('User document does not exist, creating it');
            try {
              const userData = {
                displayName: user.displayName || "User",
                email: user.email,
                createdAt: new Date().toISOString(),
              };
              
              await setDoc(doc(db, "users", user.uid), userData);
              console.log('User document created successfully');
              setUser({ ...user, ...userData });
            } catch (docError) {
              console.error("Error creating user document:", docError);
              // Still set the user even if Firestore fails
              setUser(user);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Still set the user even if Firestore fails
          setUser(user);
        }
      } else {
        console.log('No user is signed in');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        })

        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          displayName: name,
          email: email,
          createdAt: new Date().toISOString(),
        })
      }
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
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error("Error signing in:", error)
      setError(error.message || "Invalid email or password")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogleProvider = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Create or update user document in Firestore
      if (result.user) {
        await setDoc(doc(db, "users", result.user.uid), {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          lastLogin: new Date().toISOString(),
        }, { merge: true })
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      setError(error.message || "Failed to sign in with Google")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logOut = async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
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
      setIsLoading(true);
      setError(null);
      
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in");
      }

      // Update the user's profile in Firebase Auth
      try {
        await updateProfile(auth.currentUser, data);
        console.log('Firebase Auth profile updated successfully');
      } catch (authError) {
        console.error("Error updating Firebase Auth profile:", authError);
        // Continue with Firestore update even if Auth update fails
      }
      
      // Update the user's data in Firestore
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          ...data,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log('Firestore document updated successfully');
      } catch (firestoreError) {
        console.error("Error updating Firestore document:", firestoreError);
        // Continue with local state update even if Firestore update fails
      }
      
      // Update the local user state
      setUser((prevUser: any) => ({
        ...prevUser,
        ...data,
      }));
      
      console.log('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogleProvider,
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
