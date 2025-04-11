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
  Timestamp,
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Transaction } from "./types"

const COLLECTION = "transactions"

// Create a new transaction
export const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...transaction,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw error
  }
}

// Get a transaction by ID
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Transaction
    }
    return null
  } catch (error) {
    console.error("Error getting transaction:", error)
    throw error
  }
}

// Get all transactions for a user
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("date", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Transaction
    })
  } catch (error) {
    console.error("Error getting user transactions:", error)
    throw error
  }
}

// Update a transaction
export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await updateDoc(docRef, {
      ...transaction,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting transaction:", error)
    throw error
  }
}

// Listen to transactions for a user in real-time
export const subscribeToUserTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("date", "desc"))

  return onSnapshot(
    q,
    (querySnapshot) => {
      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Transaction
      })
      callback(transactions)
    },
    (error) => {
      console.error("Error listening to transactions:", error)
    },
  )
}
