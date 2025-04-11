import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Account } from "./types"

const COLLECTION = "accounts"

// Create a new account
export const addAccount = async (account: Omit<Account, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding account:", error)
    throw error
  }
}

// Get an account by ID
export const getAccount = async (id: string): Promise<Account | null> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Account
    }
    return null
  } catch (error) {
    console.error("Error getting account:", error)
    throw error
  }
}

// Get all accounts for a user
export const getUserAccounts = async (userId: string): Promise<Account[]> => {
  try {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("name"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Account
    })
  } catch (error) {
    console.error("Error getting user accounts:", error)
    throw error
  }
}

// Update an account
export const updateAccount = async (id: string, account: Partial<Account>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...account,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating account:", error)
    throw error
  }
}

// Delete an account
export const deleteAccount = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}

// Listen to accounts for a user in real-time
export const subscribeToUserAccounts = (userId: string, callback: (accounts: Account[]) => void) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("name"))

  return onSnapshot(
    q,
    (querySnapshot) => {
      const accounts = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Account
      })
      callback(accounts)
    },
    (error) => {
      console.error("Error listening to accounts:", error)
    },
  )
}
